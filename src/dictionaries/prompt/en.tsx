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
        gif: "/assets/englishApp.png",
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
      company: "Self-research Project",
      period: "Self",
      role: "Full-Stack Developer",
      achievements: [
        `1. Adopt the <b class='text-yellow-400'>pnpm Monorepo + Microservice + Workspace architecture</b> for unified dependency and version management across multiple packages (pnpm-workspace.yaml + packageManager to lock the pnpm version).
Separate packages for frontend (@en/web), business microservice (@en/server :3000), AI microservice (@en/ai :3001), shared type packages (@en/common/ @en/config/ @en/libs-shared), and tracking SDK (@en/tracker) to achieve type sharing,
isolated builds, and on-demand deployment.`,
        `2. The frontend builds a single-page application based on the <b class='text-yellow-400'>Vue3 stack (Vue3 + Vue Router + Pinia + Element Plus + Axios + Vite + Tailwind CSS)</b>. <b class='text-yellow-400'>Three.js + GSAP</b> are used to implement 3D scenes and animations (visual presentation of vocabulary / courses, with GSAP powering interactive animations).`,
        `3. The backend is built on <b class='text-yellow-400'>NestJS (dependency injection + modularization + guard / interceptor / pipe system)</b>. Prisma ORM is used for data access; MinIO is integrated for file storage (object storage for course covers / avatars); nodemailer for email delivery (daily memory report emails); BullMQ for asynchronous tasks (Redis queue); Alipay SDK for payment integration (PC website payment + asynchronous callback signature verification).`,
        `4. Dual-database separation at the data layer: PostgreSQL hosts business data (Prisma manages table structures, including LangChain session state library. Self-developed tracking SDK covering five categories of statistics: events / performance (Web Vitals) / errors / routes / PV-UV. Data is reported uniformly and persisted into PostgreSQL). Redis handles caching and BullMQ message queues.`,
        `5. The AI service integrates the DeepSeek large model based on LangChain.js + LangGraph.js: Build ReAct Agent via LangChain v1 createAgent (underlying based on LangGraph StateGraph), implement a multi-role prompt dialogue system (5 role types: teacher / oral practice partner, etc., with configurable prompts). Use the official LangGraph checkpoint (PostgresSaver) to persist multi-turn conversation states, isolate users by thread_id to support continuous memory dialogue. SSE streaming output (agent.stream(..., streamMode: "messages")). Custom Tools: Agent can autonomously query user learning data on demand (for digest report generation scenarios). Web search augmentation: integrate Bocha Search API. When webSearch is enabled, real-time search results are injected into prompts before responses, with reference sources attached. Deep reasoning model: connect to DeepSeek Reasoner inference model to handle complex Q&A.`,
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
