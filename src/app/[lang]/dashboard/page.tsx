import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDictionary } from "@/dictionaries"

// 简单的柱状图组件
function SimpleBarChart({
  data,
}: {
  data: { label: string; value: number }[]
}) {
  const maxValue = Math.max(...data.map((d) => d.value))
  return (
    <div className="flex h-40 items-end justify-between gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t bg-linear-to-t from-blue-500 to-blue-400 transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="text-xs text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// 简单的环形图组件
function SimpleDonutChart({
  data,
  totalLabel,
}: {
  data: { label: string; value: number; color: string }[]
  totalLabel: string
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  // 用 reduce 携带累计角度，避免在 map 中修改外部变量（side effect）
  const { segments } = data.reduce<{
    segments: {
      label: string
      value: number
      color: string
      percentage: number
      startAngle: number
    }[]
    currentAngle: number
  }>(
    (acc, item, idx) => {
      const percentage = (item.value / total) * 100
      // 最后一段固定结束于 360°，消除浮点累积误差导致的细小缝隙
      const angle =
        idx === data.length - 1
          ? 360 - acc.currentAngle
          : (item.value / total) * 360
      acc.segments.push({ ...item, percentage, startAngle: acc.currentAngle })
      acc.currentAngle += angle
      return acc
    },
    { segments: [], currentAngle: 0 }
  )

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="-rotate-90 transform">
          {segments.map((segment, index) => {
            const radius = 40
            const circumference = 2 * Math.PI * radius
            const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -(
              (segment.startAngle / 360) *
              circumference
            )
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
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">{totalLabel}</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-sm text-gray-600">
              {segment.label}: {segment.value} ({segment.percentage.toFixed(0)}
              %)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const d = dict.dashboard
  const isZh = lang === "zh"

  const stats = [
    { title: d.filesTotal, value: "128", change: "+12%", icon: "📁" },
    { title: d.saveArea, value: "45.2 GB", change: "+8.5%", icon: "💾" },
    { title: d.thisMounthUpload, value: "23", change: "+18%", icon: "📤" },
    { title: d.resumeView, value: "1,234", change: "+32%", icon: "👁️" },
  ]

  const uploadData = isZh
    ? [
        { label: "周一", value: 12 },
        { label: "周二", value: 19 },
        { label: "周三", value: 8 },
        { label: "周四", value: 15 },
        { label: "周五", value: 23 },
        { label: "周六", value: 18 },
        { label: "周日", value: 10 },
      ]
    : [
        { label: "Mon", value: 12 },
        { label: "Tue", value: 19 },
        { label: "Wed", value: 8 },
        { label: "Thu", value: 15 },
        { label: "Fri", value: 23 },
        { label: "Sat", value: 18 },
        { label: "Sun", value: 10 },
      ]

  const storageData = isZh
    ? [
        { label: "文档", value: 45, color: "#3b82f6" },
        { label: "图片", value: 30, color: "#8b5cf6" },
        { label: "视频", value: 15, color: "#ec4899" },
        { label: "其他", value: 10, color: "#10b981" },
      ]
    : [
        { label: "Docs", value: 45, color: "#3b82f6" },
        { label: "Images", value: 30, color: "#8b5cf6" },
        { label: "Videos", value: 15, color: "#ec4899" },
        { label: "Others", value: 10, color: "#10b981" },
      ]

  const recentFiles = isZh
    ? [
        { id: 1, name: "项目文档.pdf", size: "2.3 MB", uploadTime: "2 小时前" },
        {
          id: 2,
          name: "会议记录.docx",
          size: "856 KB",
          uploadTime: "5 小时前",
        },
        { id: 3, name: "设计稿.fig", size: "15.7 MB", uploadTime: "1 天前" },
        { id: 4, name: "数据分析.xlsx", size: "3.2 MB", uploadTime: "2 天前" },
      ]
    : [
        {
          id: 1,
          name: "project-doc.pdf",
          size: "2.3 MB",
          uploadTime: "2 hours ago",
        },
        {
          id: 2,
          name: "meeting-notes.docx",
          size: "856 KB",
          uploadTime: "5 hours ago",
        },
        { id: 3, name: "design.fig", size: "15.7 MB", uploadTime: "1 day ago" },
        {
          id: 4,
          name: "data-analysis.xlsx",
          size: "3.2 MB",
          uploadTime: "2 days ago",
        },
      ]

  const activities = isZh
    ? [
        {
          id: 1,
          action: "上传了文件",
          target: "项目文档.pdf",
          time: "2 小时前",
        },
        { id: 2, action: "更新了简历", target: "工作经历", time: "5 小时前" },
        { id: 3, action: "删除了文件", target: "旧版本.pdf", time: "1 天前" },
        { id: 4, action: "修改了设置", target: "账户信息", time: "2 天前" },
      ]
    : [
        {
          id: 1,
          action: "Uploaded",
          target: "project-doc.pdf",
          time: "2 hours ago",
        },
        {
          id: 2,
          action: "Updated resume",
          target: "Work Experience",
          time: "5 hours ago",
        },
        {
          id: 3,
          action: "Deleted file",
          target: "old-version.pdf",
          time: "1 day ago",
        },
        {
          id: 4,
          action: "Changed setting",
          target: "Account Info",
          time: "2 days ago",
        },
      ]

  const labels = isZh
    ? {
        welcome: "欢迎回来！",
        subtitle: "这是您的个人工作台",
        weekTrend: "本周上传趋势",
        storageDist: "存储空间分布",
        recentUploads: "最近上传",
        activityLog: "活动记录",
        total: "总数",
        success: "成功",
        vsLastMonth: "较上月",
      }
    : {
        welcome: "Welcome back!",
        subtitle: "Your personal workspace",
        weekTrend: "Weekly Upload Trend",
        storageDist: "Storage Distribution",
        recentUploads: "Recent Uploads",
        activityLog: "Activity Log",
        total: "Total",
        success: "Success",
        vsLastMonth: "vs last month",
      }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{labels.welcome}</h1>
        <p className="mt-1 text-gray-600">{labels.subtitle}</p>
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
              <p className="mt-1 text-xs text-green-600">
                <span className="font-medium">{stat.change}</span>{" "}
                {labels.vsLastMonth}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{labels.weekTrend}</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={uploadData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labels.storageDist}</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDonutChart data={storageData} totalLabel={labels.total} />
          </CardContent>
        </Card>
      </div>

      {/* 最近文件和活动记录 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{labels.recentUploads}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
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
                    {labels.success}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{labels.activityLog}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                >
                  <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span>{" "}
                      <span className="text-gray-600">{activity.target}</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
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
  )
}
