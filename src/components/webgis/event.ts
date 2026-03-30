import { Feature, Map } from "ol"
import { unByKey } from "ol/Observable"
import type { EventsKey } from "ol/events"
import type Point from "ol/geom/Point"
import fetchFun from "@/lib/fetch"

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
    }

    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (layer) => layer.get("name") === "planes",
      hitTolerance: 3,
    })

    const clickedFeature = features[0] as Feature

    if (clickedFeature) {
      clickedFeature.set("isSelect", 1)
      lastClickFeature = clickedFeature
      addPath(clickedFeature)
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

  async function addPath(planeFeature: Feature) {
    const icao24 = planeFeature.get("icao24")
    const time = planeFeature.get("time_position")
    console.log(icao24, time)
    const data = await fetchFun(
      `/api/opensky/track?icao24=${icao24}&time=${time}`
    )
    console.log(data)
  }

  function removePath() {}
}

export function attachEvent(map: Map) {
  attachClickEvent(map)
  attachMoveEvent(map)
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
