"use client"
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line } from 'recharts'

const performanceTrend = [
  { month: 'Jan', avg: 68, high: 92, low: 42 },
  { month: 'Feb', avg: 72, high: 95, low: 45 },
  { month: 'Mar', avg: 71, high: 90, low: 48 },
  { month: 'Apr', avg: 76, high: 94, low: 52 },
  { month: 'May', avg: 79, high: 98, low: 55 },
  { month: 'Jun', avg: 82, high: 96, low: 58 },
]

const topicWeakness = [
  { topic: 'React', score: 82 },
  { topic: 'Node.js', score: 68 },
  { topic: 'System Design', score: 55 },
  { topic: 'Testing', score: 48 },
  { topic: 'DevOps', score: 42 },
  { topic: 'Databases', score: 65 },
]

const modelAccuracy = [
  { name: 'Correct', value: 92 },
  { name: 'Incorrect', value: 8 },
]

const roleDistribution = [
  { name: 'Frontend', value: 35 },
  { name: 'Backend', value: 28 },
  { name: 'Full Stack', value: 22 },
  { name: 'DevOps', value: 15 },
]

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981']

export default function AnalyticsClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-white/30 text-sm mt-1">Comprehensive interview analytics and insights</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Interviews', value: '324', sub: 'All time' },
          { label: 'Avg Duration', value: '14.5m', sub: 'Per interview' },
          { label: 'Pass Rate', value: '72%', sub: '+5% this month' },
          { label: 'Model Accuracy', value: '92%', sub: 'Current version' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <p className="text-[11px] text-white/25 mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-[11px] text-white/20 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance trends */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Performance Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Line type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
              <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Topic-wise weakness */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Topic-Wise Average</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={topicWeakness}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="topic" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <Radar dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Model accuracy pie */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Model Accuracy</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={modelAccuracy} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" strokeWidth={0}>
                  {modelAccuracy.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#10b981' : 'rgba(255,255,255,0.06)'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-white/30 text-sm mt-2">92% prediction accuracy</p>
        </div>

        {/* Role distribution */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Role Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={roleDistribution} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} width={80} />
              <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {roleDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
