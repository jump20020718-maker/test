import customs from '../data/customs.json';
import { CustomsRecord } from '../types';

export function queryCustoms(orderId: string): CustomsRecord | null {
  return ((customs as CustomsRecord[]).find((c) => c.orderId === orderId) ?? null);
}
