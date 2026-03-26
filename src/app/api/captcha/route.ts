import { NextResponse } from "next/server";

const captchaStore = new Map<string, { code: string; expiresAt: number }>();
const CAPTCHA_EXPIRE_MS = 1000 * 60 * 3; // 3 分钟

function randomCode(length = 4) {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function makeCaptchaSvg(code: string) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="48">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#55c7fb"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#f4f4f5" />
  <text x="50%" y="55%" font-size="32" font-family="Arial, Helvetica, sans-serif" font-weight="bold" fill="url(#g)" text-anchor="middle" dominant-baseline="middle" letter-spacing="6">${code}</text>
</svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function GET() {
    const code = randomCode(4);
    const captchaId = crypto.randomUUID();
    const expiresAt = Date.now() + CAPTCHA_EXPIRE_MS;
    captchaStore.set(captchaId, { code, expiresAt });

    const captcha = makeCaptchaSvg(code);

    return NextResponse.json({ captchaId, captcha });
}

export async function POST(req: Request) {
    const body = await req.json();
    const { captchaId, captchaCode } = body;

    if (typeof captchaId !== "string" || typeof captchaCode !== "string") {
        return NextResponse.json({ error: "captcha params missing" }, { status: 400 });
    }

    const entry = captchaStore.get(captchaId);
    if (!entry || entry.expiresAt < Date.now()) {
        captchaStore.delete(captchaId);
        return NextResponse.json({ error: "captcha expired or not found" }, { status: 400 });
    }

    if (entry.code.toLowerCase() !== captchaCode.trim().toLowerCase()) {
        return NextResponse.json({ error: "captcha incorrect" }, { status: 400 });
    }

    captchaStore.delete(captchaId);
    return NextResponse.json({ success: true });
}
