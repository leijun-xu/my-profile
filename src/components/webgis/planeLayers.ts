import { Feature } from "ol"
import Point from "ol/geom/Point"
import VectorLayer from "ol/layer/WebGLVector"
import VectorSource from "ol/source/Vector"
import fetchFun from "@/lib/fetch"
import { fromLonLat } from "ol/proj"
import { LineString } from "ol/geom"
import { Stroke } from "ol/style"

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
          icao24: state[0],
          time_position: state[3],
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
  const normalStyle = {
    "icon-src": "/plane.svg",
    "icon-width": 23,
    "icon-height": 23,
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
    source: new VectorSource({
      features,
    }),
    style: [
      {
        filter: ["==", ["+", ["get", "isHover"], ["get", "isSelect"]], 0],
        style: normalStyle,
      },
      {
        else: true,
        style: activeStyle,
      },
    ],
    name: "planes",
  })

  return [planesLayer]
}

function createPath() {
  const layer = new VectorLayer({
    source: new VectorSource({
      features: [
        new Feature({
          geometry: new LineString([
            fromLonLat([116, 39]),
            fromLonLat([121, 39]),
            fromLonLat([135, 39]),
          ]),
        }),
      ],
    }),
    style: {
      "stroke-width": 2,
      "stroke-color": "red",
    },
  })
  return [layer]
}

export async function createPlaneLayers() {
  const planesLayers = await createPlane()
  const pathLayers = createPath()
  return [...planesLayers, ...pathLayers]
}
