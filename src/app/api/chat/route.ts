import { createDeepSeek } from "@ai-sdk/deepseek";
import type { NextRequest } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { getPrompt } from "@/dictionaries";

const apiKey = process.env.DEEPSEEK_API_KEY
const deepseek = createDeepSeek({
    apiKey
});

export async function POST(req: NextRequest) {
    const { messages, locale } = await req.json()
    const { systemPrompt } = await getPrompt(locale || "zh")
    const result = streamText({
        model: deepseek('deepseek-chat'),
        messages: await convertToModelMessages(messages),
        system: systemPrompt,
    })
    return result.toUIMessageStreamResponse()
}
