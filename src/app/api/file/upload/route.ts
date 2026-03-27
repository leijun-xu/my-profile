import { NextRequest, NextResponse } from "next/server";
import { fetchWithCredentials } from "@/lib/fetchWithCredentials";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
   
    const res = await fetchWithCredentials('/file/upload', {
        method: 'POST',
        body: formData,
        isFormDataWithFile:true
    });

    const data = await (res as NextResponse).json()
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 })
    } else {
        return NextResponse.json(data)
    }
}