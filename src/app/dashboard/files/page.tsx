"use client";

import dynamic from "next/dynamic";

// 动态导入文件管理组件
const FilesContent = dynamic(
  () => import("@/components/files/FilesContent"),
  {
    loading: () => <div className="p-8 text-center">加载中...</div>,
    ssr: false,
  }
);

export default function FilesDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">文件管理</h1>
        <p className="mt-1 text-gray-600">上传和管理您的文件</p>
      </div>
      <FilesContent />
    </div>
  );
}
