import { summaryEn as summary } from "@/lib/const"

// Resume data

export const resumeData = {
  personal: {
    name: "Xu Leijun",
    title: "Full-Stack Developer",
    yearsExperience: 10,
    email: "765285102@qq.com",
    phone: "+86 15221770395",
    location: "Shanghai",
    summary,
    welcomeWords: `Welcome to my personal site, which mainly showcases my personal projects and tech stack. I enjoy diving deep into technology and integrating the challenges I encounter into this site. Hope you like it!
      Feel free to follow my GitHub — the link is in the footer. You can also log in by clicking the button in the top right corner~`,
    keyProjects: [
      {
        href: "http://120.26.245.143/",
        title: "English App",
        gif: "/assets/file-md5.gif",
        description: `A full-stack AI English learning platform built on the **pnpm Monorepo + Microservices** architecture. The frontend uses **Vue3** (Pinia/Element Plus/Vite/Tailwind/Three.js),
          while the backend is structured into business and AI microservices using **NestJS**, with the data layer utilizing **Prisma 7 + PostgreSQL**. It integrates Redis (BullMQ message queue), MinIO file storage, Alipay payments, and Socket.io for real-time communication.`,
      },
      {
        href: "/dashboard/files",
        title: "Large File Management",
        gif: "/assets/file-md5.gif",
        description: `This is a commonly used feature in enterprise projects, so I implemented it on my site as well. The backend uses Express + Multer, while the frontend generates file fingerprints with MD5 and enables Service Worker for files over 10MB, supporting chunked uploads.
        Features include <b class='text-blue-400'>large file chunked upload, resumable upload, download speed display, file merge verification, streaming download, and file deletion</b>. Route: <a href="/dashboard/files" target="_blank"><b class='text-yellow-400'>/dashboard/files</b></a>. Login required to access.`,
      },
      {
        href: "/webgis-public",
        title: "WebGIS",
        gif: "/assets/webgis.gif",
        description: `A WebGIS project built on OpenLayers, Tianditu, and OpenSky data sources, displaying real-time global flight tracking and flight trajectories.
         It involves <b class='text-blue-400'>large-scale data processing, map rendering, data fetching, data transformation, and animation effects. Performance is optimized using WebGL tiles, requestAnimationFrame, and hybrid remote/local data handling</b>.
        Route: <a href="/webgis-public" target="_blank"><b class='text-yellow-400'>/webgis-public</b></a>. Publicly accessible.`,
      },
    ],
  },
  experiences: [
    {
      company: "自研项目",
      period: "自研",
      role: "全栈开发工程师",
      achievements: [
        `1.采用 <b class='text-yellow-400'>pnpm Monorepo + 微服务 + workspace 架构</b>，多包统一管理依赖与版本（pnpm-workspace.yaml + packageManager 锁定 pnpm 版本）。
        前端（@en/web）、业务微服务（@en/server :3000）、AI 微服务（@en/ai :3001）、共享类型包（@en/common/ @en/config/ @en/libs-shared）、埋点 SDK（@en/tracker）独立成包，实现类型共享、
        构建隔离、按需部署`,
        `2.前端基于<b class='text-yellow-400'> Vue3 全家桶（Vue3 + Vue Router + Pinia + Element Plus + Axios + Vite + Tailwind CSS）</b>构建单页应用,基于<b class='text-yellow-400'> Three.js + GSAP 实现 3D 场景与动效（词汇 / 课程可视化展示，GSAP 驱动交互动画）</b>`,
        `3.后端基于 <b class='text-yellow-400'>NestJS（依赖注入 + 模块化 + 守卫 / 拦截器 / 管道体系），数据访问使用 Prisma ORM，文件存储集成 MinIO（对象存储，课程封面 / 头像），邮件发送集成 nodemailer（每日记忆报告邮件），异步任务使用 BullMQ（Redis 队列），支付集成支付宝 SDK（电脑网站支付 + 异步回调验签）</b>`,
        `4.数据层两库分离：PostgreSQL 承载业务数据（Prisma 管理表结构，含 langchain 会话状态库,自研埋点 SDK，覆盖事件 / 性能（Web Vitals）/ 错误 / 路由 / PV-UV 五类统计，数据统一上报 PostgreSQL 落库）、Redis 承担缓存与 BullMQ 消息队列`,
        `5.AI 服务基于 LangChain.js + LangGraph.js 接入 DeepSeek 大模型：通过 LangChain v1 createAgent（底层基于 LangGraph StateGraph）构建 ReAct Agent，实现多角色 Prompt 对话体系（5 类角色：老师 / 口语陪练等，prompt 可配置）利用 LangGraph 官方 checkpoint（PostgresSaver） 持久化多轮会话状态，按 thread_id 隔离用户，实现连续记忆对话SSE 流式输出（agent.stream(..., streamMode: "messages")）自定义 Tool：Agent 按需自主查询用户学习数据（digest 报告生成场景）联网搜索增强：集成博查（Bocha）搜索 API，webSearch 开启时把实时搜索结果注入 Prompt 再回答，附参考来源深度思考模型：接入 DeepSeek Reasoner 推理模型，处理复杂答疑。`,
      ],
    },
    {
      company: "PayPal (China)",
      period: "2023/06 – Present",
      role: "Full-Stack Developer (Frontend-focused)",
      achievements: [
        "1. Development and maintenance of the internal Sparrow project (a management platform for front-end and back-end projects across teams), tech stack: <b class='text-yellow-400'>React + Less + UmiJS + Axios + Ant Design + Redux</b>.",
        `2. Later joined new projects built from scratch, widely adopting <b class='text-yellow-400'>Next.js, Shadcn/ui, Tailwind CSS, NextAuth, SSO login</b> and AI-assisted development.
        Examples include a Document AI management platform for merchant invoice OCR recognition, leveraging third-party LLMs to help the Risk team process invoice data more efficiently, organize information, and mitigate risks.`,
      ],
    },
    {
      company: "Sinolink Securities",
      period: "2022/06 – 2023/06",
      role: "Senior Frontend Developer",
      achievements: [
        "1. Responsible for frontend development and maintenance of multiple ToB projects at Sinolink Securities, using <b class='text-yellow-400'>React, Redux, UmiJS, Qiankun micro-frontends, Webpack</b>, etc.",
        "2. Developed a custom Webpack plugin for DNS prefetching of frequently imported third-party CDN libraries; optimized builds with file compression, multi-process bundling, and code splitting — improving FCP by 20%.",
        "3. In ToB projects, built and edited menu trees, designed and developed complex forms with reusable components, improving development efficiency.",
        "4. For the ToC side, developed embedded WebView pages for the Yongjinbao app using React multi-page application, handling compatibility across Android, iOS, and multiple device models.",
      ],
    },
    {
      company: "Ping An BankInsurance Technology",
      period: "2017/01 – 2022/06",
      role: "Frontend Developer",
      achievements: [
        `1. Developed the BIMS (BankInsurance Backend Management) platform, building a micro-frontend architecture based on UmiJS + Qiankun.js, and creating compatible Vue 2 and React parent/child app scaffolds. Implemented parent-child communication encapsulation, cross-app Vuex/Redux state sync, global permission management, and API management based on Qiankun APIs. Built user role configuration, role permission management, and temporary whitelist permission support on top of existing user group data.`,
        `2. Built BIMS sub-applications using React + Ant Design: leveraged UmiJS + Ant Design Pro for rapid development; used custom hooks to handle complex data binding and achieve fine-grained code reuse.`,
        `3. Developed the Smart Operations platform using Vue + Element UI / Ant Design Vue, enabling visual display of core business data with ECharts charts and rich interactive data presentation. Encapsulated a large number of highly reusable custom components.`,
        `4.<b class='text-yellow-400'>Main tech stack: Qiankun.js, Vue, React, UmiJS, ECharts</b>.`,
      ],
    },
    {
      company: "Accenture (China) Co., Ltd.",
      period: "2014/01 – 2016/12",
      role: "Node.js Developer",
      achievements: [
        `1. Proficient in relevant frameworks and third-party libraries, including <b class='text-yellow-400'>jQuery + Bootstrap + Node.js + Express + Jade + Less + MongoDB + Grunt</b>.`,
        `2. Tech stack: jQuery + Bootstrap + Node.js + Express + Jade + Less + MongoDB + Grunt.`,
      ],
    },
  ],
  education: [
    {
      school: "Nanjing University of Information Science & Technology",
      degree: "Bachelor's Degree",
      major: "Information Systems Engineering",
      period: "2009/09 - 2013/07",
      certificates: [
        "English CET-6",
        "Japanese JLPT-2",
        "Securities Qualification Certificate",
        "Intermediate Economist - Business Administration",
      ],
    },
  ],
  skills: {
    frontend: ["React", "Vue", "TypeScript", "Next.js"],
    backend: ["Node.js"],
    database: ["MySQL", "MongoDB", "Redis"],
    devops: ["Git", "Docker", "Jenkins"],
  },
  projects: [
    {
      name: "ISMP Mid-Platform & Customer View",
      description: `
       An integrated backend management system built for Sinolink Securities sales staff, consolidating existing functional modules and supporting the addition of new ones. Main modules include customer search, tag management, customer transfer, performance management, workbench, and more.
Since both the business system and sub-modules were legacy JSP systems, internal modules are embedded via iframes.
The Customer View is a system aggregating all information related to customers identified by their Sinolink fund account number, integrated as an external link within the ISMP sub-system. Initially a legacy JSP system, it has since been refactored into a fully separated frontend/backend architecture.
      `,
      technologies: [
        "umi.js",
        "react",
        "antd",
        "recoil",
        "less",
        "webpack",
        "Qiankun micro-frontend",
      ],
    },
    {
      name: "Sparrow Project Management Platform",
      description: `
      An internal project management platform at PayPal, with core features including project initiation, approval workflows, member management, document management, and release pipelines. The platform adopts a frontend/backend separation architecture with a UmiJS-based frontend, and integrates a permission management module implementing role-based access control.
      `,
      technologies: ["umi.js", "react", "antd", "redux", "less", "webpack"],
    },
    {
      name: "Other Latest Mid-Platform Projects",
      description: `
      Internal platforms at PayPal serving other teams such as the Risk & Compliance team, integrating permission management modules with role-based access control.
      `,
      technologies: [
        "next.js",
        "tailwindcss",
        "shadcn/ui",
        "next-auth",
        "jotai",
        "SSO login",
      ],
    },
  ],
}

// Build system prompt
export const systemPrompt = `You are a personal resume assistant. Answer questions based on the following structured data: ${JSON.stringify(resumeData, null, 2)}. Please respond in the first person using "I".`
