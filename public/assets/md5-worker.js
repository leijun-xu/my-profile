// MD5 计算的 Web Worker
importScripts("https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js")

self.onmessage = function(e) {
  const { fileId, file, chunkSize = 2 * 1024 * 1024 } = e.data

  // 检查 SparkMD5 是否已加载
  if (typeof SparkMD5 === 'undefined') {
    self.postMessage({
      type: "error",
      fileId,
      error: "SparkMD5 library failed to load"
    })
    return
  }

  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()
  const chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0

  const loadNext = () => {
    const start = currentChunk * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    fileReader.readAsArrayBuffer(file.slice(start, end))
  }

  fileReader.onload = (e) => {
    if (e.target && e.target.result) {
      spark.append(e.target.result)
      currentChunk++

      // 发送进度更新
      self.postMessage({
        type: "progress",
        fileId,
        progress: (currentChunk / chunks) * 100
      })

      if (currentChunk < chunks) {
        loadNext()
      } else {
        // 计算完成
        self.postMessage({
          type: "complete",
          fileId,
          md5: spark.end()
        })
      }
    }
  }

  fileReader.onerror = (error) => {
    self.postMessage({
      type: "error",
      fileId,
      error: error.toString()
    })
  }

  loadNext()
}
