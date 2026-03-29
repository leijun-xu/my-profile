"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 模拟数据
const stats = [
  {
    title: "总文件数",
    value: "128",
    change: "+12%",
    icon: "📁",
  },
  {
    title: "存储空间",
    value: "45.2 GB",
    change: "+8.5%",
    icon: "💾",
  },
  {
    title: "本月上传",
    value: "23",
    change: "+18%",
    icon: "📤",
  },
  {
    title: "简历浏览",
    value: "1,234",
    change: "+32%",
    icon: "👁️",
  },
];

const recentFiles = [
  {
    id: 1,
    name: "项目文档.pdf",
    size: "2.3 MB",
    uploadTime: "2 小时前",
    status: "success",
  },
  {
    id: 2,
    name: "会议记录.docx",
    size: "856 KB",
    uploadTime: "5 小时前",
    status: "success",
  },
  {
    id: 3,
    name: "设计稿.fig",
    size: "15.7 MB",
    uploadTime: "1 天前",
    status: "success",
  },
  {
    id: 4,
    name: "数据分析.xlsx",
    size: "3.2 MB",
    uploadTime: "2 天前",
    status: "success",
  },
];

const activities = [
  {
    id: 1,
    action: "上传了文件",
    target: "项目文档.pdf",
    time: "2 小时前",
  },
  {
    id: 2,
    action: "更新了简历",
    target: "工作经历",
    time: "5 小时前",
  },
  {
    id: 3,
    action: "删除了文件",
    target: "旧版本.pdf",
    time: "1 天前",
  },
  {
    id: 4,
    action: "修改了设置",
    target: "账户信息",
    time: "2 天前",
  },
];

// 简单的柱状图组件
function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end justify-between h-40 gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
            }}
          />
          <span className="text-xs text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// 简单的环形图组件
function SimpleDonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {segments.map((segment, index) => {
            const radius = 40;
            const circumference = 2 * Math.PI * radius;
            const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((segment.startAngle / 360) * circumference);

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">总数</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-sm text-gray-600">
              {segment.label}: {segment.value} ({segment.percentage.toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // 模拟图表数据
  const uploadData = [
    { label: "周一", value: 12 },
    { label: "周二", value: 19 },
    { label: "周三", value: 8 },
    { label: "周四", value: 15 },
    { label: "周五", value: 23 },
    { label: "周六", value: 18 },
    { label: "周日", value: 10 },
  ];

  const storageData = [
    { label: "文档", value: 45, color: "#3b82f6" },
    { label: "图片", value: 30, color: "#8b5cf6" },
    { label: "视频", value: 15, color: "#ec4899" },
    { label: "其他", value: 10, color: "#10b981" },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">欢迎回来！</h1>
        <p className="mt-1 text-gray-600">这是您的个人工作台</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">
                <span className="font-medium">{stat.change}</span> 较上月
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>本周上传趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={uploadData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>存储空间分布</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDonutChart data={storageData} />
          </CardContent>
        </Card>
      </div>

      {/* 最近文件和活动记录 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>最近上传</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.size} · {file.uploadTime}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-green-600">
                    成功
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>活动记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span>{" "}
                      <span className="text-gray-600">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
