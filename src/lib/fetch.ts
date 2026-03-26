import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { base_path } from "@/lib/const";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function fetchFun(url: string, config?: any) {
    const res = await fetch(url, config)
    let data;
    if (config?.responseType === 'blob') {
        data = await res.blob();
    } else {
        data = await res.json();
    }

    if (data.error) {
        toast.error(data.error || 'Request Failure')
        const { status } = data;
        if (status === 403) {
            signOut({ callbackUrl: base_path + '/auth/signin?error=403' })
        }
    }
    return data;
}