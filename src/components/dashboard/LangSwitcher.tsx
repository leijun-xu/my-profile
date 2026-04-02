"use client"

import { usePathname, useRouter } from "next/navigation"
import { locales } from "@/dictionaries"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function LangSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLang = (next: string) => {
    if (!next || next === lang) return
    const segments = pathname.split("/")
    if (locales.includes(segments[1])) {
      segments[1] = next
    } else {
      segments.splice(1, 0, next)
    }
    router.push(segments.join("/"))
  }

  return (
    <ToggleGroup
      type="single"
      value={lang}
      onValueChange={switchLang}
      className="h-8 gap-0 rounded-md border border-border bg-muted p-0.5"
    >
      <ToggleGroupItem
        value="zh"
        aria-label="切换为中文"
        className="h-7 cursor-pointer rounded-sm px-3 text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm"
      >
        中文
      </ToggleGroupItem>
      <ToggleGroupItem
        value="en"
        aria-label="Switch to English"
        className="h-7 cursor-pointer rounded-sm px-3 text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm"
      >
        EN
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
