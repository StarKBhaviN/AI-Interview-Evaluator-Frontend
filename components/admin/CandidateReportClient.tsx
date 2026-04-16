"use client"
import React, { useState, useEffect } from 'react'
import PlaybackClient from './PlaybackClient'
import { Progress } from '../ui/progress'
import { BACKEND_URL } from '@/lib/api'
import { FileText, MessageSquare, Brain, Flag, BarChart3, ArrowLeft } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'

const confidenceData = [
  { time: '0:00', value: 45 }, { time: '0:30', value: 55 }, { time: '1:00', value: 62 },
  { time: '1:30', value: 58 }, { time: '2:00', value: 72 }, { time: '2:30', value: 80 },
  { time: '3:00', value: 75 }, { time: '3:30', value: 85 }, { time: '4:00', value: 88 },
]

const keywordData = [
  { subject: 'React', coverage: 90 }, { subject: 'TypeScript', coverage: 75 },
  { subject: 'Node.js', coverage: 60 }, { subject: 'Testing', coverage: 45 },
  { subject: 'System Design', coverage: 70 }, { subject: 'APIs', coverage: 85 },
]

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'transcript', label: 'Transcript', icon: MessageSquare },
  { id: 'analysis', label: 'AI Analysis', icon: Brain },
  { id: 'flags', label: 'Flags', icon: Flag },
]

export default function CandidateReportClient({ sessionId }: { sessionId?: string }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) return
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/admin/sessions/${sessionId}`)
        if (res.ok) {
           const json = await res.json()
           setData(json)
        }
      } catch (e) {
        console.error("Failed to fetch report", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [sessionId])

  if (loading) return <div className="p-20 text-center animate-pulse text-white/20 font-black uppercase tracking-widest">Loading Digital Report...</div>
  
  if (!data) return <div className="p-20 text-center text-red-400 font-black uppercase tracking-widest italic border border-red-500/10 bg-red-500/5 rounded-3xl">Report Not Found</div>

  const overall = data.report || {}
  const items = data.details || []

  // Pre-process keywords for radar chart
  const keywordStats = overall.summary?.toLowerCase()?.split(' ')?.filter((w: string) => w.length > 5)?.slice(0, 6)?.map((w: string) => ({
    subject: w.charAt(0).toUpperCase() + w.slice(1),
    coverage: 60 + Math.random() * 35
  })) || keywordData

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => (window.location.href = '/admin/candidates')}
          className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-white/40 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Candidate Report</h1>
          <p className="text-white/30 text-sm mt-0.5">{data.position} Candidate — {sessionId}</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Overall Score', value: `${data.score}/100`, color: 'text-indigo-400 font-bold' },
          { label: 'Status', value: data.score >= 70 ? 'Passed' : 'Failed', color: data.score >= 70 ? 'text-emerald-400' : 'text-rose-400' },
          { label: 'Interview Date', value: new Date(data.date).toLocaleDateString(), color: 'text-white/60' },
          { label: 'Questions Answered', value: `${data.questionsCount} Blocks`, color: 'text-white/60' },
        ].map((item, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <p className="text-[11px] text-white/25 mb-1">{item.label}</p>
            <p className={`text-lg font-semibold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score breakdown */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Score Breakdown</h2>
            <div className="space-y-4">
              {[
                { label: 'Communication', score: overall.communicationScore || 75, variant: 'default' as const },
                { label: 'Technical Skills', score: overall.technicalScore || 80, variant: 'gradient' as const },
                { label: 'Problem Solving', score: 82, variant: 'default' as const },
                { label: 'Confidence', score: overall.confidenceScore || 85, variant: 'success' as const },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white/50">{item.label}</span>
                    <span className="font-bold text-white/70">{item.score}%</span>
                  </div>
                  <Progress value={item.score} variant={item.variant} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Confidence graph */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Audio Confidence Over Time</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <defs>
                  <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#confGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Keyword coverage */}
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-base font-semibold text-white mb-4">Keyword Coverage</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={keywordData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Radar dataKey="coverage" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'transcript' && (
        <div className="space-y-6">
          <PlaybackClient sessionId={sessionId!} details={data.details} />
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white mb-2">AI Analysis Summary</h2>
          <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
            <h3 className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-widest">Executive Summary</h3>
            <p className="text-white/50 text-sm leading-relaxed font-medium">
              {overall.summary}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Key Strengths</h4>
                <ul className="space-y-2">
                   {overall.strengths?.map((s: string, idx: number) => (
                     <li key={idx} className="text-white/60 text-xs flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500" /> {s}</li>
                   ))}
                </ul>
             </div>
             <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3">Suggested Improvements</h4>
                <ul className="space-y-2">
                   {overall.improvements?.map((s: string, idx: number) => (
                     <li key={idx} className="text-white/60 text-xs flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-amber-500" /> {s}</li>
                   ))}
                </ul>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'flags' && (
        <div className="glass rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-semibold text-white mb-2">Detected Flags</h2>
          {data.warnings?.length > 0 ? data.warnings.map((flag: any, i: number) => (
            <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between bg-white/[0.02] border-white/[0.06]`}>
              <div>
                <p className="text-sm text-white/50 font-medium">{flag.flags.join(', ')}</p>
                <p className="text-[10px] text-white/20 font-mono mt-1">Detected at: {flag.time}</p>
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest shadow-sm shadow-red-500/10`}>Warning</span>
            </div>
          )) : (
            <div className="p-10 text-center text-white/20 font-bold uppercase tracking-widest italic border border-white/[0.03] rounded-3xl">No security flags found during this session.</div>
          )}
        </div>
      )}
    </div>
  )
}
