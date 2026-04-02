import { Feature, Map as OLMap } from "ol"
import fetchFun from "@/lib/fetch"
import VectorLayer from "ol/layer/WebGLVector"
import VectorSource from "ol/source/Vector"
import { fromLonLat, transform } from "ol/proj"
import Point from "ol/geom/Point"
import { LineString } from "ol/geom"

// 所有模块级状态集中管理，stopUpdate 时完整重置，防止组件重建后状态污染
let lastUpdateTime = 0
let lastRemoteUpdateTime = 0 // 初始为 0，首次 update 时立即触发远程拉取
const REMOTE_UPDATE_INTERVAL = 15000

let remoteState: number[][] | null = null
let animationFrameId: number | null = null
let isUpdating = false

// 记录每架飞机的最后更新时间（秒），用于位置插值计算
const planeLastUpdateTime = new Map<string, number>()

function getInterval(zoom: number) {
  const zoomInt = Math.floor(zoom)
  // zoom 1-8 对应的本地帧率间隔（ms），zoom 0 或超出范围时兜底 5000ms
  const intervals: Record<number, number> = {
    1: 5000,
    2: 4500,
    3: 4000,
    4: 3000,
    5: 2000,
    6: 1000,
    7: 500,
    8: 300,
    9: 100,
    10: 50,
    11: 30,
  }
  return intervals[zoomInt] ?? 16
}

function resetState() {
  lastUpdateTime = 0
  lastRemoteUpdateTime = 0
  remoteState = null
  animationFrameId = null
  isUpdating = false
  planeLastUpdateTime.clear()
}

export function startUpdate(map: OLMap) {
  if (isUpdating) {
    return
  }
  isUpdating = true
  updateLoop(map)
}

export function stopUpdate() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  resetState()
}

function updateLoop(map: OLMap) {
  if (!isUpdating) return

  update(map)

  if (isUpdating) {
    animationFrameId = requestAnimationFrame(() => {
      updateLoop(map)
    })
  }
}

function update(map: OLMap) {
  if (!isUpdating) return

  const now = Date.now()

  if (now - lastRemoteUpdateTime > REMOTE_UPDATE_INTERVAL) {
    lastRemoteUpdateTime = now
    fetchFun("/api/opensky/states")
      .then((data) => {
        // 接口返回后再次确认仍在运行，且数据格式合法
        if (isUpdating && data?.states && Array.isArray(data.states)) {
          remoteState = data.states
        }
      })
      .catch((err) => {
        console.error("Failed to fetch remote states:", err)
      })
  }

  const zoom = map.getView().getZoom() ?? 1
  const interval = getInterval(zoom)

  if (now - lastUpdateTime > interval) {
    lastUpdateTime = now
    updateLayers(map)
  }
}

function updateLayers(map: OLMap) {
  if (!isUpdating) return

  if (remoteState) {
    applyRemoteState(map)
  }
  console.log("更新飞机层和轨迹，本地数据")

  updatePlaneLayer(map)
  updatePathLayer(map)
}

function applyRemoteState(map: OLMap) {
  console.log("处理远程数据")
  const layers = map.getLayers().getArray()

  const planeLayer = layers.find((layer) => layer.get("name") === "planes") as
    | VectorLayer
    | undefined

  // guard: layer 不存在时安全退出
  if (!planeLayer) return
  const airplaneSource = planeLayer.getSource()
  if (!airplaneSource) return

  const planeFeatures = airplaneSource.getFeatures()

  const remoteStatesMap = (remoteState ?? []).reduce((acc, state) => {
    acc.set(String(state[0]), state)
    return acc
  }, new Map<string, number[]>())

  // 遍历现有 feature，更新或移除
  for (const feature of planeFeatures) {
    const icao24 = String(feature.get("state")[0])
    const newState = remoteStatesMap.get(icao24)

    if (newState) {
      // 坐标和 heading 合法性校验
      if (
        typeof newState[5] === "number" &&
        typeof newState[6] === "number" &&
        isFinite(newState[5]) &&
        isFinite(newState[6])
      ) {
        feature.set("state", newState)
        feature.set("heading", (newState[10] ?? 0) * (Math.PI / 180))
        feature.setGeometry(new Point(fromLonLat([newState[5], newState[6]])))
        planeLastUpdateTime.set(icao24, newState[3])
      }
      remoteStatesMap.delete(icao24)
    } else {
      // 远程数据中不再存在该飞机，移除
      airplaneSource.removeFeature(feature)
      planeLastUpdateTime.delete(icao24)
    }
  }

  // 远程新增的飞机
  for (const [, newState] of remoteStatesMap) {
    if (
      typeof newState[5] !== "number" ||
      typeof newState[6] !== "number" ||
      !isFinite(newState[5]) ||
      !isFinite(newState[6])
    ) {
      continue
    }
    const icao24 = String(newState[0])
    const heading = (newState[10] ?? 0) * (Math.PI / 180)
    const feature = new Feature({
      geometry: new Point(fromLonLat([newState[5], newState[6]])),
      state: newState,
      heading,
      isHover: 0,
      isSelect: 0,
    })
    airplaneSource.addFeature(feature)
    planeLastUpdateTime.set(icao24, newState[3])
  }

  remoteState = null
}

function updatePlaneLayer(map: OLMap) {
  const planeLayer = map
    .getLayers()
    .getArray()
    .find((layer) => layer.get("name") === "planes") as VectorLayer | undefined

  // guard: layer 不存在时安全退出，防止 crash 中断整个更新循环
  if (!planeLayer) return
  const source = planeLayer.getSource() as VectorSource | null
  if (!source) return

  const features = source.getFeatures()
  const currentTime = Date.now() / 1000

  for (const feature of features) {
    const state = feature.get("state")
    if (!state) continue

    const icao24 = String(state[0])
    const velocity = state[9] as number | undefined

    // 速度为 0 或无效时跳过（飞机停止），但不再用 !heading 误跳正北方向
    if (!velocity || !isFinite(velocity)) continue

    const headingDegrees = state[10] ?? 0
    const heading = headingDegrees * (Math.PI / 180)
    // heading === 0 表示正北，是合法方向，不应跳过
    if (!isFinite(heading)) continue

    const lastTime =
      planeLastUpdateTime.get(icao24) ?? (state[3] as number) ?? currentTime
    const deltaTime = currentTime - lastTime

    if (deltaTime <= 0) continue

    planeLastUpdateTime.set(icao24, currentTime)

    const currentGeometry = feature.getGeometry() as Point | undefined
    if (!currentGeometry) continue

    const [x, y] = currentGeometry.getCoordinates()
    const d = velocity * deltaTime
    const newPoint: [number, number] = [
      x + d * Math.sin(heading),
      y + d * Math.cos(heading),
    ]

    feature.setGeometry(new Point(newPoint))

    // 反算经纬度，更新 state，供 path 图层使用
    const newLonLat = transform(newPoint, "EPSG:3857", "EPSG:4326")
    state[5] = newLonLat[0]
    state[6] = newLonLat[1]
  }
}

function updatePathLayer(map: OLMap) {
  const layers = map.getLayers().getArray()

  const pathLayer = layers.find((layer) => layer.get("name") === "path") as
    | VectorLayer
    | undefined
  const planeLayer = layers.find((layer) => layer.get("name") === "planes") as
    | VectorLayer
    | undefined

  // guard: 任一 layer 不存在时安全退出
  if (!pathLayer || !planeLayer) return

  const pathSource = pathLayer.getSource() as VectorSource | null
  const planeSource = planeLayer.getSource()
  if (!pathSource || !planeSource) return

  const pathFeatures = pathSource.getFeatures()

  for (const feature of pathFeatures) {
    const geometry = feature.getGeometry() as LineString | undefined
    if (!geometry) continue

    const pathPoints = geometry.getCoordinates()
    if (pathPoints.length === 0) continue

    const icao24 = feature.get("icao24")
    const planeFeature = planeSource
      .getFeatures()
      .find((f) => f.get("state")?.[0] === icao24)

    if (!planeFeature) continue

    const planeGeometry = planeFeature.getGeometry() as Point | undefined
    if (!planeGeometry) continue

    const curPoint = planeGeometry.getCoordinates()
    pathPoints[pathPoints.length - 1] = curPoint
    feature.setGeometry(new LineString([...pathPoints]))
  }
}
