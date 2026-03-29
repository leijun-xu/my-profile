"use client"

import { Github, Mail, PhoneCall, MapPin, FileUser } from "lucide-react"
import Skills from "@/components/resume/skill"
import { Typewriter } from "@/components/resume/typeWriter"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { summary } from "@/lib/const"

export default function ResumeContent() {
  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <hr className="mx-44 border-gray-400" />
      <section className="mt-10 px-5 text-gray-300 md:px-20">
        <h4 className="mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-left">
          Summary
        </h4>
        <div className="w-full wrap-break-word md:h-[50px]">
          <Typewriter text={summary} />
        </div>
      </section>

      <Skills />

      <hr className="mx-44 border-gray-400" />
      <section className="mt-10 px-5 text-gray-300 md:px-20">
        <h4 className="mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-left">
          Experience
        </h4>
        <div className="my-10 grid grid-cols-1 md:grid-cols-6">
          <div className="col-span-2 mb-4 flex flex-col md:mb-0">
            <h5 className="text-xl font-bold md:text-2xl">
              Full Stack Developer
            </h5>
            <h6 className="text-lg font-bold">Paypal贝宝科技</h6>
            <p>2023/06 - 至今</p>
          </div>
          <div className="col-span-4 flex flex-col">
            <ul>
              <li className="mb-1 wrap-break-word">
                <b>
                  技术栈：react+antd中后台开发，Nextjs+tailwindcss+Shadcn/ui+next-auth中后台开发
                </b>
              </li>
              <li>
                1.开发Sparrow（项目管理发布）平台，基于umijs+redux+react+antd搭建和维护；
              </li>
              <li>
                2.后期中台项目都采用Nextjs+tailwindcss+Shadcn/ui+next-auth进行开发；
              </li>
            </ul>
          </div>
        </div>
        <div className="my-10 grid grid-cols-1 md:grid-cols-6">
          <div className="col-span-2 mb-4 flex flex-col md:mb-0">
            <h5 className="text-xl font-bold md:text-2xl">
              Frontend Developer
            </h5>
            <h6 className="text-lg font-bold">平安银保科技</h6>
            <p>2018/12 - 2022/06</p>
          </div>
          <div className="col-span-4 flex flex-col">
            <ul>
              <li className="mb-1 wrap-break-word">
                <b>
                  技术栈：vue2+vant移动端app开发，react+antd中后台开发，taro小程序，qiankun微前端
                </b>
              </li>
              <li>
                1.研发 BIMS（银保后台管理）平台，基于 umijs + qiankun.js
                搭建前端微服务架构，整合银保科技多个子平台；
              </li>
              <li>2.TARO小程序框架，开发银保小程序，提升客户经理签单效率；</li>
              <li>
                3. vue + vant 开发移动端 app 嵌入式 webview
                页面，并处理跨平台兼容性。{" "}
              </li>
            </ul>
          </div>
        </div>
        <div className="my-10 grid grid-cols-1 md:grid-cols-6">
          <div className="col-span-2 mb-4 flex flex-col md:mb-0">
            <h5 className="text-xl font-bold md:text-2xl">Nodejs Developer</h5>
            <h6 className="text-lg font-bold">埃森哲(中国)有限公司</h6>
            <p>2014/01 - 2018/12</p>
          </div>
          <div className="col-span-4 flex flex-col">
            <ul>
              <li className="mb-1 wrap-break-word">
                <b>
                  技术栈：jquery+bootstrap+NODEjs+express+Jade+less+mongodb+grunt
                </b>
              </li>
              <li>1.作为核心成员完整参与过多个项目或多个Release的开发工作；</li>
              <li>2.能够总结项目工作的特点，提出一些针对性的改进措施； </li>
              <li>
                3.具有一定的风险识别能力，在测试发现之前，感知预发生的bug；{" "}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <hr className="mx-44 border-gray-400" />
      <section className="mt-10 px-5 font-semibold md:px-20">
        <h4 className="mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-left">
          Education
        </h4>
        <div className="my-10 grid grid-cols-1 text-gray-300 md:grid-cols-6">
          <div className="col-span-2 mb-4 flex flex-col md:mb-0">
            <h5 className="text-xl font-bold md:text-2xl">南京信息工程大学</h5>
            <h6 className="text-lg font-bold">信息系统工程（本科）</h6>
            <p>2009/09 - 2013/07</p>
          </div>
          <div className="col-span-4 flex flex-col">
            <ul>
              <li>英语CET-4</li>
              <li>日语JLPT-2</li>
              <li>证券从业资格证</li>
              <li>中级经济师-工商管理</li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="mx-44 border-gray-400" />
      <section className="mt-10 px-5 text-gray-300 md:px-20">
        <h4 className="mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-left">
          Contact me
        </h4>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* 左侧：联系方式列表 */}
          <div className="flex items-center gap-3 text-gray-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 group-hover:bg-purple-500/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">765285102@qq.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 group-hover:bg-purple-500/20">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">+86 15221770395</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 group-hover:bg-purple-500/20">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">上海 · 浦东</p>
            </div>
          </div>
        </div>
      </section>
      {/* 社交链接 */}
      <div className="mt-12 flex justify-center gap-6 pb-5">
        {[
          {
            icon: Github,
            href: "https://github.com/leijun-xu/my-profile",
            label: "GitHub",
            tooltip: "Go to github to review code.",
          },
          {
            icon: Mail,
            href: "mailto:765285102@qq.com",
            label: "Email",
            tooltip: "This is my email,you can contact me.",
          },
          {
            icon: FileUser,
            href: "./xuleijun-Frontend-resume.pdf",
            label: "Resume",
            download: true,
            tooltip: "This is my PDF resume,you can download it.",
          },
        ].map((social, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  download={social.download}
                  aria-label={social.label}
                >
                  <div className="absolute -inset-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600 opacity-0 blur transition duration-300 group-hover:opacity-50"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-gray-800 bg-gray-900/90 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-500">
                    <social.icon className="h-5 w-5 text-gray-400 transition-colors duration-300 group-hover:text-white" />
                  </div>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{social.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  )
}
