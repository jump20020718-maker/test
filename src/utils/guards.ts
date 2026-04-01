import { Intent } from '../types';

const bannedPhrases = [/治疗/i, /治愈/i, /药效/i, /保证有效/i, /100%/i, /根治/i];

export function hasUnsafeMedicalClaim(text: string): boolean {
  return bannedPhrases.some((p) => p.test(text));
}

export function sanitizeMedicalClaims(text: string): string {
  let safe = text;
  safe = safe.replace(/治疗|治愈|根治/g, '改善管理');
  safe = safe.replace(/药效/g, '使用体验');
  safe = safe.replace(/保证有效|100%有效/g, '效果因人而异');
  return safe;
}

export function buildSpecialPopulationHint(query: string): string[] {
  const hints: string[] = [];
  if (/孕妇|哺乳/.test(query)) {
    hints.push('孕期/哺乳期属于特殊人群，建议先咨询专业医生后再决定是否使用。');
  }
  if (/儿童|宝宝|5岁/.test(query)) {
    hints.push('儿童使用建议先做局部测试，并优先选择明确标注儿童可用的配方。');
  }
  if (/敏感肌|泛红/.test(query)) {
    hints.push('敏感肌建议先进行耳后/手臂内侧试用，若有不适请立即停用。');
  }
  return hints;
}

export function exportComplianceGuards(answer: string): { answer: string; flags: string[] } {
  const flags: string[] = [];
  let sanitized = answer;
  if (/已获CE|已获FCC|已获UL|已获ROHS|已获REACH/i.test(answer)) {
    flags.push('potential_fake_certification');
    sanitized = sanitized.replace(/已获CE|已获FCC|已获UL|已获ROHS|已获REACH/gi, '请以实际认证资料为准');
  }
  if (/全球第一|绝对安全|零风险/i.test(answer)) {
    flags.push('absolute_advertising_risk');
    sanitized = sanitized.replace(/全球第一|绝对安全|零风险/g, '请使用审慎、可证据支持的表述');
  }
  if (/治疗|治愈/.test(answer)) {
    flags.push('medical_claim_risk');
    sanitized = sanitizeMedicalClaims(sanitized);
  }
  return { answer: sanitized, flags };
}

export function confidenceByIntent(intent: Intent): number {
  const map: Record<Intent, number> = {
    product_qa: 0.86,
    order_query: 0.94,
    customs_query: 0.92,
    logistics_query: 0.93,
    address_change: 0.9,
    aftersales: 0.88,
    recommendation: 0.84,
    export_compliance: 0.85,
    unknown: 0.45,
  };
  return map[intent];
}
