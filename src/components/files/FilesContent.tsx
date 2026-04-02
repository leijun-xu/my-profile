"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import fetchFun from "@/lib/fetch"
import ServerFilesList from "./serverFilesList"
import { Dictionary } from "@/dictionaries"

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB per chunk
const MD5_WORKER_THRESHOLD = 10 * 1024 * 1024 // 10MB以上使用Worker计算MD5

export interface UploadFile {
  id: string
  file: File
  md5?: string
  md5Progress: number
  progress: number
  status: "pending" | "uploading" | "completed" | "failed" | "paused"
  uploadedChunks: Set<number>
  error?: string
  speed?: string
}

export interface ServerFile {
  id: string
  fileName: string
  fileSize: number
  uploadTime: string
}

export default function FilesContent({ dict }: { dict: Dictionary }) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pausedUploadIdsRef = useRef<Set<string>>(new Set())
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())
  const [serverFiles, setServerFiles] = useState<ServerFile[]>([])
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const workersRef = useRef<Map<string, Worker>>(new Map())

  // 计算文件MD5 - 使用Worker优化大文件
  const calculateMD5 = async (
    file: File,
    fileId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    // 小文件直接在主线程计算
    if (file.size < MD5_WORKER_THRESHOLD) {
      const spark = new (await import("spark-md5")).default()
      const fileReader = new FileReader()
      const chunkSize = 2 * 1024 * 1024 // 2MB chunks
      const chunks = Math.ceil(file.size / chunkSize)
      let currentChunk = 0

      return new Promise((resolve, reject) => {
        fileReader.onload = (e) => {
          spark.append(e.target?.result as ArrayBuffer)
          currentChunk++

          if (onProgress) {
            onProgress((currentChunk / chunks) * 100)
          }

          if (currentChunk < chunks) {
            loadNext()
          } else {
            resolve(spark.end())
          }
        }

        fileReader.onerror = reject

        const loadNext = () => {
          const start = currentChunk * chunkSize
          const end = Math.min(start + chunkSize, file.size)
          fileReader.readAsArrayBuffer(file.slice(start, end))
        }

        loadNext()
      })
    }

    // 大文件使用Worker计算
    return new Promise((resolve, reject) => {
      try {
        const worker = new Worker("/assets/md5-worker.js")
        workersRef.current.set(fileId, worker)

        worker.onmessage = (e) => {
          const { type, fileId: returnedFileId, md5, progress, error } = e.data

          if (type === "progress" && returnedFileId === fileId) {
            onProgress?.(progress)
          } else if (type === "complete" && returnedFileId === fileId) {
            worker.terminate()
            workersRef.current.delete(fileId)
            resolve(md5)
          } else if (type === "error" && returnedFileId === fileId) {
            worker.terminate()
            workersRef.current.delete(fileId)
            reject(new Error(error))
          }
        }

        worker.onerror = (error) => {
          worker.terminate()
          workersRef.current.delete(fileId)
          reject(error)
        }

        worker.postMessage({
          fileId,
          file,
          chunkSize: 2 * 1024 * 1024, // 2MB chunks
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  // 检查文件是否存在（秒传）
  const checkFileExists = async (
    md5: string,
    fileName: string,
    fileSize: number
  ): Promise<boolean> => {
    try {
      const { data } = await fetchFun(
        `/api/file/verify?md5=${md5}&fileName=${encodeURIComponent(fileName)}&fileSize=${fileSize}`
      )
      return data.exists || false
    } catch (error) {
      console.error("Failed to check file existence:", error)
      return false
    }
  }

  // 检查分片上传状态（断点续传）
  const checkChunkStatus = async (fileId: string): Promise<number[]> => {
    try {
      const { data } = await fetchFun(`/api/file/check?fileId=${fileId}`)
      return data.uploadedChunks || []
    } catch (error) {
      console.error("Failed to check chunk status:", error)
      return []
    }
  }

  // 上传分片
  const uploadChunk = async (
    file: File,
    chunkIndex: number,
    totalChunks: number,
    fileId: string,
    fileName: string,
    fileSize: number,
    onProgress: (progress: number, speed: string) => void,
    signal?: AbortSignal
  ): Promise<void> => {
    const start = chunkIndex * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append("file", chunk)
    formData.append("chunkIndex", chunkIndex.toString())
    formData.append("totalChunks", totalChunks.toString())
    formData.append("fileId", fileId)
    formData.append("fileName", fileName)
    formData.append("fileSize", fileSize.toString())

    const startTime = Date.now()

    // 检查是否被取消
    if (signal?.aborted) {
      throw new Error("Upload cancelled")
    }

    const response = await fetchFun("/api/file/upload", {
      method: "POST",
      body: formData,
      signal,
    })

    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    const speed = (chunk.size / 1024 / 1024 / duration).toFixed(2)
    onProgress(((chunkIndex + 1) / totalChunks) * 100, `${speed} MB/s`)

    if (response.error) {
      throw new Error(response.error || "Upload failed")
    }
  }

  // 取消上传 删除服务器的chunk 文件
  const cancelUpload = async (fileId: string): Promise<void> => {
    try {
      const data = await fetchFun(`/api/file/cancel?fileId=${fileId}`, {
        method: "DELETE",
      })
      if (data.error) {
        throw new Error(data.error || "Cancel failed")
      }
    } catch (error) {
      console.error("Failed to cancel upload:", error)
    }
  }

  // 获取服务器文件列表
  const fetchServerFiles = async () => {
    setIsLoadingFiles(true)
    try {
      const data = await fetchFun("/api/file/list")
      if (!data.error) {
        setServerFiles(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch files:", error)
    } finally {
      setIsLoadingFiles(false)
    }
  }

  // 删除文件
  const deleteFile = async (id: string) => {
    if (!confirm(dict.file.deleteConfirmText)) return

    const data = await fetchFun(`/api/file/${id}`, {
      method: "DELETE",
    })
    if (!data.error) {
      fetchServerFiles()
    }
  }

  // 页面加载时获取文件列表
  useEffect(() => {
    fetchServerFiles()
  }, [])

  // 清理Worker和AbortController
  useEffect(() => {
    const workers = workersRef.current
    const abortControllers = abortControllersRef.current
    return () => {
      workers.forEach((worker) => worker.terminate())
      workers.clear()
      abortControllers.forEach((controller) => controller.abort())
      abortControllers.clear()
    }
  }, [])

  // 开始上传文件
  const startUpload = async (uploadFile: UploadFile): Promise<void> => {
    // 如果MD5还没计算完，等待MD5计算完成
    if (!uploadFile.md5) {
      return
    }

    // 清除暂停标记
    pausedUploadIdsRef.current.delete(uploadFile.id)
    // 创建新的 AbortController
    const abortController = new AbortController()
    abortControllersRef.current.set(uploadFile.id, abortController)

    setUploadFiles((prev) =>
      prev.map((f) =>
        f.id === uploadFile.id ? { ...f, status: "uploading" } : f
      )
    )

    const { file, md5, id: fileId } = uploadFile
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    const fileName = file.name
    const fileSize = file.size

    try {
      // 检查是否支持秒传
      const exists = await checkFileExists(md5, fileName, fileSize)
      if (exists) {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "completed", progress: 100 }
              : f
          )
        )
        return
      }

      // 检查断点续传
      const uploadedChunks = await checkChunkStatus(fileId)
      const uploadedChunkSet = new Set(uploadedChunks)

      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                uploadedChunks: uploadedChunkSet,
              }
            : f
        )
      )

      // 上传剩余的分片
      for (let i = 0; i < totalChunks; i++) {
        // 检查暂停状态
        if (pausedUploadIdsRef.current.has(uploadFile.id)) {
          // 暂停时设置为 paused 状态
          setUploadFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id ? { ...f, status: "paused" } : f
            )
          )
          return
        }
        if (uploadedChunkSet.has(i)) continue

        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "uploading" } : f
          )
        )

        const abortController = abortControllersRef.current.get(uploadFile.id)
        await uploadChunk(
          file,
          i,
          totalChunks,
          fileId,
          fileName,
          fileSize,
          (progress, speed) => {
            setUploadFiles((prev) =>
              prev.map((f) =>
                f.id === uploadFile.id
                  ? {
                      ...f,
                      progress:
                        (uploadedChunkSet.size / totalChunks) * 100 +
                        progress *
                          ((totalChunks - uploadedChunkSet.size) / totalChunks),
                      speed,
                    }
                  : f
              )
            )
          },
          abortController?.signal
        )

        uploadedChunkSet.add(i)
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, uploadedChunks: uploadedChunkSet }
              : f
          )
        )
      }

      // 合并分片 后端处理了
      const res = await fetchFun("/api/file/merge", {
        method: "POST",
        body: JSON.stringify({ fileId }),
      })
      if (!res.error) {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "completed", progress: 100 }
              : f
          )
        )

        // 上传完成后刷新文件列表
        fetchServerFiles().then(() => {
          setUploadFiles((prev) => prev.filter((f) => f.id !== uploadFile.id))
        })
      }
    } catch (error) {
      console.error("Upload error:", error)

      // 检查是否是用户主动暂停
      const isPaused = pausedUploadIdsRef.current.has(uploadFile.id)

      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: isPaused ? "paused" : "failed",
                error: isPaused
                  ? undefined
                  : error instanceof Error
                    ? error.message
                    : "Upload failed",
              }
            : f
        )
      )
    }
  }

  // 处理文件选择 - 单文件上传
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    // 只取第一个文件
    const file = files[0]
    const fileId = crypto.randomUUID()

    // 先添加文件到列表，状态为pending
    const newUploadFile: UploadFile = {
      id: fileId,
      file,
      progress: 0,
      md5Progress: 0,
      status: "pending",
      uploadedChunks: new Set(),
    }

    setUploadFiles((prev) => [...prev, newUploadFile])

    // 异步计算MD5
    try {
      const md5 = await calculateMD5(file, fileId, (progress) => {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, md5Progress: progress } : f
          )
        )
      })

      // MD5计算完成，更新文件信息并开始上传
      setUploadFiles((prev) => {
        const updatedFiles = prev.map((f) =>
          f.id === fileId ? { ...f, md5, md5Progress: 100 } : f
        )

        // 从更新后的列表中获取文件对象并开始上传
        const uploadFile = updatedFiles.find((f) => f.id === fileId)
        if (uploadFile && uploadFile.md5) {
          // 使用 setTimeout 确保 state 更新后再开始上传
          setTimeout(() => startUpload(uploadFile), 0)
        }

        return updatedFiles
      })
    } catch (error) {
      console.error("Failed to calculate MD5:", error)
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "failed",
                error:
                  error instanceof Error ? error.message : dict.file.computeMd5,
              }
            : f
        )
      )
    }
  }

  // 拖放处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  // 取消文件，会删除远程的chunk文件
  const cancelFile = async (fid: string) => {
    const file = uploadFiles.find((f) => f.id === fid)
    if (!file) return
    if (file.status === "uploading" || file.status === "paused") {
      await cancelUpload(file.id)
    }
    setUploadFiles((prev) => prev.filter((f) => f.id !== fid))
  }

  // 重试上传
  const retryUpload = (id: string) => {
    const file = uploadFiles.find((f) => f.id === id)
    if (file) {
      pausedUploadIdsRef.current.delete(id) // 清除暂停标记
      startUpload(file)
    }
  }

  // 暂停上传
  const pauseUpload = (id: string) => {
    pausedUploadIdsRef.current.add(id)
    // 取消当前正在上传的请求
    abortControllersRef.current.get(id)?.abort()
    setUploadFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "paused" } : f))
    )
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.file.contentTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 拖放区域 */}
        <div
          className={`rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">📁</div>
            <div>
              <p className="text-lg font-medium">{dict.file.contentDragText}</p>
              <p className="text-sm text-gray-500">{dict.file.contentOr}</p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              {dict.file.contentSelectBtn}
            </Button>
            <p className="text-xs text-gray-400">
              {dict.file.contentSelectDesc}
            </p>
          </div>
        </div>

        {/* 文件列表 - 单文件上传，只显示最后一个 */}
        {uploadFiles.length > 0 && (
          <div className="space-y-4">
            {uploadFiles.slice(-1).map((uploadFile) => (
              <Card key={uploadFile.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {uploadFile.file.name}
                          </span>
                          <Badge variant="outline">
                            {formatFileSize(uploadFile.file.size)}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            variant={
                              uploadFile.status === "completed"
                                ? "default"
                                : uploadFile.status === "failed"
                                  ? "destructive"
                                  : uploadFile.status === "uploading"
                                    ? "default"
                                    : "secondary"
                            }
                          >
                            {uploadFile.status === "completed"
                              ? dict.file.uploadFileStatusComplete
                              : uploadFile.status === "failed"
                                ? dict.file.uploadFileStatusFailed
                                : uploadFile.status === "uploading"
                                  ? dict.file.uploadFileStatusUploading
                                  : uploadFile.status === "paused"
                                    ? dict.file.uploadFileStatusPaused
                                    : dict.file.uploadFileStatusWaiting}
                          </Badge>
                          {uploadFile.speed && (
                            <span className="text-xs text-gray-500">
                              {uploadFile.speed}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {uploadFile.status === "pending" && (
                          <Button
                            size="sm"
                            className={
                              uploadFile.md5
                                ? "cursor-pointer"
                                : "cursor-not-allowed"
                            }
                            disabled={!uploadFile.md5}
                            onClick={() => startUpload(uploadFile)}
                          >
                            {dict.file.uploadBtnStart}
                          </Button>
                        )}
                        {uploadFile.status === "uploading" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => pauseUpload(uploadFile.id)}
                          >
                            {dict.file.uploadBtnPause}
                          </Button>
                        )}
                        {uploadFile.status === "paused" && (
                          <Button
                            size="sm"
                            onClick={() => startUpload(uploadFile)}
                          >
                            {dict.file.uploadBtnContinue}
                          </Button>
                        )}
                        {uploadFile.status === "failed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => retryUpload(uploadFile.id)}
                          >
                            {dict.file.uploadBtnRetry}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelFile(uploadFile.id)}
                        >
                          {dict.file.uploadBtnCancel}
                        </Button>
                      </div>
                    </div>

                    {/* 进度条 */}
                    <div className="space-y-1">
                      <Progress value={uploadFile.progress} />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          {uploadFile.md5
                            ? `${Math.round(uploadFile.progress)}%`
                            : `${dict.file.computeMd5} ${Math.round(uploadFile.md5Progress)}%`}
                        </span>
                        <span>
                          {uploadFile.uploadedChunks.size} /{" "}
                          {Math.ceil(uploadFile.file.size / CHUNK_SIZE)}
                          {dict.file.slice}
                        </span>
                      </div>
                    </div>

                    {/* 错误信息 */}
                    {uploadFile.error && (
                      <div className="rounded bg-red-50 p-2 text-sm text-red-600">
                        {uploadFile.error}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 服务器文件列表 */}
        <ServerFilesList
          dict={dict}
          serverFiles={serverFiles}
          isLoadingFiles={isLoadingFiles}
          onRefresh={fetchServerFiles}
          onDelete={deleteFile}
        />
      </CardContent>
    </Card>
  )
}
