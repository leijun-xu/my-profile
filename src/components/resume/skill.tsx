'use client';

import { Box } from 'lucide-react';

// 技能数据
const skillsData = [
    { name: 'React', level: 95, category: 'frontend', color: '#61DAFB' },
    { name: 'Next.js', level: 88, category: 'frontend', color: '#F24E1E' },
    { name: 'Shadcn', level: 90, category: 'ui', color: '#F05032' },
    { name: 'TypeScript', level: 90, category: 'frontend', color: '#3178C6' },
    { name: 'Node.js', level: 75, category: 'backend', color: '#339933' },
    { name: 'Vue', level: 80, category: 'frontend', color: '#42B883' },
    { name: 'Webpack', level: 75, category: 'tools', color: '#8DD6F9' },
];

export default function SkillsDemo() {
    return (
        <div >

            {/* 主内容 */}
            <div className="relative container mx-auto px-4 py-16">

                {/* 技能列表卡片 */}
                <div className="group relative ">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                    <div className="relative bg-gray-900/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-800">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Box className="w-6 h-6 text-pink-400" />
                            Skill list
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {skillsData.map((skill, index) => (
                                <div key={index} className="group/item">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300 font-medium flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.color }}></span>
                                            {skill.name}
                                        </span>
                                        <span className="text-purple-400 font-bold">{skill.level}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500 group-hover/item:scale-x-105 origin-left"
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
    );
}