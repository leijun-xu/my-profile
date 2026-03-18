'use client';

import { Button } from "@/components/ui/button"
import { Github, Loader, Mail, LogOut, PhoneCall, MapPin, FileUser } from 'lucide-react';
import Skills from "@/components/resume/skill";
import { base_path } from "@/lib/const";
import { signOut, useSession } from "next-auth/react";
import AIChat from "@/components/ai/ai-chat";
import { Typewriter } from "@/components/resume/typeWriter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import DevIcons from "@/components/devtool/devtoolIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const summary = '热爱 coding 的前端开发者，10年+时间从零到一参与了多个产品的完整生命周期。不仅熟悉React/Next.js技术栈，更懂得如何用技术驱动业务增长。善于将复杂业务需求转化为优雅的代码实现，是产品经理最喜欢的开发伙伴。'

export default function Page() {
  const { data: session, status } = useSession()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <header>
        <nav className="w-full">
          <div className="flex justify-between w-full px-16 py-8">
            <div className=" flex items-center gap-2">
              <Avatar size="lg">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/243532682?v=4&size=64"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-gray-300 text-md">徐磊君</span>
            </div>

            <ul className="flex items-center gap-1 ">
              {/* <li>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a href="https://github.com/leijun-xu/my-profile" target="_blank" aria-label="Github"
                          className="hover:text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                          </svg>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>go to Github,view the code.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li> */}
              {/* <li>
                  <Link href={'/ai'} className="hover:text-blue-600 group">
                    <Bot className="w-9 h-9 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-x-0.5 group-hover:translate-x-0" />
                  </Link>
                </li> */}
              <li>
                <div className="flex items-center gap-1 cursor-pointer">
                  <div className="rounded-lg bg-blue-500 text-white border-2 border-white w-8 h-8 flex justify-center items-center">{session?.user?.firstName?.substr(0, 1)}</div>
                  <div className="text-gray-300 ">{status === 'loading' ? <Loader className="w-6 h-6" /> : session?.user?.name}</div>
                </div>
              </li>
              <li>
                <Button onClick={e => signOut({ callbackUrl: base_path + '/auth/signin' })}><LogOut className=" w-7 h-7" /></Button>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <AIChat />

      <hr className="border-gray-400 mx-44" />
      <section className="px-5 md:px-20 mt-10 text-gray-300">
        <h4 className="mb-8 text-3xl font-bold text-center md:text-left bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Summary</h4>
        <div className=" wrap-break-word md:h-[50px] w-full">
          <Typewriter text={summary} />
        </div>
      </section>


      <Skills />

      <hr className="border-gray-400 mx-44" />
      <section className="px-5 md:px-20 mt-10 text-gray-300">
        <h4 className="mb-8 text-3xl font-bold text-center md:text-left bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Experience</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 my-10">
          <div className="flex flex-col col-span-2 mb-4 md:mb-0">
            <h5 className="text-xl md:text-2xl font-bold">Full Stack Developer</h5>
            <h6 className="text-lg font-bold">Paypal贝宝科技</h6>
            <p>2023/06 - 至今</p>
          </div>
          <div className="flex flex-col col-span-4">
            <ul>
              <li className="mb-1 wrap-break-word"><b>
                技术栈：react+antd中后台开发，Nextjs+tailwindcss+Shadcn/ui+next-auth中后台开发
              </b></li>
              <li>
                1.开发Sparrow（项目管理发布）平台，基于umijs+redux+react+antd搭建开发和维护；
              </li>
              <li>2.后期中台项目都采用Nextjs+tailwindcss+Shadcn/ui+next-auth进行开发；</li>

            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 my-10">
          <div className="flex flex-col col-span-2 mb-4 md:mb-0">
            <h5 className="text-xl md:text-2xl  font-bold">Frontend Developer</h5>
            <h6 className="text-lg font-bold">平安银保科技</h6>
            <p>2018/12 - 2022/06</p>
          </div>
          <div className="flex flex-col col-span-4">
            <ul>
              <li className="mb-1 wrap-break-word"><b>
                技术栈：vue2+vant移动端app开发，react+antd中后台开发，taro小程序，qiankun微前端
              </b></li>
              <li>
                1.研发 BIMS（银保后台管理）平台，基于 umijs + qiankun.js 搭建前端微服务架构，整合银保科技多个子平台；
              </li>
              <li>2.TARO小程序框架，开发银保小程序，提升客户经理签单效率；</li>
              <li> 3.vue + vant 开发移动端 app 嵌入式 webview 页面，并处理跨平台兼容性。  </li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 my-10">
          <div className="flex flex-col col-span-2 mb-4 md:mb-0">
            <h5 className="text-xl md:text-2xl  font-bold">Nodejs Developer</h5>
            <h6 className="text-lg font-bold">埃森哲(中国)有限公司</h6>
            <p>2014/01 - 2018/12</p>
          </div>
          <div className="flex flex-col col-span-4">
            <ul>
              <li className="mb-1 wrap-break-word"><b>
                技术栈：jquery+bootstrap+NODEjs+express+Jade+less+mongodb+grunt
              </b></li>
              <li>
                1.作为核心成员完整参与过多个项目或多个Release的开发工作；
              </li>
              <li>2.能够总结项目工作的特点，提出一些针对性的改进措施；   </li>
              <li> 3.具有一定的风险识别能力，在测试发现之前，感知预发生的bug；  </li>
            </ul>
          </div>
        </div>
      </section>
      <hr className="border-gray-400 mx-44" />
      <section className="px-5 md:px-20 mt-10 font-semibold ">
        <h4 className="mb-8 text-3xl font-bold text-center md:text-left bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Education</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 my-10 text-gray-300">
          <div className="flex flex-col col-span-2 mb-4 md:mb-0">
            <h5 className="text-xl md:text-2xl  font-bold">南京信息工程大学</h5>
            <h6 className="text-lg font-bold">信息系统工程（本科）</h6>
            <p>2009/09 - 2013/07</p>
          </div>
          <div className="flex flex-col col-span-4 ">
            <ul>
              <li>英语CET-4</li>
              <li>日语JLPT-2</li>
              <li>证券从业资格证</li>
              <li>中级经济师-工商管理</li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="border-gray-400 mx-44" />
      <section className="px-5 md:px-20 mt-10 text-gray-300">
        <h4 className="mb-8 text-3xl font-bold text-center md:text-left bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Contact me</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左侧：联系方式列表 */}
          <div className="flex items-center gap-3 text-gray-300 ">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">765285102@qq.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300 ">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">+86 15221770395</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300 ">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">上海 · 浦东</p>
            </div>
          </div>
        </div>

      </section>
      {/* 社交链接 */}
      <div className="flex justify-center gap-6 mt-12">
        {[
          { icon: Github, href: 'https://github.com/leijun-xu/my-profile', label: 'GitHub', tooltip: 'Go to github to review code.' },
          // { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
          // { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
          { icon: Mail, href: 'mailto:765285102@qq.com', label: 'Email', tooltip: 'This is my email,you can contact me.' },
          { icon: FileUser, href: './resume.pdf', label: 'Resume', download: true, tooltip: 'This is my PDF resume,you can download it.' },

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
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative w-12 h-12 bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-800 group-hover:border-purple-500 transition-all duration-300">
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
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

      {/* 底部文字 */}
      <div className=" p-8 text-gray-500 text-sm gap-1 flex flex-col md:flex-row items-center justify-center md:h-3 ">
        <p>© 2026 resume of Xuleijun, by</p>
        <DevIcons />
      </div>
    </div>
  )
}
