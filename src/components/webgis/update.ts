import { Feature, Map as OLMap } from "ol"
import fetchFun from "@/lib/fetch"
import VectorLayer from "ol/layer/WebGLVector"
import VectorSource from "ol/source/Vector"
import { fromLonLat } from "ol/proj"
import Point from "ol/geom/Point"
import { LineString } from "ol/geom"

let lastUpdateTime = 0 // 上次更新时间
let lastRemoteUpdateTime = Date.now() // 上次远程更新时间
const REMOTE_UPDATE_INTERVAL = 15000 // 远程更新间隔 15秒

let remoteState: number[][] | null = null
function getInterval(zoom: number) {
  const zoomInt = Math.floor(zoom)
  return [, 5000, 4000, 3000, 2000, 1000, 500, 100, 50][zoomInt] || 16
}
export function update(map: OLMap) {
  requestAnimationFrame(() => {
    update(map)
  })
  // update logic
  const now = Date.now()

  if (now - lastRemoteUpdateTime > REMOTE_UPDATE_INTERVAL) {
    lastRemoteUpdateTime = now
    // 执行远程更新逻辑
    fetchFun("/api/opensky/states").then((data) => {
      remoteState = data.states
    })
  }
  const zoom = map.getView().getZoom() as number

  const interval = getInterval(zoom)

  if (now - lastUpdateTime > interval) {
    lastUpdateTime = now
    // 执行更新逻辑
    console.log("update")
    updateLayers(map)
  }
}

function updateLayers(map: OLMap) {
  if (remoteState) {
    // 处理远程数据
    applyRemoteState(map)
  }
  // 更新数据处理
  updatePlaneLayer(map)
  updatePathLayer(map)
}
function applyRemoteState(map: OLMap) {
  const layers = map.getLayers().getArray()

  const airplaneSource = (
    layers.find((layer) => layer.get("name") === "planes") as VectorLayer
  ).getSource()
  const planeFeatures = airplaneSource?.getFeatures()
  const remoteStatesMap = remoteState?.reduce((map, state) => {
    map.set(String(state[0]), state)
    return map
  }, new Map()) as Map<string, number[]>
  // 使用远程数据更新
  for (const feature of planeFeatures || []) {
    const icao24 = feature.get("state")[0]

    const newState = remoteStatesMap?.get(String(icao24))

    if (newState) {
      //  return new Feature({
      //           geometry: new Point(fromLonLat([state[5], state[6]])),
      //           state,
      //           heading: headingRadians, // 使用弧度而不是角度
      //           isHover: 0,
      //           isSelect: 0,
      //         })
      feature.set("state", newState)
      remoteStatesMap.delete(String(icao24))
    } else {
      airplaneSource?.removeFeature(feature)
    }
  }

  for (const [, newState] of remoteStatesMap) {
    const headingDegrees = newState[10] || 0
    const heading = headingDegrees * (Math.PI / 180)
    const feature = new Feature({
      geometry: new Point(fromLonLat([newState[5], newState[6]])),
      state: newState,
      heading,
      isHover: 0,
      isSelect: 0,
    })

    airplaneSource?.addFeature(feature)
  }
  remoteState = null
}
function updatePlaneLayer(map: OLMap) {
  // 获取所有飞机的Feature
  const planeLayer = map
    .getLayers()
    .getArray()
    .find((layer) => layer.get("name") === "planes") as VectorLayer
  const source = planeLayer.getSource() as VectorSource
  const features = source.getFeatures()
  for (const feature of features) {
    // 更新飞机特征
    const state = feature.get("state")
    const lon = state[5]
    const lat = state[6]
    const velocity = state[9]
    const headingDegrees = state[10] || 0
    const heading = headingDegrees * (Math.PI / 180)
    const timePosition = state[3]
    if (!velocity || !heading) {
      continue
    }
    const [x, y] = fromLonLat([lon, lat]) // 转换为地图坐标
    const t = Date.now() / 1000 - timePosition // 经过的时间
    const d = velocity * t //移动的距离
    // console.log("updatePlaneLayer:", { t, d, x, y, heading })
    const newPoint = [x + d * Math.sin(heading), y + d * Math.cos(heading)]
    // 对于 WebGLVector，需要创建新的 geometry 对象来触发重新渲染
    feature.setGeometry(new Point(newPoint))
  }
}

function updatePathLayer(map: OLMap) {
  // 更新路径图层
  const layers = map.getLayers().getArray()
  const pathLayer = layers.find(
    (layer) => layer.get("name") === "path"
  ) as VectorLayer
  const planeLayer = layers.find(
    (layer) => layer.get("name") === "planes"
  ) as VectorLayer

  const pathsource = pathLayer.getSource() as VectorSource

  const pathfeatures = pathsource.getFeatures()

  for (const feature of pathfeatures) {
    const geometry = feature.getGeometry() as LineString
    const pathPoints = geometry.getCoordinates()
    const icao24 = feature.get("icao24")
    const planeSource = planeLayer.getSource()
    if (!planeSource) {
      continue
    }
    const planeFeature = planeSource
      .getFeatures()
      .find((f) => f.get("state")[0] === icao24) as Feature

    if (!planeFeature) {
      continue
    }
    const planeGeometry = planeFeature.getGeometry() as Point
    const curPoint = planeGeometry.getCoordinates()
    pathPoints[pathPoints.length - 1] = curPoint
    // 对于 WebGLVector，需要创建新的 geometry 对象来触发重新渲染
    feature.setGeometry(new LineString([...pathPoints]))
  }
}
