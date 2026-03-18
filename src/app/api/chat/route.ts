import { createDeepSeek } from "@ai-sdk/deepseek";
import type { NextRequest } from "next/server";
import { streamText, convertToModelMessages } from "ai";

const apiKey = process.env.DEEPSEEK_API_KEY
const deepseek = createDeepSeek({
    apiKey
});

export async function POST(req: NextRequest) {
    const { messages } = await req.json()
    const result = streamText({
        model: deepseek('deepseek-chat'),
        messages: await convertToModelMessages(messages),
        system: '你是一个资深前端开发者，按照你的专业给与用户帮助',
    })
    return result.toUIMessageStreamResponse()
}