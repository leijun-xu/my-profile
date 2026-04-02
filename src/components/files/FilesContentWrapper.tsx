"use client"

import dynamic from "next/dynamic"
import { Dictionary } from "@/dictionaries"

function LoadingPlaceholder() {
  return (
    <div className="flex min-h-100 items-center justify-center text-sm text-muted-foreground">
      Loading...
    </div>
  )
}

const FilesContent = dynamic(() => import("@/components/files/FilesContent"), {
  loading: LoadingPlaceholder,
  ssr: false,
})

export default function FilesContentWrapper({ dict }: { dict: Dictionary }) {
  return <FilesContent dict={dict} />
}
