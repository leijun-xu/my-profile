"use client"

import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getPrompt } from "@/dictionaries"
import type { ResumeData } from "@/dictionaries"

function LoadingPlaceholder() {
  return (
    <div className="flex min-h-100 items-center justify-center text-sm text-muted-foreground">
      Loading...
    </div>
  )
}

const ResumeContent = dynamic(() => import("@/components/resume/ResumeContent"), {
  loading: LoadingPlaceholder,
  ssr: false,
})

export default function ResumeContentWrapper() {
  const params = useParams()
  const lang = (params?.lang as string) || "zh"
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)

  useEffect(() => {
    getPrompt(lang).then(({ resumeData }) => setResumeData(resumeData))
  }, [lang])

  if (!resumeData) return <LoadingPlaceholder />

  return <ResumeContent resumeData={resumeData} />
}
