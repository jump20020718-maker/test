import { Router } from 'express';
import { queryOrder } from '../tools/query-order';
import { queryCustoms } from '../tools/query-customs';
import { queryLogistics } from '../tools/query-logistics';

const router = Router();

router.get('/orders/:id', (req, res) => {
  const data = queryOrder(req.params.id.toUpperCase());
  if (!data) return res.status(404).json({ error: 'order not found' });
  return res.json(data);
});

router.get('/customs/:id', (req, res) => {
  const data = queryCustoms(req.params.id.toUpperCase());
  if (!data) return res.status(404).json({ error: 'customs record not found' });
  return res.json(data);
});

router.get('/logistics/:id', (req, res) => {
  const data = queryLogistics(req.params.id.toUpperCase());
  if (!data) return res.status(404).json({ error: 'logistics record not found' });
  return res.json(data);
});

export default router;
