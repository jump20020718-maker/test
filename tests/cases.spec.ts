import { describe, it, expect } from 'vitest';
import testCases from '../src/data/test-cases.json';
import { handleChat } from '../src/agent/orchestrator';

type TC = {
  id: string;
  query: string;
  expected_intent: string;
  should_use_tools: boolean;
  expected_tools: string[];
  expected_keywords: string[];
  compliance_requirements: string[];
};

describe('20 core scenarios', () => {
  for (const c of testCases as TC[]) {
    it(`${c.id} ${c.query}`, async () => {
      const r = await handleChat(c.query);
      expect(r.intent).toBe(c.expected_intent);

      if (c.should_use_tools) {
        for (const t of c.expected_tools) {
          expect(r.usedTools).toContain(t);
        }
      }

      for (const kw of c.expected_keywords.slice(0, 2)) {
        expect(r.answer).toContain(kw);
      }

      if (c.expected_intent === 'recommendation') {
        expect(r.answer).toContain('推荐理由');
      }

      if (c.compliance_requirements.includes('no_medical_claim')) {
        expect(r.answer).not.toMatch(/治疗|治愈|根治/);
      }

      if (c.id === 'Q20') {
        expect(r.answer).toContain('认证');
        expect(r.answer).toContain('电压');
        expect(r.answer).not.toMatch(/已获CE|已获FCC|全球第一|绝对安全/);
      }
    });
  }
});
