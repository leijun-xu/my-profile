import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import fetchFun from "@/lib/fetch"

interface ServerFile {
  id: string
  fileName: string
  fileSize: number
  uploadTime: string
}

interface ServerFilesListProps {
  serverFiles: ServerFile[]
  isLoadingFiles: boolean
  onRefresh: () => void
  onDelete: (id: string) => void
}

interface ServerFileItemProps {
  file: ServerFile
  onDelete: (id: string) => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

function ServerFileItem({ file, onDelete }: ServerFileItemProps) {
  const [isDownload, setIsDownload] = useState(false)

  // 下载文件
  const downloadFile = async (id: string) => {
    setIsDownload(true)
    const blob = await fetchFun("/api/file/" + id, { responseType: "blob" })
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = id
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
    setIsDownload(false)
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-500 text-sm text-white">
                📄
              </div>
              <span className="flex-1 truncate text-sm font-medium">
                {file.fileName}
              </span>
            </div>
            <div className="ml-10 flex items-center gap-3 text-xs text-gray-500">
              <Badge variant="secondary">{formatFileSize(file.fileSize)}</Badge>
              <span>{new Date(file.uploadTime).toLocaleString("zh-CN")}</span>
            </div>
          </div>
          <div className="ml-4 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isDownload}
              onClick={() => downloadFile(file.fileName)}
            >
              {isDownload ? "下载中..." : "下载"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(file.fileName)}
            >
              删除
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ServerFilesList({
  serverFiles,
  isLoadingFiles,
  onRefresh,
  onDelete,
}: ServerFilesListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">服务器文件</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={isLoadingFiles}
        >
          {isLoadingFiles ? "加载中..." : "刷新"}
        </Button>
      </div>
      {serverFiles.length === 0 ? (
        <div className="py-8 text-center text-gray-500">暂无文件</div>
      ) : (
        <div className="space-y-3">
          {serverFiles.map((file) => (
            <ServerFileItem
              key={file.fileName}
              file={file}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
