"use client"
import React from 'react'
import { Users, CheckCircle, Clock, TrendingUp, ArrowUpRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts'

const scoreData = [
  { range: '0-20', count: 3 },
  { range: '21-40', count: 8 },
  { range: '41-60', count: 18 },
  { range: '61-80', count: 42 },
  { range: '81-100', count: 53 },
]

const trendData = [
  { month: 'Jan', interviews: 12, avgScore: 68 },
  { month: 'Feb', interviews: 18, avgScore: 72 },
  { month: 'Mar', interviews: 24, avgScore: 71 },
  { month: 'Apr', interviews: 32, avgScore: 76 },
  { month: 'May', interviews: 28, avgScore: 79 },
  { month: 'Jun', interviews: 35, avgScore: 82 },
]

const stats = [
  { label: 'Total Candidates', value: '124', change: '+12', icon: Users, color: 'indigo' },
  { label: 'Average Score', value: '78.5', change: '+3.2', icon: TrendingUp, color: 'purple' },
  { label: 'Pass Rate', value: '72%', change: '+5%', icon: CheckCircle, color: 'emerald' },
  { label: "Today's Interviews", value: '8', change: '+2', icon: Clock, color: 'cyan' },
]

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  indigo: { bg: 'from-indigo-500/15 to-indigo-500/5', icon: 'bg-indigo-500/15 text-indigo-400', border: 'border-indigo-500/10' },
  purple: { bg: 'from-purple-500/15 to-purple-500/5', icon: 'bg-purple-500/15 text-purple-400', border: 'border-purple-500/10' },
  emerald: { bg: 'from-emerald-500/15 to-emerald-500/5', icon: 'bg-emerald-500/15 text-emerald-400', border: 'border-emerald-500/10' },
  cyan: { bg: 'from-cyan-500/15 to-cyan-500/5', icon: 'bg-cyan-500/15 text-cyan-400', border: 'border-cyan-500/10' },
}

export default function AdminDashboardClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/30 text-sm mt-1">Monitor interview statistics and candidate progress</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          const c = colorMap[stat.color]
          return (
            <div
              key={i}
              className={`glass rounded-2xl p-5 bg-gradient-to-br ${c.bg} border ${c.border} card-hover`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
              <p className="text-xs text-white/30">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score distribution */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-white mb-4">Score Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={scoreData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="range" stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent interviews */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Recent Interviews</h2>
          <div className="space-y-3">
            {['Arjun Patel', 'Priya Sharma', 'Rahul Mehta', 'Sneha Iyer'].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-white/50 text-xs font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70">{name}</p>
                    <p className="text-[11px] text-white/25">Frontend Developer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white/60">{80 + i * 3}/100</p>
                  <p className="text-[11px] text-white/20">{i + 1}h ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend chart */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Interview Trends</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
            />
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="avgScore" stroke="#6366f1" fill="url(#areaGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
