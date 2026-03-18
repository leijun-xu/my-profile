'use client';

import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { MessageSquareMore, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import Item from "./chat-item";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip"

export default function AIChat() {
    const [show, setShow] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const { messages, sendMessage } = useChat()
    const [text, setText] = useState('')

    const handleSendMessage = () => {
        sendMessage({ text })
        setText('')
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
                            onClick={e => setShow(!show)}
                            className=" z-20 fixed bottom-4 right-4"
                        >
                            <div className="group relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                                <div className="relative w-12 h-12 bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-800 group-hover:border-purple-500 transition-all duration-300">

                                    {/* 机器人图标 - 一直晃动 */}
                                    <div className="flex justify-center">
                                        <div className="relative group">
                                            {/* 发光效果 */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>

                                            {/* 机器人图标 - 添加晃动动画 */}
                                            <div className="relative w-12 h-12 bg-gradient-to-br from-gray-900 to-purple-900 rounded-full flex items-center justify-center border-4 border-purple-500/30 shadow-2xl animate-shake">
                                                <Bot className="w-5 h-5 text-purple-400" />

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
                hidden={show}
                className="z-20 fixed bottom-[calc(4rem+1.5rem)] shadow-2xs right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] md:w-[440px] lg:w-[440px] sm:w-[90%] h-[634px]">
                <div className="flex flex-col space-y-1.5 pb-6">
                    <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
                    <p className="text-sm text-[#6b7280] leading-3">Powered by DeepSeek-V3.2</p>
                </div>
                <div className="h-[474px] min-w-[100%] overflow-y-auto wrap-break-word">
                    {messages.length ?
                        messages.map(message => <Item key={message.id} id={message.id} role={message.role} parts={message.parts || []} />)
                        :
                        <div className="text-muted-foreground h-[100%] flex flex-col items-center justify-center">
                            <MessageSquareMore className="h-10 w-10" />
                            Let`s start to chat.
                        </div>
                    }
                    <div ref={chatContainerRef}></div>
                </div>
                <div className="flex items-center pt-2">
                    <div className="flex items-center justify-center w-full space-x-2">
                        <Input
                            className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                            placeholder="Type your message"
                            value={text}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleSendMessage()
                                }
                            }}
                            onChange={e => setText(e.target.value)}
                        />
                        <Button
                            onClick={() => handleSendMessage()}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2">
                            Send</Button>
                    </div>
                </div>

            </div>
            <style jsx global>{`
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  
  /* 简单的左右晃动动画 */
  @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(5deg); }
    75% { transform: rotate(-5deg); }
  }
  
  .animate-shake {
    animation: shake 0.5s ease-in-out infinite;
  }
  
  /* 上下浮动动画（备选） */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
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
