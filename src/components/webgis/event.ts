import { Feature, Map } from "ol"
import { unByKey } from "ol/Observable"
import type { EventsKey } from "ol/events"
import type Point from "ol/geom/Point"
import fetchFun from "@/lib/fetch"
import { fromLonLat } from "ol/proj"
import VectorLayer from "ol/layer/WebGLVector"
import { LineString } from "ol/geom"
import { Coordinate } from "ol/coordinate"

// Store event keys for cleanup
let hoverEventKey: EventsKey | null = null
let clickEventKey: EventsKey | null = null
let moveEndEventKey: EventsKey | null = null // 补充 moveend 事件 key，确保能被清除

function attachMoveEvent(map: Map) {
  let lastHoverFeature: Feature | null = null
  const container = map.getTargetElement()
  hoverEventKey = map.on("pointermove", (e) => {
    if (e.dragging) return

    if (lastHoverFeature) {
      lastHoverFeature.set("isHover", 0)
      lastHoverFeature = null
    }

    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (layer) => layer.get("name") === "planes",
      hitTolerance: 3,
    })
    const hoveredFeature = features[0] as Feature | undefined
    if (hoveredFeature) {
      hoveredFeature.set("isHover", 1)
      container.style.cursor = "pointer"
      lastHoverFeature = hoveredFeature
    } else {
      container.style.cursor = ""
    }
  })
}

function attachClickEvent(map: Map) {
  let lastClickFeature: Feature | null = null
  clickEventKey = map.on("click", (e) => {
    if (e.dragging) return

    if (lastClickFeature) {
      lastClickFeature.set("isSelect", 0)
      lastClickFeature = null
      removePath()
    }

    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (layer) => layer.get("name") === "planes",
      hitTolerance: 3,
    })

    const clickedFeature = features[0] as Feature | undefined

    if (clickedFeature) {
      addPath(clickedFeature)
      clickedFeature.set("isSelect", 1)
      lastClickFeature = clickedFeature

      const geometry = clickedFeature.getGeometry()
      if (geometry) {
        const center = (geometry as Point).getCoordinates()
        // 使用单个 animate 调用，避免 zoom 和 resolution 冲突
        map.getView().animate({
          center,
          zoom: 10,
          duration: 500,
        })
      }
    }
  })

  const pathLayers = map
    .getLayers()
    .getArray()
    .find((layer) => layer.get("name") === "path") as VectorLayer | undefined

  async function addPath(planeFeature: Feature) {
    const icao24 = planeFeature.get("state")?.[0]
    if (!icao24) return

    try {
      const data = await fetchFun(`/api/opensky/tracks?icao24=${icao24}&time=0`)
      let { path } = data ?? {}
      if (!path || path.length === 0) return

      path = (path as number[][]).map((p) => fromLonLat([p[2], p[1]]))
      const geometry = planeFeature.getGeometry() as Point | undefined
      if (!geometry) return

      const curPoint = geometry.getCoordinates() as Coordinate
      pathLayers?.getSource()?.addFeature(
        new Feature({
          geometry: new LineString([...path, curPoint]),
          icao24,
        })
      )
    } catch (err) {
      console.error("Failed to fetch flight path:", err)
    }
  }

  function removePath() {
    pathLayers?.getSource()?.clear()
  }
}

function attachMoveEndEvent(map: Map) {
  moveEndEventKey = map.on("moveend", () => {
    const view = map.getView()
    const center = view.getCenter()
    if (!center) return

    const extent = view.getProjection().getExtent()
    const worldWidth = extent[2] - extent[0]
    const x = center[0]
    // 将 x 坐标归一化，防止地图无限平移后坐标溢出
    view.setCenter([
      ((((x - extent[0]) % worldWidth) + worldWidth) % worldWidth) + extent[0],
      center[1],
    ])
  })
}

export function attachEvent(map: Map) {
  attachClickEvent(map)
  attachMoveEvent(map)
  attachMoveEndEvent(map)
}

// Clean up all event listeners when component unmounts
export function detachEvents() {
  if (hoverEventKey) {
    unByKey(hoverEventKey)
    hoverEventKey = null
  }
  if (clickEventKey) {
    unByKey(clickEventKey)
    clickEventKey = null
  }
  // 修复：moveend 事件之前没有清除，现在一并清理
  if (moveEndEventKey) {
    unByKey(moveEndEventKey)
    moveEndEventKey = null
  }
}
