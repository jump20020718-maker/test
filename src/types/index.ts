export type Intent =
  | 'product_qa'
  | 'order_query'
  | 'customs_query'
  | 'logistics_query'
  | 'address_change'
  | 'aftersales'
  | 'recommendation'
  | 'export_compliance'
  | 'unknown';

export interface AgentResponse {
  intent: Intent;
  answer: string;
  usedTools: string[];
  confidence: number;
  complianceFlags: string[];
  suggestedNextAction: string[];
}

export interface Order {
  id: string;
  channel: 'bonded' | 'direct_mail';
  status: string;
  canChangeAddress: boolean;
  createdAt: string;
}

export interface LogisticsRecord {
  orderId: string;
  carrier: string;
  canDeliverRural: boolean;
  etaDays: string;
  tracking: Array<{ time: string; node: string }>;
}

export interface CustomsRecord {
  orderId: string;
  status: string;
  reason?: string;
  requiredDocs?: string[];
  taxHint?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  features: string[];
  suitableFor: string[];
  cautions?: string[];
  certifications?: string[];
}
