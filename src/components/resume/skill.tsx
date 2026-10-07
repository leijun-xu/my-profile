"use client"

import { Box } from "lucide-react"

// 技能数据
const skillsData = [
  // 前端
  { name: "React", level: 95, category: "frontend", color: "#61DAFB" },
  { name: "Next.js", level: 88, category: "frontend", color: "#F24E1E" },
  { name: "Vue3", level: 95, category: "frontend", color: "#42B883" },
  { name: "TypeScript", level: 90, category: "frontend", color: "#3178C6" },
  { name: "Vite", level: 85, category: "frontend", color: "#646CFF" },
  // 后端
  { name: "NestJS", level: 88, category: "backend", color: "#E0234E" },
  { name: "BullMQ", level: 78, category: "backend", color: "#E6484F" },
  { name: "Socket.io", level: 76, category: "backend", color: "#5C5C5C" },
  { name: "MinIO", level: 72, category: "backend", color: "#C72E49" },
  // 数据库
  { name: "Prisma", level: 85, category: "database", color: "#5A67D8" },
  { name: "PostgreSQL", level: 82, category: "database", color: "#336791" },
  { name: "Redis", level: 76, category: "database", color: "#DC382D" },
  // AI
  {
    name: "LangChain.js/LangGraph.js",
    level: 74,
    category: "ai",
    color: "#4CAF50",
  },
  // 工程化
  { name: "pnpm", level: 85, category: "tools", color: "#F69220" },
]
export default function SkillsDemo() {
  return (
    <div>
      {/* 主内容 */}
      <div className="relative container mx-auto px-4 py-16">
        {/* 技能列表卡片 */}
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-pink-500 to-blue-600 opacity-30 blur transition duration-300 group-hover:opacity-50"></div>
          <div className="relative rounded-2xl border border-gray-800 bg-gray-900/90 p-6 backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
              <Box className="h-6 w-6 text-pink-400" />
              Skill list
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {skillsData.map((skill, index) => (
                <div key={index} className="group/item">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium text-gray-300">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: skill.color }}
                      ></span>
                      {skill.name}
                    </span>
                    <span className="font-bold text-purple-400">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full origin-left rounded-full transition-all duration-500 group-hover/item:scale-x-105"
                      style={{
                        width: `${skill.level}%`,
                        background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
