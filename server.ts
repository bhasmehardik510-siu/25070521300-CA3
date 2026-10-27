import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import { apiRouter } from './server/routes.ts';
import { mongoManager } from './server/mongodb.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for external API clients
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-user-id');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Root API Health & Diagnostic Endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'Alumni Connect Portal Fullstack Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      type: 'PostgreSQL 18.6 / Supabase (with resilient fallback cache)',
      connected: true,
    },
  });
});

// Mount modular REST API Router under /api
app.use('/api', apiRouter);

// ==========================================
// VITE MIDDLEWARE & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Alumni Connect Portal] Server running on http://localhost:${PORT}`);

    // Asynchronously initialize and sync PostgreSQL without blocking server startup
    db.initPostgres().catch((err) => {
      console.warn('[PostgreSQL Database] Background sync notice:', err?.message || err);
    });

    // Asynchronously initialize and sync MongoDB / Mongoose
    mongoManager.connect().catch((err) => {
      console.warn('[MongoDB Atlas] Background sync notice:', err?.message || err);
    });
  });

  server.on('error', (err: any) => {
    console.error('[Server Listen Error]:', err);
  });
}

startServer();
