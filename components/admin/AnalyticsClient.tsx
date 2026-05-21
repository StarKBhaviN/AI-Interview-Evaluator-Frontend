"use client"
import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line } from 'recharts'
import { Activity, Clock, Target, TrendingUp, RefreshCw } from 'lucide-react'
import { getBaseUrl } from '@/lib/api'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899']

export default function AnalyticsClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const baseUrl = await getBaseUrl()
        const res = await fetch(`${baseUrl}/api/admin/analytics`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Failed to fetch analytics', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading || !data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Compiling Dynamic Insights...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Intelligence Hub</h1>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Real-time platform performance heuristics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Live Engine</span>
        </div>
      </div>

      {/* Dynamic Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Interviews', value: data.summary.totalInterviews, sub: 'Sessions Completed', icon: Activity },
          { label: 'Avg Duration', value: data.summary.avgDuration, sub: 'Efficiency', icon: Clock },
          { label: 'Success Rate', value: data.summary.passRate, sub: 'Above 70% Score', icon: Target },
          { label: 'Model Confidence', value: data.summary.accuracy, sub: 'AI Reliability', icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-3xl p-6 border border-white/[0.06] hover:border-indigo-500/30 transition-all relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-all">
              <stat.icon className="w-16 h-16" />
            </div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white italic tabular-nums">{stat.value}</p>
            <p className="text-[10px] font-bold text-indigo-400/60 mt-1 uppercase tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Performance trends */}
        <div className="glass rounded-[2.5rem] p-8 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Scoring Velocity</h2>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Last 6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} fontVariant="black" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} unit="%" />
              <Tooltip 
                contentStyle={{ background: '#0A0A1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="avg" name="Avg" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }} />
              <Line type="monotone" dataKey="high" name="High" stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="low" name="Low" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Topic-wise weakness */}
        <div className="glass rounded-[2.5rem] p-8 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Skill Proficiency</h2>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Aggregate Heuristics</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data.topicProficiency}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="topic" stroke="rgba(255,255,255,0.4)" fontSize={9} />
              <Radar name="Performance" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#0A0A1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Role Distribution */}
        <div className="glass rounded-[2.5rem] p-8 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Role Distribution</h2>
            <RefreshCw className="w-3 h-3 text-white/10" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.roleDistribution} layout="vertical" barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} vertical={false} />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="rgba(255,255,255,0.4)" 
                fontSize={9} 
                width={100} 
                tickLine={false} 
                axisLine={false} 
                className="font-black uppercase"
              />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: '#0A0A1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.roleDistribution.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Success Breakdown (Pie) */}
        <div className="glass rounded-[2.5rem] p-8 border border-white/[0.06]">
           <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Hiring Success</h2>
             <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Efficiency High</span>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie 
                  data={[
                    { name: 'Passing', value: parseFloat(data.summary.passRate) },
                    { name: 'Failing', value: 100 - parseFloat(data.summary.passRate) }
                  ]} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value" 
                  strokeWidth={0}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="rgba(255,255,255,0.03)" />
                </Pie>
                <Tooltip contentStyle={{ background: '#0A0A1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
              </PieChart>
            </ResponsiveContainer>
             <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black italic text-white leading-none">{data.summary.passRate}</span>
                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Pass Ratio</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
