"use client"

import { Box } from "lucide-react"

// 技能数据
const skillsData = [
  { name: "React", level: 95, category: "frontend", color: "#61DAFB" },
  { name: "Next.js", level: 88, category: "frontend", color: "#F24E1E" },
  { name: "Shadcn", level: 90, category: "ui", color: "#F05032" },
  { name: "TypeScript", level: 90, category: "frontend", color: "#3178C6" },
  { name: "Node.js", level: 85, category: "backend", color: "#339933" },
  { name: "Vue", level: 80, category: "frontend", color: "#42B883" },
  { name: "Webpack", level: 75, category: "tools", color: "#8DD6F9" },
  { name: "MySql", level: 75, category: "database", color: "#F29E39" },
  { name: "Webgis", level: 60, category: "frontend", color: "#3498db" },
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
