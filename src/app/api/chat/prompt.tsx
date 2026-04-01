import { summary } from "@/lib/const"

// 简历数据

export const resumeData = {
  personal: {
    name: "徐磊君",
    title: "全栈开发工程师",
    yearsExperience: 10,
    email: "765285102@qq.com",
    phone: "+86 15221770395",
    location: "上海",
    summary,
    welcomeWords: `欢迎来我的小站，小站主要展示我的个人项目和技术栈。我喜欢钻研技术，把平时遇到的难点整合到我的小站里，希望大家喜欢。
      欢迎follow我的github，地址在底部链接中。右上角按钮点击可以登录哦~`,
    keyProjects: [
      {
        title: "大文件管理",
        gif: "/assets/file.gif",
        description: `这在企业项目中经常用到，所以我在我的网站里面也开发了此功能模块，后端使用Nodejs+multer,前端使用MD5生成文件指纹，分片上传。
        功能<b class='text-blue-400'>支持大文件分片上传、断点续传、显示下载速度、文件合并校验、文件流式下载、文件删除</b>等。路由地址<a href="/dashboard/files" target="_blank"><b class='text-yellow-400'>/dashboard/files</b></a>。需要登录我的网站进入查看哈。`,
      },
      {
        title: "Webgis",
        gif: "/assets/webgis.gif",
        description: `Webgis项目，基于OpenLayers和Opensky数据源构建的地理信息系统平台。展示全球航班实时动态飞行和飞行轨迹。
         涉及到<b class='text-blue-400'>大量数据的处理、地图渲染、数据请求、数据处理、动画效果等,利用到了webglTile、requestAnimationFrame、远程数据和本地数据的处理来进行性能的优化</b>。
        路由地址<a href="/webgis-public" target="_blank"><b class='text-yellow-400'>/webgis-public</b></a>。此为公开对外展示。`,
      },
    ],
  },
  experiences: [
    {
      company: "Paypal贝宝科技",
      period: "2023/06-至今",
      role: "全栈开发工程师（偏前端）",
      achievements: [
        "1.PPCN内部Sparrow项目（公司各团队前后端项目的管理平台）开发和维护，技术栈<b class='text-yellow-400'>React+less+umijs+axios+antd+redux</b>",
        "2.后期新开项目，普遍使用<b class='text-yellow-400'>Nextjs+Tailwindcss+Shadcn/ui+Next-auth+sso登录</b、Shadcn/ui、tailwindcss、Next-auth、sso登录等技术栈，AI配合开发",
      ],
    },
    {
      company: "国金证券",
      period: "2022/06-2023/06",
      role: "资深前端开发工程师",
      achievements: [
        "1.负责国金证券多个toB项目的前端开发和维护，使用技术栈包括<b class='text-yellow-400'>react、redux、umi.js、qiankun微前端、webpack等</b>。",
        "2.针对项目中经常引入的第三方cdn库，自研webpack插件进行dns预解析，webpack配置文件压缩，多进程打包，分包，fcp时间提升20％。",
        "3.ToB项目中，创建和编辑负责菜单树，设计开发复杂表单，并通用化组件，提升开发效率。",
        "4.to C端应用开发，利用react多页应用，开发佣金宝app嵌入式webview页面，处理安卓、ios平台和多机型的兼容问题。",
      ],
    },
    {
      company: "平安银保科技",
      period: "2018/12-2022/06",
      role: "前端开发工程师",
      achievements: [
        `1.研发 BIMS（银保后台管理）平台，基于 umijs + qiankun.js 搭建前端微服务架构、并开发与之适配的 vue2、react
父、子应用脚手架。基于 qiankun api 实现微应用的父子通讯封装、vuex/redux 数据仓库跨微应用同步；实现全局权限管理、api
管理。在利用现有用户组信息的基础上，实现系统内用户角色配置、角色权限管理、同时支持用户权限临时白名单配置等。`,
        `2.运用 react + ant design 完成 BIMS 平台子应用：使用 umijs + antd pro 库搭建开箱即用式开发场景；通过自定义 hooks 处理复
制数据绑定联动，实现更精细化的代码复用。`,
        `3.运用 vue + element ui / antdv 研发慧经营平台，实现业务核心数据的可视化展示，运用 echarts 图表，通过页面交互实现更多
元化的数据展示。封装大量高可用的自定义复用功能组件。`,
        `4.<b class='text-yellow-400'>主要技术栈：qiankun.js、vue、react、umijs、echarts</b>。`,
      ],
    },
    {
      company: "埃森哲(中国)有限公司",
      period: "2014/01-2018/12",
      role: "Node开发工程师",
      achievements: [
        `1.熟练使用相关开发框架或第三方类库，比如<b class='text-yellow-400'>jquery+bootstrap+NODEjs+express+Jade+less+mongodb+grunt</b>。`,
        `2.技术栈：jquery+bootstrap+NODEjs+express+Jade+less+mongodb+grunt。`,
      ],
    },
  ],
  education: [
    {
      school: "南京信息工程大学",
      degree: "本科",
      major: "信息系统工程",
      period: "2009-2013",
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
      name: "ISMP中台&客户视图",
      description: `
       为国金证券业务员打造的一体化集成了后台管理系统，聚集整合各现有的功能模块，并支持添加新建功能模块。主要为
员工展业服务，比如客户查询，标签管理，客户流转，绩效管理，工作台等模块。
但因为业务系统以及子功能模块均为老的jsp系统，内部功能模块为iframe嵌入。
客户视图为以国金客户资金账号为唯一身份标识的客户所有相关信息的集成的系统，配合ismp平台子系统外链。刚开始也是老的
jsp系统，现均被我改造成前后端分离项目。
      `,
      technologies: [
        "umi.js",
        "react",
        "antd",
        "recoil",
        "less",
        "webpack",
        "qiankun微前端",
      ],
    },
    {
      name: "Sparrow项目管理平台",
      description: `
      Paypal内部项目管理平台，主要功能包括项目立项、项目审批、项目成员管理、项目文档管理、项目发版pipeline等。平台采用前后端分离架构，前端使用umi.js框架，平台还集成了权限管理模块，实现了基于角色的访问控制。
      `,
      technologies: ["umi.js", "react", "antd", "redux", "less", "webpack"],
    },
    {
      name: "其他最新中台项目",
      description: `
      Paypal内部项目管理平台，服务于其他团队，如风险合规团队，平台还集成了权限管理模块，实现了基于角色的访问控制。
      `,
      technologies: [
        "next.js",
        "tailwindcss",
        "shadcn/ui",
        "next-auth",
        "jotai",
        "sso登录",
      ],
    },
  ],
}

// 构建系统提示
export const systemPrompt = `你是一个个人简历助手，你需要基于以下结构化数据回答问题：${JSON.stringify(resumeData, null, 2)}。请以第一人称"我"的口吻回答。`
