"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { signOut, useSession } from "next-auth/react"
import {
  Home,
  FileText,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import DevIcons from "@/components/devtool/devtoolIcon"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "看板", href: "/dashboard", icon: Home },
  { name: "简历", href: "/dashboard/resume", icon: FileText },
  { name: "文件管理", href: "/dashboard/files", icon: FolderOpen },
  { name: "设置", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
            <h1 className="text-xl font-bold text-gray-800">我的工作台</h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* 用户信息 */}
          <div className="border-t p-4">
            <div className="mb-4 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white">
                  {session?.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {session?.user?.name || "未登录"}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {session?.user?.email || ""}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </Button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 md:flex">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-sm text-white">
                  {session?.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user?.name || "未登录"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* 内容区 */}
        <main className="flex flex-1 flex-col overflow-auto bg-gray-50 p-4 lg:p-6">
          <div className="flex-1">{children}</div>

          {/* 底部文字 */}
          <div className="flex flex-col items-center justify-center gap-1 p-8 text-center text-sm text-gray-500 md:h-3 md:flex-row">
            <p>© 2026 developed by Xuleijun, use</p>
            <DevIcons />
          </div>
        </main>
      </div>
    </div>
  )
}
