"use client"
import React, { useState } from 'react'
import { Progress } from '../ui/progress'
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

export default function CandidateReportClient() {
  const [activeTab, setActiveTab] = useState('overview')

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
          <p className="text-white/30 text-sm mt-0.5">Arjun Patel — React Developer</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Overall Score', value: '85/100', color: 'text-gradient font-bold' },
          { label: 'Status', value: 'Passed', color: 'text-emerald-400' },
          { label: 'Interview Date', value: '2026-03-20', color: 'text-white/60' },
          { label: 'Duration', value: '14 min', color: 'text-white/60' },
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
                { label: 'Communication', score: 85, variant: 'default' as const },
                { label: 'Technical Skills', score: 78, variant: 'gradient' as const },
                { label: 'Problem Solving', score: 82, variant: 'default' as const },
                { label: 'Confidence', score: 88, variant: 'success' as const },
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
                <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Radar dataKey="coverage" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'transcript' && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white mb-2">Interview Transcript</h2>
          {[
            { q: 'Tell us about your background and experience.', a: 'I have over 5 years of experience working with React and TypeScript. I started as a junior developer at a startup where I built customer-facing dashboards and gradually moved into leading frontend architecture decisions...', score: 85 },
            { q: 'How would you approach debugging a complex application?', a: 'My approach involves systematic isolation. First, I reproduce the issue, then use browser dev tools and logging to narrow down the source. I check network requests, state changes, and component re-renders...', score: 78 },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-indigo-400 text-sm font-semibold mb-2">Q{i + 1}: {item.q}</p>
              <p className="text-white/40 text-sm leading-relaxed mb-2">{item.a}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/20">Score:</span>
                <span className="text-xs font-bold text-emerald-400">{item.score}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white mb-2">AI Analysis Summary</h2>
          <div className="p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/15">
            <p className="text-white/50 text-sm leading-relaxed">
              The candidate demonstrated strong communication skills with clear articulation. Technical knowledge is solid, particularly in React ecosystem. Areas for improvement include system design depth and testing methodologies. Overall, the candidate shows good potential for the role with some areas requiring further development.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'flags' && (
        <div className="glass rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-semibold text-white mb-2">Detected Flags</h2>
          {[
            { type: 'warning', msg: 'Tab switch detected at 2:45', severity: 'Medium' },
            { type: 'info', msg: 'Background noise spike at 5:12', severity: 'Low' },
          ].map((flag, i) => (
            <div key={i} className={`p-3 rounded-xl border flex items-center justify-between ${
              flag.type === 'warning' ? 'bg-amber-500/8 border-amber-500/15' : 'bg-white/[0.02] border-white/[0.06]'
            }`}>
              <span className="text-sm text-white/50">{flag.msg}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                flag.severity === 'Medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-white/[0.04] text-white/30 border-white/[0.06]'
              }`}>{flag.severity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
