import orders from '../data/orders.json';
import { Order } from '../types';

export function queryOrder(orderId: string): Order | null {
  return ((orders as Order[]).find((o) => o.id === orderId) ?? null);
}
