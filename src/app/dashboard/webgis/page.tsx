"use client"

import { useEffect, useRef } from "react"
import { initMap } from "@/components/webgis"

export default function SettingsPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    mapRef.current && initMap(mapRef.current)
  }, [])
  return (
    <div className="flex h-full flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">webgis</h1>
        <p className="mt-1 text-gray-600">
          全球航班实时动态飞行(数据来源:
          <a href="https://opensky-network.org/" target="_blank">
            OPENSKY
          </a>
          )
        </p>
      </div>

      <div ref={mapRef} className="flex-1 overflow-hidden" />
    </div>
  )
}
