import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser middleware
  app.use(express.json());

  // CORS proxy route to bypass browser CORS restrictions for KWh Meter API
  app.get("/api/kwh-proxy", async (req, res) => {
    const deviceId = (req.query.id as string) || "E83DC19F498C";
    const targetUrl = `https://kwhmeter2.pojiweb.online/api/web/data?id=${encodeURIComponent(deviceId)}`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "KWh-Meter-Monitoring-Client/1.0",
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: `Remote API responded with status ${response.status}`,
        });
      }

      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(data);
    } catch (error: any) {
      console.error("CORS Proxy Error:", error?.message || error);
      res.status(502).json({
        success: false,
        error: "Failed to fetch from target KWh meter API endpoint",
        details: error?.message || String(error),
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite development middleware or static production fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
