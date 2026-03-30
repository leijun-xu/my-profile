import { Map, View } from "ol"
import { createBaseLayers } from "./baseLayers"
import { createPlaneLayers } from "./planeLayers"
import { fromLonLat } from "ol/proj"
import { attachEvent } from "./event"
import { update } from "./update"
import "ol/ol.css"

// 北京坐标：经度 116.4074°E, 纬度 39.9042°N
const BEIJING_COORDINATES = [116.4074, 39.9042]

export async function initMap(container: HTMLDivElement) {
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
  update(map)
}
