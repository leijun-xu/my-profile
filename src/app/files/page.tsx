"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

interface UploadFile {
  id: string;
  file: File;
  md5: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed" | "paused";
  uploadedChunks: Set<number>;
  error?: string;
  speed?: string;
}

export default function FilesPage() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 计算文件MD5
  const calculateMD5 = async (file: File): Promise<string> => {
    const spark = new (await import("spark-md5")).default();
    const fileReader = new FileReader();
    const chunkSize = 2 * 1024 * 1024; // 2MB chunks
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    return new Promise((resolve, reject) => {
      fileReader.onload = (e) => {
        spark.append(e.target?.result as ArrayBuffer);
        currentChunk++;

        if (currentChunk < chunks) {
          loadNext();
        } else {
          resolve(spark.end());
        }
      };

      fileReader.onerror = reject;

      const loadNext = () => {
        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        fileReader.readAsArrayBuffer(file.slice(start, end));
      };

      loadNext();
    });
  };

  // 检查文件是否存在（秒传）
  const checkFileExists = async (md5: string, fileName: string, fileSize: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/file/verify?md5=${md5}&fileName=${encodeURIComponent(fileName)}&fileSize=${fileSize}`);
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error("Failed to check file existence:", error);
      return false;
    }
  };

  // 检查分片上传状态（断点续传）
  const checkChunkStatus = async (fileId: string): Promise<number[]> => {
    try {
      const response = await fetch(`/api/file/check?fileId=${fileId}`);
      const data = await response.json();
      return data.uploadedChunks || [];
    } catch (error) {
      console.error("Failed to check chunk status:", error);
      return [];
    }
  };

  // 上传分片
  const uploadChunk = async (
    file: File,
    chunkIndex: number,
    totalChunks: number,
    fileId: string,
    fileName: string,
    fileSize: number,
    onProgress: (progress: number, speed: string) => void
  ): Promise<void> => {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("totalChunks", totalChunks.toString());
    formData.append("fileId", fileId);
    formData.append("fileName", fileName);
    formData.append("fileSize", fileSize.toString());

    const startTime = Date.now();
    const response = await fetch("/api/file/upload", {
      method: "POST",
      body: formData,
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    const speed = ((chunk.size / 1024 / 1024) / duration).toFixed(2);
    onProgress((chunkIndex + 1) / totalChunks * 100, `${speed} MB/s`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }
  };

  // 合并分片
  const mergeChunks = async (fileId: string): Promise<void> => {
    const response = await fetch("/api/file/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Merge failed");
    }
  };

  // 取消上传
  const cancelUpload = async (fileId: string): Promise<void> => {
    try {
      await fetch(`/api/file/cancel?fileId=${fileId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to cancel upload:", error);
    }
  };

  // 开始上传文件
  const startUpload = async (uploadFile: UploadFile): Promise<void> => {
    setUploadFiles(prev =>
      prev.map(f =>
        f.id === uploadFile.id ? { ...f, status: "uploading" } : f
      )
    );

    const { file, md5, id: fileId } = uploadFile;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileName = file.name;
    const fileSize = file.size;

    try {
      // 检查是否支持秒传
      const exists = await checkFileExists(md5, fileName, fileSize);
      if (exists) {
        setUploadFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, status: "completed", progress: 100 }
              : f
          )
        );
        return;
      }

      // 检查断点续传
      const uploadedChunks = await checkChunkStatus(fileId);
      const uploadedChunkSet = new Set(uploadedChunks);
      const remainingChunks = Array.from(
        { length: totalChunks },
        (_, i) => i
      ).filter(i => !uploadedChunkSet.has(i));

      setUploadFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? {
                ...f,
                uploadedChunks: uploadedChunkSet,
                progress: (uploadedChunkSet.size / totalChunks) * 100,
              }
            : f
        )
      );

      // 上传剩余的分片
      for (let i = 0; i < totalChunks; i++) {
        if (uploadedChunkSet.has(i)) continue;

        setUploadFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, status: "uploading" }
              : f
          )
        );

        await uploadChunk(
          file,
          i,
          totalChunks,
          fileId,
          fileName,
          fileSize,
          (progress, speed) => {
            setUploadFiles(prev =>
              prev.map(f =>
                f.id === uploadFile.id
                  ? {
                      ...f,
                      progress: (uploadedChunkSet.size / totalChunks) * 100 +
                        progress * ((totalChunks - uploadedChunkSet.size) / totalChunks),
                      speed,
                    }
                  : f
              )
            );
          }
        );

        uploadedChunkSet.add(i);
        setUploadFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, uploadedChunks: uploadedChunkSet }
              : f
          )
        );
      }

      // 合并分片
      await mergeChunks(fileId);

      setUploadFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, status: "completed", progress: 100 }
            : f
        )
      );
    } catch (error) {
      console.error("Upload error:", error);
      setUploadFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: "failed",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
    }
  };

  // 处理文件选择
  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = crypto.randomUUID();
      const md5 = await calculateMD5(file);

      const newUploadFile: UploadFile = {
        id: fileId,
        file,
        md5,
        progress: 0,
        status: "pending",
        uploadedChunks: new Set(),
      };

      setUploadFiles(prev => [...prev, newUploadFile]);
    }
  };

  // 拖放处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // 删除文件
  const removeFile = async (id: string) => {
    const file = uploadFiles.find(f => f.id === id);
    if (file && (file.status === "uploading" || file.status === "paused")) {
      await cancelUpload(id);
    }
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  // 重试上传
  const retryUpload = (id: string) => {
    const file = uploadFiles.find(f => f.id === id);
    if (file) {
      setUploadFiles(prev =>
        prev.map(f =>
          f.id === id
            ? { ...f, status: "pending", error: undefined }
            : f
        )
      );
      startUpload(file);
    }
  };

  // 暂停上传
  const pauseUpload = (id: string) => {
    setUploadFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, status: "paused" } : f))
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>文件上传管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 拖放区域 */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
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
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl">📁</div>
              <div>
                <p className="text-lg font-medium">拖放文件到这里</p>
                <p className="text-sm text-gray-500">或者</p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                选择文件
              </Button>
              <p className="text-xs text-gray-400">
                支持大文件上传，自动分片，断点续传
              </p>
            </div>
          </div>

          {/* 文件列表 */}
          {uploadFiles.length > 0 && (
            <div className="space-y-4">
              {uploadFiles.map((uploadFile) => (
                <Card key={uploadFile.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {uploadFile.file.name}
                            </span>
                            <Badge variant="outline">
                              {formatFileSize(uploadFile.file.size)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
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
                                ? "已完成"
                                : uploadFile.status === "failed"
                                ? "失败"
                                : uploadFile.status === "uploading"
                                ? "上传中"
                                : uploadFile.status === "paused"
                                ? "已暂停"
                                : "等待中"}
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
                              onClick={() => startUpload(uploadFile)}
                            >
                              开始
                            </Button>
                          )}
                          {uploadFile.status === "uploading" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => pauseUpload(uploadFile.id)}
                            >
                              暂停
                            </Button>
                          )}
                          {uploadFile.status === "paused" && (
                            <Button
                              size="sm"
                              onClick={() => startUpload(uploadFile)}
                            >
                              继续
                            </Button>
                          )}
                          {uploadFile.status === "failed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => retryUpload(uploadFile.id)}
                            >
                              重试
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(uploadFile.id)}
                          >
                            删除
                          </Button>
                        </div>
                      </div>

                      {/* 进度条 */}
                      <div className="space-y-1">
                        <Progress value={uploadFile.progress} />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {Math.round(uploadFile.progress)}%
                          </span>
                          <span>
                            {uploadFile.uploadedChunks.size} /{" "}
                            {Math.ceil(uploadFile.file.size / CHUNK_SIZE)} 分片
                          </span>
                        </div>
                      </div>

                      {/* 错误信息 */}
                      {uploadFile.error && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {uploadFile.error}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
