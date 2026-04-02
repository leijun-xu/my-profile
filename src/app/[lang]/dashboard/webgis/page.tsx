"use client"

import { useEffect, useRef } from "react"
import { initMap, destroyMap } from "@/components/webgis"
import { useParams } from "next/navigation"

const labels = {
  zh: {
    title: "全球航班实时动态飞行",
    desc: "数据来源",
  },
  en: {
    title: "Global Real-Time Flight Tracking",
    desc: "Data Source",
  },
}

export default function WebgisPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const lang = (params?.lang as string) === "en" ? "en" : "zh"
  const t = labels[lang]
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    let initPromise: Promise<void> | null = null

    const init = async () => {
      if (mapRef.current && isMounted.current) {
        initPromise = initMap(mapRef.current)
        await initPromise
      }
    }

    init()

    return () => {
      isMounted.current = false
      destroyMap()
    }
  }, [])

  return (
    <div className="flex h-full flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-1 text-gray-600">
          {t.desc}:{" "}
          <a href="https://opensky-network.org/" target="_blank">
            OPENSKY
          </a>
        </p>
      </div>
      <div ref={mapRef} className="flex-1 overflow-hidden" />
    </div>
  )
}
