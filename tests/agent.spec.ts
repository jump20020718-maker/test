import { describe, it, expect } from 'vitest';
import { detectIntent } from '../src/agent/router';
import { handleChat } from '../src/agent/orchestrator';

describe('intent router', () => {
  it('detects recommendation', () => {
    expect(detectIntent('敏感肌有什么推荐')).toBe('recommendation');
  });

  it('detects customs', () => {
    expect(detectIntent('订单清关卡住了')).toBe('customs_query');
  });
});

describe('orchestrator core', () => {
  it('returns standard response structure', async () => {
    const res = await handleChat('订单号ORD1001，清关怎么样了？');
    expect(res).toHaveProperty('intent');
    expect(res).toHaveProperty('answer');
    expect(res).toHaveProperty('usedTools');
    expect(res).toHaveProperty('confidence');
    expect(res).toHaveProperty('complianceFlags');
    expect(res).toHaveProperty('suggestedNextAction');
  });

  it('enforces no medical claim for supplement', async () => {
    const res = await handleChat('Swisse的护肝片能治疗脂肪肝吗？');
    expect(res.answer).not.toMatch(/治疗脂肪肝|治愈|根治/);
    expect(res.answer).toMatch(/不能替代药物|不用于治疗|膳食补充剂/);
  });
});
