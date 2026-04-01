import { Intent } from '../types';

export function buildAnswer(intent: Intent, message: string, context: Record<string, unknown>): { answer: string; suggestedNextAction: string[] } {
  const next: string[] = [];

  switch (intent) {
    case 'product_qa': {
      const kb = (context.kb as string[]) ?? [];
      const productNames = ((context.products as Array<{ name: string }>) ?? []).map((p) => p.name).slice(0, 3);
      let answer = kb[0] ?? '这个问题我先按商品页面信息和平台规则帮您核对。';
      if (/成分/.test(message)) {
        answer += ' 同款不同批次可能存在标签规范差异，建议以实物成分表和批次信息为准。';
      }
      if (/假货/.test(message)) {
        answer += ' 版本差异不等于假货，建议通过批次码、购买凭证与品牌官方渠道核验。';
      }
      if (productNames.length) answer += ` 可参考商品：${productNames.join('、')}。`;
      if (/孕妇|儿童|敏感肌/.test(message)) {
        answer += ' 特殊人群请先咨询专业医生或先做小范围测试。';
      }
      next.push('如需更精确版本对比，请提供商品链接或批次号。');
      return { answer, suggestedNextAction: next };
    }
    case 'customs_query': {
      const customs = context.customs as { status: string; reason?: string; requiredDocs?: string[] } | undefined;
      const order = context.order as { channel?: string } | undefined;
      if (!customs) {
        return { answer: '我可以帮您查清关状态，请提供订单号（如 ORD1001）。', suggestedNextAction: ['请补充订单号'] };
      }
      const docs = customs.requiredDocs?.length ? `需补充：${customs.requiredDocs.join('、')}。` : '';
      const answer = `当前清关状态：${customs.status}。${customs.reason ?? ''} ${docs} 具体进度请以海关通知为准。 ${order?.channel === 'bonded' ? '保税仓订单清关通常在资料齐全后推进。' : ''}`;
      next.push('建议尽快在平台上传资料并关注站内消息。');
      return { answer, suggestedNextAction: next };
    }
    case 'logistics_query': {
      const logi = context.logistics as { carrier: string; etaDays: string; canDeliverRural: boolean } | undefined;
      const customs = context.customs as { taxHint?: string } | undefined;
      if (!logi) return { answer: '可帮您查物流，请提供订单号。', suggestedNextAction: ['请补充订单号'] };
      const answer = `当前快递承运商：${logi.carrier}，预计时效：${logi.etaDays}天。${logi.canDeliverRural ? '可覆盖大部分乡镇，具体以末端网点为准。' : '部分乡镇可能需要自提或二次转运。'} ${customs?.taxHint ?? ''}`;
      next.push('如需我继续跟进，请发我订单号和收件地区。');
      return { answer, suggestedNextAction: next };
    }
    case 'address_change': {
      const order = context.order as { canChangeAddress: boolean; status: string } | undefined;
      if (!order) return { answer: '请提供订单号，我帮您判断是否还能改地址。', suggestedNextAction: ['请补充订单号'] };
      const answer = order.canChangeAddress
        ? `当前订单状态为${order.status}，可以尝试修改收货地址，我可为您提交改址申请。`
        : `当前订单状态为${order.status}，已进入跨境流程，通常不支持直接改址，可尝试拦截后重下单。`;
      next.push('如需处理，我可以继续指导您在订单页提交申请。');
      return { answer, suggestedNextAction: next };
    }
    case 'aftersales': {
      const rule = context.rule as { title: string; content: string } | undefined;
      const answer = rule
        ? `${rule.title}：${rule.content}`
        : '售后问题我可以协助处理，请描述商品问题并提供订单号。';
      next.push('请提供订单号、签收时间及相关图片/视频凭证。');
      return { answer, suggestedNextAction: next };
    }
    case 'recommendation': {
      const products = (context.products as Array<{ name: string; price: number; features: string[] }> | undefined) ?? [];
      if (!products.length) {
        return { answer: '可以给您推荐，先告诉我预算、肤质/发质和使用人群。', suggestedNextAction: ['补充预算与人群信息'] };
      }
      const top = products.slice(0, 2).map((p) => `${p.name}（¥${p.price}）`);
      const reasons = products[0].features.slice(0, 2).join('、');
      const budgetHint = /500/.test(message) ? '预算500以内可优先考虑以上方案。' : '';
      return {
        answer: `给您推荐：${top.join('；')}。推荐理由：更贴合您提到的需求（${reasons}）。${budgetHint} 温馨提示：不做医疗诊断，首次使用建议先做小范围测试。`,
        suggestedNextAction: ['如需我按预算分档，可告诉我可接受价格区间。'],
      };
    }
    case 'export_compliance': {
      const kb = (context.kb as string[]) ?? [];
      const answer = `${kb[0] ?? '可从性能、品控、用户体验和交付能力介绍产品卖点。'} 合规建议：不要虚构认证，不使用绝对化宣传，不宣称医疗功效，并确认目标市场认证与电压适配。`;
      next.push('请提供目标国家和型号，我可输出更细的对外话术模板。');
      return { answer, suggestedNextAction: next };
    }
    case 'order_query': {
      const order = context.order as { status: string; channel: string } | undefined;
      if (!order) return { answer: '请提供订单号，我帮您查询订单状态。', suggestedNextAction: ['请补充订单号'] };
      return {
        answer: `订单状态：${order.status}，履约类型：${order.channel === 'bonded' ? '保税仓' : '直邮'}。`,
        suggestedNextAction: ['若需催单，可回复“加急处理”。'],
      };
    }
    default:
      return {
        answer: '我先为您转到人工规则流程。请补充订单号或商品名，我会继续帮您处理。',
        suggestedNextAction: ['补充订单号/商品名'],
      };
  }
}
