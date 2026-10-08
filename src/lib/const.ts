export const base_path = ""

export const summary = `
1.拥有 10 年前端开发经验，近一年独立开发完成一个全栈 AI 学习平台。学习网站http://120.26.245.143/。
2.项目采用 pnpm Monorepo 架构，前端基于 Vue3 全家桶，后端使用 NestJS 拆分为业务与 AI 两个微服务。AI 服务基于 LangChain.js 与 LangGraph.js 接入 DeepSeek，通过 createAgent 构建具备工具调用能力的 ReAct Agent，结合 PostgresSaver 实现多轮会话持久化，支持 SSE 流式输出。针对长耗时任务，使用 BullMQ 拆分为定时与延迟队列，按用户自定义时间异步投递。
3.自研埋点 SDK，覆盖事件 / 性能（Web Vitals）/ 错误 / 路由 / PV-UV 五类统计，数据统一上报 PostgreSQL 落库。项目从架构设计到部署均由本人独立完成，具备扎实的前端开发能力与 AI 工程化落地经验。
`
export const summaryEn = `
1. With 10 years of frontend development experience, I independently developed a full-stack AI learning platform for the past year. Learning website: http://120.26.245.143/.
2. The project uses pnpm Monorepo architecture, with the frontend based on Vue3 family and the backend split into business and AI two microservices. The AI service is based on LangChain.js and LangGraph.js, integrated with DeepSeek, using createAgent to build ReAct Agents with tool call capabilities, combined with PostgresSaver for multi-turn conversation persistence, supporting SSE streaming output. For long-running tasks, BullMQ is used to split into scheduled and delayed queues, asynchronously delivering at user-defined times.
3. Self-researched Event Tracking SDK, covering event / performance (Web Vitals) / error / routing / PV-UV five categories of statistics, data uniformly reported to PostgreSQL database. The project was independently completed from architectural design to deployment, possessing solid frontend development skills and AI engineering implementation experience.
`
