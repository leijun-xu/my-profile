"use client"

import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"
import { MessageSquareMore, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChat } from "@ai-sdk/react"
import Item from "./chat-item"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

export default function AIChat() {
  const [show, setShow] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage } = useChat()
  const [text, setText] = useState("")

  const handleSendMessage = () => {
    sendMessage({ text })
    setText("")
  }

  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={(e) => setShow(!show)}
              className="fixed right-4 bottom-4 z-20"
            >
              <div className="group relative">
                <div className="absolute -inset-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600 opacity-0 blur transition duration-300 group-hover:opacity-50"></div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-gray-800 bg-gray-900/90 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-500">
                  {/* 机器人图标 - 一直晃动 */}
                  <div className="flex justify-center">
                    <div className="group relative">
                      {/* 发光效果 */}
                      <div className="absolute inset-0 animate-pulse rounded-full bg-linear-to-r from-blue-500 to-purple-500 opacity-50 blur-xl"></div>

                      {/* 机器人图标 - 添加晃动动画 */}
                      <div className="animate-shake relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-purple-500/30 bg-linear-to-br from-gray-900 to-purple-900 shadow-2xl">
                        <Bot className="h-5 w-5 text-purple-400" />

                        {/* 简单的眼睛效果 */}
                        {/* <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-400 rounded-full"></div>
                                                <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full"></div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click me,Let`s talk ~</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div
        hidden={!show}
        className="fixed right-0 bottom-[calc(4rem+1.5rem)] z-20 mr-4 h-[634px] rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-2xs sm:w-[90%] md:w-[440px] lg:w-[440px]"
      >
        <div className="flex flex-col space-y-1.5 pb-6">
          <h2 className="text-lg font-semibold tracking-tight">Chatbot</h2>
          <p className="text-sm leading-3 text-[#6b7280]">
            Powered by DeepSeek-V3.2
          </p>
        </div>
        <div className="h-[474px] min-w-[100%] overflow-y-auto wrap-break-word">
          {messages.length ? (
            messages.map((message) => (
              <Item
                key={message.id}
                id={message.id}
                role={message.role}
                parts={message.parts || []}
              />
            ))
          ) : (
            <div className="flex h-[100%] flex-col items-center justify-center text-muted-foreground">
              <MessageSquareMore className="h-10 w-10" />
              Let`s start to chat.
            </div>
          )}
          <div ref={chatContainerRef}></div>
        </div>
        <div className="flex items-center pt-2">
          <div className="flex w-full items-center justify-center space-x-2">
            <Input
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm text-[#030712] placeholder-[#6b7280] focus:ring-2 focus:ring-[#9ca3af] focus:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Type your message"
              value={text}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              onClick={() => handleSendMessage()}
              className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-[#f9fafb] hover:bg-[#111827E6] disabled:pointer-events-none disabled:opacity-50"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        /* 简单的左右晃动动画 */
        @keyframes shake {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(5deg);
          }
          75% {
            transform: rotate(-5deg);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }

        /* 上下浮动动画（备选） */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  )
}
