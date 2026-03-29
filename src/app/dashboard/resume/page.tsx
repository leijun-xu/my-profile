"use client";

import dynamic from "next/dynamic";

// 动态导入简历组件，避免服务端渲染问题
const ResumeContent = dynamic(
  () => import("@/components/resume/ResumeContent"),
  {
    loading: () => <div className="p-8 text-center">加载中...</div>,
    ssr: false,
  }
);

export default function ResumeDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">我的简历</h1>
        <p className="mt-1 text-gray-600">查看和管理您的个人信息</p>
      </div>
      <ResumeContent />
    </div>
  );
}
