import express from 'express';
import chatRoutes from './routes/chat';
import opsRoutes from './routes/ops';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', chatRoutes);
  app.use('/api', opsRoutes);

  return app;
}
