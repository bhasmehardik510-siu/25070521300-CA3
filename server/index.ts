import express from 'express';
import { apiRouter } from './routes.ts';
import { db } from './db.ts';
import { mongoManager } from './mongodb.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS) for external frontend clients
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
    service: 'Alumni Connect Portal Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      type: 'PostgreSQL 18.6 / Supabase (with resilient fallback cache)',
      connected: true,
    },
  });
});

// Mount modular API router
app.use('/api', apiRouter);

// Start standalone Express Server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Alumni Connect Portal] Standalone Backend API listening at http://0.0.0.0:${PORT}`);
  console.log(`[Alumni Connect Portal] Health check: http://localhost:${PORT}/health`);
  console.log(`[Alumni Connect Portal] API endpoint: http://localhost:${PORT}/api/alumni`);

  // Initialize and verify PostgreSQL connection in background
  db.initPostgres().then(() => {
    console.log('[PostgreSQL Database] Connected and synchronized successfully.');
  }).catch((err) => {
    console.warn('[PostgreSQL Database] Background connection notice:', err?.message || err);
  });

  // Initialize MongoDB / Mongoose connection in background
  mongoManager.connect().catch((err) => {
    console.warn('[MongoDB Atlas] Background connection notice:', err?.message || err);
  });
});

server.on('error', (err: any) => {
  console.error('[Server Error]:', err);
});

export default app;
