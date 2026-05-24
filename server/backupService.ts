import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase Admin if it hasn't been initialized already
let app: admin.app.App;
if (admin.apps.length === 0) {
  try {
    app = admin.initializeApp({
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket
    });
    console.log('[Backup Server] Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('[Backup Server] Firebase Admin initialization failed:', error);
    app = admin.apps[0] || admin.initializeApp();
  }
} else {
  app = admin.apps[0];
}

// Select the specific database
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

const bucket = admin.storage().bucket();

/**
 * Fetch all documents in a collection securely
 */
async function fetchCollectionData(collectionName: string): Promise<any[]> {
  try {
    const snapshot = await db.collection(collectionName).get();
    const records: any[] = [];
    snapshot.forEach(docSnap => {
      records.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    return records;
  } catch (error) {
    console.error(`[Backup Server] Error fetching collection "${collectionName}":`, error);
    return []; // Return empty array on failure instead of breaking entire backup
  }
}

/**
 * Generates of a complete daily JSON backup from all relevant ledger, transaction, and audit collections
 */
export async function runLedgerBackup(): Promise<{ success: boolean; filename?: string; counts?: any; error?: string }> {
  try {
    console.log('[Backup Server] Generating corporate ledger database backup...');
    
    const timestamp = new Date().toISOString();
    const currentDateStr = timestamp.split('T')[0];
    const filename = `backups/ledger_backup_${currentDateStr}_${Date.now()}.json`;

    // Fetch relevant accounting & financial transaction collections
    const [accounts, journalEntries, journalLines, registerSessions, auditLogs] = await Promise.all([
      fetchCollectionData('accounts'),
      fetchCollectionData('journal_entries'),
      fetchCollectionData('journal_lines'),
      fetchCollectionData('register_sessions'),
      fetchCollectionData('audit_logs')
    ]);

    const backupPayload = {
      backupDate: timestamp,
      databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
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

    // Construct Firebase Storage upload path reference
    const file = bucket.file(filename);
    const jsonString = JSON.stringify(backupPayload, null, 2);

    console.log(`[Backup Server] Saving payload to Firebase Storage: "${filename}"...`);
    
    // Save backup string directly to Google Cloud Storage (Firebase Storage)
    await file.save(jsonString, {
      metadata: {
        contentType: 'application/json',
        metadata: {
          createdBy: 'Tareza Backup Scheduler',
          accountsCount: accounts.length.toString(),
          journalEntriesCount: journalEntries.length.toString(),
          timestamp: timestamp
        }
      },
      resumable: false,
      validation: 'crc32c'
    });

    console.log(`[Backup Server] Backup uploaded successfully to "${filename}". Logging audit metadata...`);

    // Log the backup history record to Firestore for tracking and verification in the developer panel
    await db.collection('backup_logs').add({
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

    return {
      success: true,
      filename,
      counts: backupPayload.metrics
    };

  } catch (err: any) {
    console.error('[Backup Server] Backup failure:', err);
    
    // Record failure in logs if possible
    try {
      await db.collection('backup_logs').add({
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
    const [files] = await bucket.getFiles({ prefix: 'backups/' });
    const now = Date.now();
    const expirationLimit = retentionDays * 24 * 60 * 60 * 1000;
    
    let deletedCount = 0;
    for (const file of files) {
      const [metadata] = await file.getMetadata();
      const createdTime = new Date(metadata.timeCreated).getTime();
      if (now - createdTime > expirationLimit) {
        await file.delete();
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
 * In a long-running instance, this checks every hour and triggers a backup 
 * exactly when the current Hour is 00 UTC.
 */
export function startBackupScheduler() {
  console.log('[Backup Scheduler] Background task successfully registered (running every hours for daily cron).');
  
  const CHECK_INTERVAL = 60 * 60 * 1000; // Check every hour
  
  setInterval(async () => {
    try {
      const now = new Date();
      // Execute only once per day at 1:00 AM UTC
      if (now.getUTCHours() === 1) {
        console.log('[Backup Scheduler] Daily trigger matched. Executing automatic cron backup...');
        await runLedgerBackup();
        // Clean up historic backups older than 30 days automatically
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
