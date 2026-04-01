# 跨境个护健康品类 AI 客服 Agent MVP

一个可本地运行的 TypeScript + Node.js 后端 MVP，面向跨境电商客服场景。

## 功能概览

- 商品知识问答（版本差异/成分/特殊人群提示）
- 订单、清关、物流查询（本地 mock）
- 售后规则判断（临期/破损/美容仪质保等）
- 导购推荐（肤质/预算/人群）
- 外贸合规问答（不虚构认证，不做绝对化承诺）
- 统一响应结构：
  - `intent`
  - `answer`
  - `usedTools`
  - `confidence`
  - `complianceFlags`
  - `suggestedNextAction`

## 安装

```bash
npm install
```

## 启动

开发模式：

```bash
npm run dev
```

生产构建并启动：

```bash
npm run build
npm start
```

默认端口：`3000`

## 测试

```bash
npm test
```

## API

### 1) POST `/api/chat`

请求：

```json
{
  "message": "我在你们保税仓买的面霜，下单3天了，怎么还没清关？订单号ORD1001"
}
```

返回示例：

```json
{
  "intent": "customs_query",
  "answer": "当前清关状态：pending_clearance。身份证信息待核验 需补充：收件人身份证信息。 保税仓订单清关通常在资料齐全后推进。",
  "usedTools": ["queryCustoms", "queryOrder"],
  "confidence": 0.92,
  "complianceFlags": [],
  "suggestedNextAction": ["建议尽快在平台上传资料并关注站内消息。"]
}
```

### 2) GET `/api/orders/:id`

```bash
curl http://localhost:3000/api/orders/ORD1001
```

### 3) GET `/api/customs/:id`

```bash
curl http://localhost:3000/api/customs/ORD1001
```

### 4) GET `/api/logistics/:id`

```bash
curl http://localhost:3000/api/logistics/ORD1001
```

## 项目结构

见 `src/` 与 `tests/` 目录：
- `src/agent`：意图识别、编排、合规、答复生成
- `src/tools`：mock 工具
- `src/data`：mock JSON 数据（含 20 条测试样例）
- `tests`：API + Agent + 核心样例自动化测试

## 说明

- 当前为 MVP，不接真实电商、支付、物流、海关系统。
- `services/llm.ts` 已做可替换抽象，后续可接入真实模型。
