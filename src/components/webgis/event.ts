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

function attachMoveEvent(map: Map) {
  let lastHoverFeature: Feature | null = null
  const container = map.getTargetElement()
  hoverEventKey = map.on("pointermove", (e) => {
    if (e.dragging) {
      return
    }
    // 如果上一次hover的feature不为空，则取消hover
    if (lastHoverFeature) {
      lastHoverFeature.set("isHover", 0)
      lastHoverFeature = null
    }

    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (layer) => layer.get("name") === "planes",
      hitTolerance: 3,
    })
    const hoveredFeature = features[0] as Feature
    // 如果当前hover的feature不为空，则设置hover
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
    if (e.dragging) {
      return
    }
    if (lastClickFeature) {
      lastClickFeature.set("isSelect", 0)
      lastClickFeature = null
      removePath()
    }

    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (layer) => layer.get("name") === "planes",
      hitTolerance: 3,
    })

    const clickedFeature = features[0] as Feature

    if (clickedFeature) {
      addPath(clickedFeature)
      clickedFeature.set("isSelect", 1)
      lastClickFeature = clickedFeature
      // reset center point
      const geometry = clickedFeature.getGeometry()
      if (geometry) {
        const point = geometry as Point
        const center = point.getCoordinates()
        map.getView().animate(
          {
            center,
            duration: 500,
          },
          {
            duration: 500,
            zoom: 10,
            rotation: 0,
            resolution: 1,
          }
        )
      }
    }
  })
  const pathLayers = map
    .getLayers()
    .getArray()
    .find((layer) => layer.get("name") === "path") as VectorLayer

  async function addPath(planeFeature: Feature) {
    const icao24 = planeFeature.get("state")[0]
    let { path } = await fetchFun(`/api/opensky/tracks?icao24=${icao24}&time=0`)

    if (!path || path.length === 0) return
    path = path.map((p: number[]) => fromLonLat([p[2], p[1]]))
    const geometry = planeFeature.getGeometry() as Point
    const curPoint = geometry.getCoordinates() as Coordinate
    pathLayers?.getSource()?.addFeature(
      new Feature({
        geometry: new LineString([...path, curPoint]),
        icao24,
      })
    )
  }

  function removePath() {
    pathLayers?.getSource()?.clear()
  }
}
function attachMoveEndEvent(map: Map) {
  map.on("moveend", () => {
    const view = map.getView()
    const center = view.getCenter() as Coordinate
    const extent = view.getProjection().getExtent()

    const worldWidth = extent[2] - extent[0]
    const x = center[0]
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

// Clean up event listeners when component unmounts
export function detachEvents() {
  if (hoverEventKey) {
    unByKey(hoverEventKey)
    hoverEventKey = null
  }
  if (clickEventKey) {
    unByKey(clickEventKey)
    clickEventKey = null
  }
}
