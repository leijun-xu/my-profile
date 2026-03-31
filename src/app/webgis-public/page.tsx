"use client"

import { useEffect, useRef } from "react"
import { initMap } from "@/components/webgis"
import { detachEvents } from "@/components/webgis/event"

export default function SettingsPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    mapRef.current && initMap(mapRef.current)
    return () => {
      detachEvents()
    }
  }, [])
  return (
    <div className="flex h-screen flex-col space-y-6">
      <div className="text-white">
        <h1 className="text-3xl font-bold">webgis</h1>
        <p className="mt-1">
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
