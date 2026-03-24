import { createDeepSeek } from "@ai-sdk/deepseek";
import type { NextRequest } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { systemPrompt } from "./prompt";

const apiKey = process.env.DEEPSEEK_API_KEY
const deepseek = createDeepSeek({
    apiKey
});

export async function POST(req: NextRequest) {
    const { messages } = await req.json()
    const result = streamText({
        // model: deepseek('deepseek-reasoner'),
        model: deepseek('deepseek-chat'),
        messages: await convertToModelMessages(messages),
        system: systemPrompt,
    })
    return result.toUIMessageStreamResponse()
}