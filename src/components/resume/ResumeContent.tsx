"use client"

import {
  Github as GithubIcon,
  Mail,
  PhoneCall,
  MapPin,
  FileUser,
  X,
} from "lucide-react"
import Skills from "@/components/resume/skill"
import { Typewriter } from "@/components/resume/typeWriter"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { resumeData } from "@/app/api/chat/prompt"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function ResumeContent() {
  const [show, setShow] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const showBig = (gifSrc: string) => {
    // 将滚动条设置到top
    window.scrollTo({ top: 0, behavior: "smooth" })
    setShow(true)
    setImgSrc(gifSrc)
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <div
        className={cn(
          "absolute inset-0 z-20 bg-gray-500/80",
          show ? "block" : "hidden"
        )}
      >
        <button
          className="absolute top-4 right-4 cursor-pointer rounded-full bg-gray-300 p-1 text-black shadow-md ring-1 ring-black/10"
          onClick={() => setShow(false)}
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex h-screen w-full items-center justify-center">
          {imgSrc && (
            <Image
              src={imgSrc}
              alt={imgSrc}
              width={500}
              height={300}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 50vw"
              className="h-auto w-[90vh] rotate-90 md:w-[90vw] md:rotate-0 lg:w-[50vw]"
            />
          )}
        </div>
      </div>
      <div className="w-full py-5 text-center font-bold wrap-break-word text-yellow-700 md:h-12.5 md:px-20">
        <Typewriter text={resumeData.personal.welcomeWords} />
      </div>
      <section className="mt-10 px-5 text-gray-300 md:px-20">
        <h4 className="mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-left">
          Key Projects(In my website)
        </h4>
        <div className="w-full wrap-break-word">
          {resumeData.personal.keyProjects.map((kp) => (
            <div key={kp.title} className="my-2">
              <h5 className="text-lg font-bold">{kp.title}</h5>
              <div dangerouslySetInnerHTML={{ __html: kp.description }}></div>
              <Image
                src={kp.gif}
                alt={kp.title}
                width={500}
                height={300}
                className="cursor-pointer"
                onClick={() => showBig(kp.gif)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 px-5 text-gray-300 md:px-20">
        <h4 className="mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-left">
          Summary
        </h4>
        <div className="w-full wrap-break-word">
          <div>{resumeData.personal.summary}</div>
        </div>
      </section>

      <Skills />

      <hr className="mx-44 border-gray-400" />
      <section className="mt-10 px-5 text-gray-300 md:px-20">
        <h4 className="mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-left">
          Experience
        </h4>
        {resumeData.experiences.map((exp) => (
          <div
            key={exp.company}
            className="my-10 grid grid-cols-1 md:grid-cols-6"
          >
            <div className="col-span-2 mb-4 flex flex-col md:mb-0">
              <h5 className="text-xl font-bold md:text-2xl">{exp.role}</h5>
              <h6 className="text-lg font-bold">{exp.company}</h6>
              <p>{exp.period}</p>
            </div>
            <div className="col-span-4 flex flex-col">
              <ul>
                {exp.achievements.map((ach, index) => (
                  <li key={index} className="mb-1 wrap-break-word">
                    <div dangerouslySetInnerHTML={{ __html: ach }}></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
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
              <li>英语CET-6</li>
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
            icon: GithubIcon,
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
            href: "/assets/xuleijun-Frontend-resume.pdf",
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
