import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { runLedgerBackup, startBackupScheduler } from "./server/backupService";
import { runDatabaseSeeder } from "./server/seeder";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // Scheduled Database & Ledger Backups Support
  app.post("/api/admin/backups/run", async (req, res) => {
    try {
      const result = await runLedgerBackup();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || String(err) });
    }
  });

  app.get("/api/admin/backups/logs", async (req, res) => {
    try {
      const { supabase } = await import("./server/supabase");
      const { data, error } = await supabase
        .from("backup_logs")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(50);
        
      if (error) throw error;
      res.json({ success: true, logs: data || [] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || String(err) });
    }
  });

  // AI API Route
  app.post("/api/ai/insights", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ result: "Gemini API key is not configured on the server. Please set GEMINI_API_KEY." });
      }
      
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      const prompt = req.body.prompt || "Generate a brief business insight.";
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });
      res.json({ result: response.text });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.json({ result: "AI Assistant is currently unavailable. Please check your API key configuration." });
    }
  });
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support React Router HTML5 History API fallback
    // Only serve index.html for navigation requests, not for missing static assets or files with extensions
    app.get('*', (req, res) => {
      if (req.path.includes('.') || req.path.startsWith('/assets/')) {
        res.status(404).send('Not Found');
      } else {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }
  
  // Start the background automatic helper scheduler
  startBackupScheduler();

  // Run database check, superadmin setup, and clean seeding
  try {
    await runDatabaseSeeder();
  } catch (err) {
    console.error("[Startup] Failed to run database seeder:", err);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
