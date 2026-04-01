import { Router } from 'express';
import { handleChat } from '../agent/orchestrator';

const router = Router();

router.post('/chat', async (req, res) => {
  const message = String(req.body?.message ?? '').trim();
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  const result = await handleChat(message);
  return res.json(result);
});

export default router;
