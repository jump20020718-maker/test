export function formatList(items: string[], prefix = '、'): string {
  return items.filter(Boolean).join(prefix);
}

export function withNeedMoreInfo(fields: string[]): string {
  if (fields.length === 0) return '';
  return `\n为更准确处理，请补充：${fields.join('、')}。`;
}
