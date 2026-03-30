import WebGLTileLayer from "ol/layer/WebGLTile"
import XYZ from "ol/source/XYZ"

// tianditu apikey
const TIANDITU_API_KEY = "450889ddece2526646b443424f0e9bfd"

export function createBaseLayers() {
  const terUrl = `http://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_API_KEY}`
  const ctaUrl = `http://t0.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_API_KEY}`

  return [
    new WebGLTileLayer({
      source: new XYZ({ url: terUrl }),
    }),
    new WebGLTileLayer({
      source: new XYZ({ url: ctaUrl }),
    }),
  ]
}
