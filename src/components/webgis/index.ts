import { Map, View } from "ol"
import { createBaseLayers } from "./baseLayers"
import { createPlaneLayers } from "./planeLayers"
import { fromLonLat } from "ol/proj"
import { attachEvent, detachEvents } from "./event"
import { startUpdate, stopUpdate } from "./update"
// import "ol/ol.css" // CSS 已在全局样式中处理

// 北京坐标：经度 116.4074°E, 纬度 39.9042°N
const BEIJING_COORDINATES = [116.4074, 39.9042]

// 存储 map 实例以便在销毁时清理
let mapInstance: Map | null = null

export async function initMap(container: HTMLDivElement) {
  try {
    const map = new Map({
      target: container,
      layers: [],
      view: new View({
        center: fromLonLat(BEIJING_COORDINATES),
        zoom: 1,
        minZoom: 1,
        maxZoom: 13,
      }),
    })

    createBaseLayers().forEach((layer) => {
      map.addLayer(layer)
    })

    const planeLayers = await createPlaneLayers()
    planeLayers.forEach((layer) => {
      map.addLayer(layer)
    })

    attachEvent(map)
    startUpdate(map)

    mapInstance = map
  } catch (error) {
    console.error("Failed to initialize map:", error)
    // 清理已创建的资源
    if (mapInstance) {
      destroyMap()
    }
    throw error
  }
}

export function destroyMap() {
  if (mapInstance) {
    // 停止更新循环和事件监听
    stopUpdate()
    detachEvents()

    // 清空所有图层
    mapInstance.getLayers().clear()

    // 断开 DOM 引用，释放 OpenLayers 资源
    mapInstance.setTarget(undefined)

    mapInstance = null
  }
}
