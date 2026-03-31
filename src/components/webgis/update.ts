import { Feature, Map as OLMap } from "ol"
import fetchFun from "@/lib/fetch"
import VectorLayer from "ol/layer/WebGLVector"
import VectorSource from "ol/source/Vector"
import { fromLonLat, transform } from "ol/proj"
import Point from "ol/geom/Point"
import { LineString } from "ol/geom"

let lastUpdateTime = 0 // 上次更新时间
let lastRemoteUpdateTime = Date.now() // 上次远程更新时间
const REMOTE_UPDATE_INTERVAL = 15000 // 远程更新间隔 15秒

let remoteState: number[][] | null = null
let animationFrameId: number | null = null // 存储动画帧ID
let isUpdating = false // 是否正在更新

// 记录每架飞机的最后更新时间，用于增量计算
const planeLastUpdateTime = new Map<string, number>()

function getInterval(zoom: number) {
  const zoomInt = Math.floor(zoom)
  return [, 5000, 4000, 3000, 2000, 1000, 500, 100, 50][zoomInt] || 16
}

export function startUpdate(map: OLMap) {
  if (isUpdating) {
    console.log("Update already running, skipping")
    return // 如果已经在更新，不再重复启动
  }
  isUpdating = true
  console.log("Starting update loop")
  updateLoop(map)
}

export function stopUpdate() {
  console.log(
    "Stopping update loop, isUpdating:",
    isUpdating,
    "animationFrameId:",
    animationFrameId
  )
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  isUpdating = false
  planeLastUpdateTime.clear() // 清空时间记录
  console.log("Update stopped, isUpdating:", isUpdating)
}

function updateLoop(map: OLMap) {
  if (!isUpdating) {
    console.log("updateLoop: isUpdating is false, stopping")
    return
  }

  update(map)

  // 只有在仍然需要更新时才请求下一帧
  if (isUpdating) {
    animationFrameId = requestAnimationFrame(() => {
      updateLoop(map)
    })
  }
}

function update(map: OLMap) {
  // 检查是否应该停止更新
  if (!isUpdating) {
    console.log("update: isUpdating is false, skipping")
    return
  }

  // update logic
  const now = Date.now()

  if (now - lastRemoteUpdateTime > REMOTE_UPDATE_INTERVAL) {
    lastRemoteUpdateTime = now
    // 执行远程更新逻辑
    fetchFun("/api/opensky/states").then((data) => {
      if (isUpdating) {
        // 只有在仍在更新时才处理数据
        remoteState = data.states
        console.log("Remote data updated")
      } else {
        console.log("Skipping remote data update, isUpdating is false")
      }
    })
  }
  const zoom = map.getView().getZoom() as number

  const interval = getInterval(zoom)

  if (now - lastUpdateTime > interval) {
    lastUpdateTime = now
    // 执行更新逻辑
    console.log("update: updating layers")
    updateLayers(map)
  }
}

function updateLayers(map: OLMap) {
  if (!isUpdating) {
    return
  }

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
      feature.set("state", newState)
      // 更新这架飞机的时间记录
      planeLastUpdateTime.set(String(icao24), newState[3])
      remoteStatesMap.delete(String(icao24))
    } else {
      airplaneSource?.removeFeature(feature)
      planeLastUpdateTime.delete(String(icao24))
    }
  }

  for (const [, newState] of remoteStatesMap) {
    const icao24 = String(newState[0])
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
    // 记录新飞机的时间
    planeLastUpdateTime.set(icao24, newState[3])
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
  const currentTime = Date.now() / 1000

  for (const feature of features) {
    // 更新飞机特征
    const state = feature.get("state")
    const icao24 = String(state[0])
    const velocity = state[9]
    const headingDegrees = state[10] || 0
    const heading = headingDegrees * (Math.PI / 180)

    if (!velocity || !heading) {
      continue
    }

    // 获取上次更新时间，如果没有则使用当前时间
    const lastTime = planeLastUpdateTime.get(icao24) || state[3] || currentTime
    // 计算增量时间差（秒）
    const deltaTime = currentTime - lastTime

    // 如果时间差太小，跳过更新
    if (deltaTime <= 0) {
      continue
    }

    // 更新这架飞机的时间记录
    planeLastUpdateTime.set(icao24, currentTime)

    // 使用当前 geometry 的坐标作为起点（已包含之前的移动）
    const currentGeometry = feature.getGeometry() as Point
    const [x, y] = currentGeometry.getCoordinates()
    const d = velocity * deltaTime //移动的距离
    const newPoint = [x + d * Math.sin(heading), y + d * Math.cos(heading)]
    // 对于 WebGLVector，需要创建新的 geometry 对象来触发重新渲染
    feature.setGeometry(new Point(newPoint))

    // // 将新的地图坐标转回经纬度，更新到 state 中
    // const newLonLat = transform([x, y], "EPSG:3857", "EPSG:4326")
    // state[5] = newLonLat[0]
    // state[6] = newLonLat[1]
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
