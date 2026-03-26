import { NextRequest, NextResponse } from "next/server";
import { fetchWithCredentials } from "@/lib/fetchWithCredentials";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const payload = await req.json();
    const { captchaId, captchaCode, ...rest } = payload;

    if (!captchaId || !captchaCode) {
        return NextResponse.json({ error: "captcha missing", status: 400 });
    }

    const captchaUrl = new URL("/api/captcha", req.url).toString();
    const captchaRes = await fetch(captchaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captchaId, captchaCode }),
    });

    const captchaData = await captchaRes.json();
    if (!captchaRes.ok || captchaData.error) {
        return NextResponse.json({ error: captchaData.error || "captcha validation failed", status: 400 });
    }

    const res = await fetchWithCredentials(`/register`, {
        method: 'POST',
        body: JSON.stringify(rest),
        noToken: true // 注册接口不需要携带token
    });
    const data = await res.json();
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 });
    } else {
        return NextResponse.json(data);
    }
}