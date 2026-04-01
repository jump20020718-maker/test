import { Intent } from '../types';

export function detectIntent(message: string): Intent {
  const m = message.toLowerCase();
  if (/外贸|欧美|出口|合规/.test(message)) return 'export_compliance';
  if (/推荐|有没有.*推荐|预算|敏感肌|宝宝|儿童|油性头皮/.test(message)) return 'recommendation';
  if (/改收货地址|改地址/.test(message)) return 'address_change';
  if (/清关|海关|扣关|查验/.test(message)) return 'customs_query';
  if (/物流|快递|多久|送到|乡镇|直邮/.test(message)) return 'logistics_query';
  if (/订单|下单|ord\d+/i.test(m)) return 'order_query';
  if (/退换|退款|售后|质保|坏了|破了|临期|过期/.test(message)) return 'aftersales';
  if (/成分|区别|版本|孕妇|可以用吗|是假货吗|护肝片|防晒/.test(message)) return 'product_qa';
  return 'unknown';
}
