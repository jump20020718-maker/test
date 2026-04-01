import { exportComplianceGuards, hasUnsafeMedicalClaim, sanitizeMedicalClaims } from '../utils/guards';
import { Intent } from '../types';

export function applyCompliance(intent: Intent, rawAnswer: string): { answer: string; flags: string[] } {
  const flags: string[] = [];
  let answer = rawAnswer;

  if (hasUnsafeMedicalClaim(answer)) {
    answer = sanitizeMedicalClaims(answer);
    flags.push('medical_claim_sanitized');
  }

  if (intent === 'export_compliance') {
    const guarded = exportComplianceGuards(answer);
    answer = guarded.answer;
    flags.push(...guarded.flags);
    if (!answer.includes('电压')) {
      answer += ' 同时请确认目标市场电压规格、插头标准及标签语言要求。';
      flags.push('market_voltage_reminder_added');
    }
  }

  return { answer, flags };
}
