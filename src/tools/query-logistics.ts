import logistics from '../data/logistics.json';
import { LogisticsRecord } from '../types';

export function queryLogistics(orderId: string): LogisticsRecord | null {
  return ((logistics as LogisticsRecord[]).find((l) => l.orderId === orderId) ?? null);
}
