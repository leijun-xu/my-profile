"use client"

import { useEffect, useRef } from "react"
import { initMap } from "@/components/webgis"
import { detachEvents } from "@/components/webgis/event"
import { LogIn } from "lucide-react"
import Link from "next/link"

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
      <div className="relative m-0 bg-white py-2 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900">webgis</h1>
        <p className="mt-1 text-gray-600">
          全球航班实时动态飞行(数据来源:
          <a href="https://opensky-network.org/" target="_blank">
            OPENSKY
          </a>
          )
        </p>
        <Link
          href="/auth/signin"
          className="absolute top-1/2 right-2 ml-10 translate-y-[-50%] text-gray-700 transition-colors duration-300 hover:text-gray-950"
        >
          <LogIn className="h-7 w-7" />
        </Link>
      </div>

      <div ref={mapRef} className="flex-1 overflow-hidden" />
    </div>
  )
}
