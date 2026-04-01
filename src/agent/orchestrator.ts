import { detectIntent } from './router';
import { buildAnswer } from './answer-builder';
import { applyCompliance } from './policies';
import { AgentResponse } from '../types';
import { queryOrder } from '../tools/query-order';
import { queryCustoms } from '../tools/query-customs';
import { queryLogistics } from '../tools/query-logistics';
import { queryAfterSalesRules } from '../tools/query-after-sales-policy';
import { queryProductCatalog } from '../tools/query-product-catalog';
import { queryKnowledgeBase } from '../tools/query-knowledge-base';
import { buildSpecialPopulationHint, confidenceByIntent } from '../utils/guards';

function extractOrderId(message: string): string | null {
  const m = message.match(/ORD\d{4}/i);
  return m?.[0]?.toUpperCase() ?? null;
}

function mapAfterSalesRule(message: string): string {
  if (/过期|临期|3个月/.test(message)) return 'near_expiry';
  if (/坏了|质保|美容仪/.test(message)) return 'quality_issue_device';
  if (/破了|撒了|破损/.test(message)) return 'damaged_in_transit';
  if (/无理由|不想要/.test(message)) return 'no_reason_return_crossborder';
  return 'warranty_scope';
}

export async function handleChat(message: string): Promise<AgentResponse> {
  const intent = detectIntent(message);
  const usedTools: string[] = [];
  const context: Record<string, unknown> = {};
  const orderId = extractOrderId(message);

  if (intent === 'order_query' && orderId) {
    context.order = queryOrder(orderId);
    usedTools.push('queryOrder');
  }

  if (intent === 'customs_query') {
    if (orderId) {
      context.customs = queryCustoms(orderId);
      usedTools.push('queryCustoms');
      context.order = queryOrder(orderId);
      usedTools.push('queryOrder');
    }
  }

  if (intent === 'logistics_query') {
    if (orderId) {
      context.logistics = queryLogistics(orderId);
      usedTools.push('queryLogistics');
      context.customs = queryCustoms(orderId);
      usedTools.push('queryCustoms');
      context.order = queryOrder(orderId);
      usedTools.push('queryOrder');
    }
  }

  if (intent === 'address_change') {
    if (orderId) {
      context.order = queryOrder(orderId);
      usedTools.push('queryOrder');
    }
  }

  if (intent === 'aftersales') {
    context.rule = queryAfterSalesRules(mapAfterSalesRule(message));
    usedTools.push('queryAfterSalesRules');
  }

  if (intent === 'product_qa') {
    context.kb = queryKnowledgeBase(message);
    usedTools.push('queryKnowledgeBase');
    context.products = queryProductCatalog({ keyword: /雅萌|安热沙|swisse/i.test(message) ? '' : undefined });
    usedTools.push('queryProductCatalog');
  }

  if (intent === 'recommendation') {
    if (/防晒/.test(message) || /敏感肌/.test(message)) {
      context.products = queryProductCatalog({ category: 'sunscreen', suitableFor: '敏感肌' });
    } else if (/精华|抗初老/.test(message)) {
      context.products = queryProductCatalog({ category: 'serum', maxPrice: 500 });
    } else if (/宝宝|儿童|无泪/.test(message)) {
      context.products = queryProductCatalog({ category: 'bodywash', suitableFor: '儿童' });
    } else {
      context.products = queryProductCatalog({ category: 'shampoo', suitableFor: '油性头皮' });
    }
    usedTools.push('queryProductCatalog');
  }

  if (intent === 'export_compliance') {
    context.kb = queryKnowledgeBase(message);
    usedTools.push('queryKnowledgeBase');
    context.products = queryProductCatalog({ keyword: '徕芬' });
    usedTools.push('queryProductCatalog');
  }

  const built = buildAnswer(intent, message, context);
  const specialHints = buildSpecialPopulationHint(message);
  const rawAnswer = `${built.answer}${specialHints.length ? ' ' + specialHints.join(' ') : ''}`;
  const compliance = applyCompliance(intent, rawAnswer);

  return {
    intent,
    answer: compliance.answer,
    usedTools,
    confidence: confidenceByIntent(intent),
    complianceFlags: compliance.flags,
    suggestedNextAction: built.suggestedNextAction,
  };
}
