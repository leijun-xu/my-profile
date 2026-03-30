import { Feature } from "ol"
import Point from "ol/geom/Point"
import VectorLayer from "ol/layer/WebGLVector"
import VectorSource from "ol/source/Vector"
import fetchFun from "@/lib/fetch"
import { fromLonLat } from "ol/proj"

async function createFeatures() {
  try {
    const data = await fetchFun("/api/opensky/states")
    const states = data?.states || []

    if (!Array.isArray(states) || states.length === 0) {
      return []
    }

    return states
      .filter(
        (state: number[]) =>
          state &&
          Array.isArray(state) &&
          state.length > 10 &&
          typeof state[5] === "number" &&
          typeof state[6] === "number"
      )
      .map((state: number[]) => {
        // OpenSky state[10] 是以正北为0°，顺时针旋转的角度（0-360°）
        // OpenLayers 使用弧度，需要将角度转换为弧度: radians = degrees * Math.PI / 180
        const headingDegrees = state[10] || 0
        const headingRadians = headingDegrees * (Math.PI / 180)

        return new Feature({
          geometry: new Point(fromLonLat([state[5], state[6]])),
          state,
          heading: headingRadians, // 使用弧度而不是角度
          isHover: 0,
          isSelect: 0,
        })
      })
  } catch (error) {
    console.error("Failed to create plane features:", error)
    return []
  }
}

async function createPlane() {
  const features = await createFeatures()
  const source = new VectorSource({
    features,
  })
  const normalStyle = {
    "icon-src": "/plane.svg",
    "icon-width": 26,
    "icon-height": 26,
    "icon-anchor": [0.5, 0.5],
    "icon-rotate-with-view": false,
    "icon-rotation": ["get", "heading"],
    "icon-color": "blue",
  }
  const activeStyle = {
    ...normalStyle,
    "icon-color": "#F40",
  }
  const planesLayer = new VectorLayer({
    source,
    style: [
      {
        filter: ["==", ["+", ["get", "isSelect"], ["get", "isHover"]], 0],
        style: normalStyle,
      },
    ],
    name: "planes",
  })
  const activePlanesLayer = new VectorLayer({
    source,
    style: [
      {
        filter: [">", ["+", ["get", "isSelect"], ["get", "isHover"]], 0],
        style: activeStyle,
      },
    ],
    name: "activePlanes",
  })
  return [planesLayer, activePlanesLayer]
}

function createPath() {
  const layer = new VectorLayer({
    source: new VectorSource({
      features: [],
    }),
    style: {
      "stroke-width": 2,
      "stroke-color": "#f40",
    },
    name: "path",
  })
  return [layer]
}

export async function createPlaneLayers() {
  const planesLayers = await createPlane()
  const pathLayers = createPath()
  return [...planesLayers, ...pathLayers]
}
