'use client';

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { useEffect } from "react";

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (!session) {
      router.push('/auth/signin')
    } else {
      router.push('/resume')
    }
  }
    , [session, status, router])
  return <Loader />
}
