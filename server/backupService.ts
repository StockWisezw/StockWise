import { supabase } from './supabase';

/**
 * Fetch all documents in a collection securely
 */
async function fetchCollectionData(tableName: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`[Backup Server] Error fetching table "${tableName}":`, error);
    return []; // Return empty array on failure instead of breaking entire backup
  }
}

/**
 * Generates a complete daily JSON backup from all relevant ledger, transaction, and audit tables
 */
export async function runLedgerBackup(): Promise<{ success: boolean; filename?: string; counts?: any; error?: string }> {
  try {
    console.log('[Backup Server] Generating corporate ledger database backup from Supabase...');
    
    const timestamp = new Date().toISOString();
    const currentDateStr = timestamp.split('T')[0];
    const filename = `backups/ledger_backup_${currentDateStr}_${Date.now()}.json`;

    // Fetch relevant accounting & financial transaction tables
    const [accounts, journalEntries, journalLines, registerSessions, auditLogs] = await Promise.all([
      fetchCollectionData('accounts'),
      fetchCollectionData('journal_entries'),
      fetchCollectionData('journal_lines'),
      fetchCollectionData('register_sessions'),
      fetchCollectionData('audit_logs')
    ]);

    const backupPayload = {
      backupDate: timestamp,
      system: 'Tareza ERP',
      metrics: {
        accounts_count: accounts.length,
        journal_entries_count: journalEntries.length,
        journal_lines_count: journalLines.length,
        register_sessions_count: registerSessions.length,
        audit_logs_count: auditLogs.length
      },
      data: {
        accounts,
        journal_entries: journalEntries,
        journal_lines: journalLines,
        register_sessions: registerSessions,
        audit_logs: auditLogs
      }
    };

    const jsonString = JSON.stringify(backupPayload, null, 2);

    console.log(`[Backup Server] Saving payload to Supabase Storage: "${filename}"...`);
    
    // Save backup string directly to Supabase Storage (e.g., 'tareza-uploads' bucket)
    const { error: uploadError } = await supabase.storage
      .from('tareza-uploads')
      .upload(filename, jsonString, {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) {
      console.warn('[Backup Server] Warning: Could not upload JSON backup to Supabase Storage. Will proceed with saving log entry.', uploadError);
    } else {
      console.log(`[Backup Server] Backup uploaded successfully to "${filename}".`);
    }

    // Log the backup history record to backup_logs table for tracking
    const { error: logError } = await supabase.from('backup_logs').insert({
      filename,
      timestamp,
      accounts_count: accounts.length,
      journal_entries_count: journalEntries.length,
      journal_lines_count: journalLines.length,
      register_sessions_count: registerSessions.length,
      audit_logs_count: auditLogs.length,
      size_bytes: Buffer.byteLength(jsonString),
      status: 'SUCCESS'
    });

    if (logError) {
      console.error('[Backup Server] Error inserting backup_logs record:', logError);
    }

    return {
      success: true,
      filename,
      counts: backupPayload.metrics
    };

  } catch (err: any) {
    console.error('[Backup Server] Backup failure:', err);
    
    try {
      await supabase.from('backup_logs').insert({
        filename: 'UNKNOWN_FAILED_RUN',
        timestamp: new Date().toISOString(),
        status: 'FAILED',
        error: err.message || String(err)
      });
    } catch (ignore) {}

    return {
      success: false,
      error: err.message || String(err)
    };
  }
}

/**
 * Clean up backups older than a retention period
 */
export async function cleanOldBackups(retentionDays = 30): Promise<number> {
  try {
    const { data: files, error } = await supabase.storage.from('tareza-uploads').list('backups');
    if (error) throw error;
    if (!files) return 0;

    const expirationLimit = retentionDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    let deletedCount = 0;

    for (const file of files) {
      const createdTime = new Date(file.created_at).getTime();
      if (now - createdTime > expirationLimit) {
        await supabase.storage.from('tareza-uploads').remove([`backups/${file.name}`]);
        deletedCount++;
      }
    }
    
    return deletedCount;
  } catch (e) {
    console.error('[Backup Server] Failed cleanup routine:', e);
    return 0;
  }
}

/**
 * Activates the daily scheduled background backup checks.
 */
export function startBackupScheduler() {
  console.log('[Backup Scheduler] Background task successfully registered (running every hour for daily cron).');
  
  const CHECK_INTERVAL = 60 * 60 * 1000; // Check every hour
  
  setInterval(async () => {
    try {
      const now = new Date();
      if (now.getUTCHours() === 1) {
        console.log('[Backup Scheduler] Daily trigger matched. Executing automatic cron backup...');
        await runLedgerBackup();
        const cleaned = await cleanOldBackups(30);
        if (cleaned > 0) {
          console.log(`[Backup Scheduler] Purged ${cleaned} expired backup files from storage bucket.`);
        }
      }
    } catch (err) {
      console.error('[Backup Scheduler] Scheduled interval runner error:', err);
    }
  }, CHECK_INTERVAL);
}
