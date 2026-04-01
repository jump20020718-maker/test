import rules from '../data/aftersales-rules.json';

export function queryAfterSalesRules(ruleType: string): { title: string; content: string } | null {
  const item = (rules as Record<string, { title: string; content: string }>)[ruleType];
  return item ?? null;
}
