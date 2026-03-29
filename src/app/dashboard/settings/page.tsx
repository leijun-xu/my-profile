"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">设置</h1>
        <p className="mt-1 text-gray-600">管理您的账户和偏好设置</p>
      </div>

      {/* 个人信息 */}
      <Card>
        <CardHeader>
          <CardTitle>个人信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <Input
              type="text"
              defaultValue={session?.user?.name || ""}
              placeholder="请输入用户名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <Input
              type="email"
              defaultValue={session?.user?.email || ""}
              placeholder="请输入邮箱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              简介
            </label>
            <Input
              type="text"
              placeholder="请输入个人简介"
            />
          </div>
          <Button>保存更改</Button>
        </CardContent>
      </Card>

      {/* 账户安全 */}
      <Card>
        <CardHeader>
          <CardTitle>账户安全</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">修改密码</p>
              <p className="text-xs text-gray-500">定期修改密码以保护账户安全</p>
            </div>
            <Button variant="outline" size="sm">
              修改密码
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">两步验证</p>
              <p className="text-xs text-gray-500">为账户添加额外的安全层</p>
            </div>
            <Badge variant="secondary">未启用</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">登录设备</p>
              <p className="text-xs text-gray-500">管理已登录的设备</p>
            </div>
            <Button variant="outline" size="sm">
              查看设备
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 通知设置 */}
      <Card>
        <CardHeader>
          <CardTitle>通知设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">邮件通知</p>
              <p className="text-xs text-gray-500">接收重要活动的邮件提醒</p>
            </div>
            <Badge variant="default">已启用</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">推送通知</p>
              <p className="text-xs text-gray-500">在浏览器中接收实时通知</p>
            </div>
            <Badge variant="secondary">未启用</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 危险操作 */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">危险区域</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">删除账户</p>
              <p className="text-xs text-gray-500">永久删除账户和所有相关数据</p>
            </div>
            <Button variant="destructive" size="sm">
              删除账户
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
