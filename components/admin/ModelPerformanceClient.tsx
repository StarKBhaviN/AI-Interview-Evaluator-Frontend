"use client"
import React from 'react'
import { Progress } from '../ui/progress'
import { Brain, Activity, AlertTriangle, TrendingUp, Zap, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const confidenceData = [
  { x: '1', actual: 82, predicted: 80 },
  { x: '2', actual: 75, predicted: 78 },
  { x: '3', actual: 91, predicted: 88 },
  { x: '4', actual: 68, predicted: 72 },
  { x: '5', actual: 85, predicted: 84 },
  { x: '6', actual: 78, predicted: 76 },
  { x: '7', actual: 92, predicted: 90 },
  { x: '8', actual: 70, predicted: 73 },
]

const driftData = [
  { week: 'W1', drift: 0.02 },
  { week: 'W2', drift: 0.03 },
  { week: 'W3', drift: 0.025 },
  { week: 'W4', drift: 0.04 },
  { week: 'W5', drift: 0.038 },
  { week: 'W6', drift: 0.045 },
  { week: 'W7', drift: 0.042 },
  { week: 'W8', drift: 0.05 },
]

const confusionMatrix = [
  [42, 3, 1],
  [2, 38, 4],
  [1, 2, 31],
]
const labels = ['High', 'Medium', 'Low']

export default function ModelPerformanceClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Model Performance</h1>
        <p className="text-white/30 text-sm mt-1">Research-level AI model metrics and diagnostics</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Precision', value: '94.2%', icon: Target, color: 'indigo', description: 'True positive rate' },
          { label: 'Recall', value: '91.8%', icon: Zap, color: 'purple', description: 'Sensitivity' },
          { label: 'F1 Score', value: '93.0%', icon: Activity, color: 'cyan', description: 'Harmonic mean' },
          { label: 'AUC-ROC', value: '0.967', icon: TrendingUp, color: 'emerald', description: 'Classification quality' },
        ].map((metric, i) => {
          const Icon = metric.icon
          const colorMap: Record<string, string> = {
            indigo: 'from-indigo-500/15 to-indigo-500/5 border-indigo-500/10',
            purple: 'from-purple-500/15 to-purple-500/5 border-purple-500/10',
            cyan: 'from-cyan-500/15 to-cyan-500/5 border-cyan-500/10',
            emerald: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/10',
          }
          const iconColor: Record<string, string> = {
            indigo: 'bg-indigo-500/15 text-indigo-400',
            purple: 'bg-purple-500/15 text-purple-400',
            cyan: 'bg-cyan-500/15 text-cyan-400',
            emerald: 'bg-emerald-500/15 text-emerald-400',
          }
          return (
            <div key={i} className={`glass rounded-xl p-4 bg-gradient-to-br ${colorMap[metric.color]} border card-hover`}>
              <div className={`w-8 h-8 rounded-lg ${iconColor[metric.color]} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-white">{metric.value}</p>
              <p className="text-xs text-white/50 font-medium">{metric.label}</p>
              <p className="text-[11px] text-white/20 mt-0.5">{metric.description}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confidence reliability */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">Confidence Reliability</h2>
          <p className="text-xs text-white/25 mb-4">Predicted vs Actual scores per interview</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="x" stroke="rgba(255,255,255,0.2)" fontSize={11} label={{ value: 'Interview #', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#6366f1', r: 3 }} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Drift detection */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold text-white">Drift Detection</h2>
            <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
              <AlertTriangle className="w-3 h-3" /> Slight drift
            </span>
          </div>
          <p className="text-xs text-white/25 mb-4">Model distribution shift over weeks</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={driftData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} />
              <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <defs>
                <linearGradient id="driftGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="drift" stroke="#f59e0b" fill="url(#driftGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Confusion matrix */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">Confusion Matrix</h2>
          <p className="text-xs text-white/25 mb-4">Predicted vs Actual performance tiers</p>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] text-white/25 font-medium whitespace-nowrap">Actual</div>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 text-[11px] text-white/25 font-medium">Predicted</div>
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="w-16 h-8" />
                    {labels.map((l) => <th key={l} className="text-[11px] text-white/30 font-medium px-2 pb-1">{l}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {confusionMatrix.map((row, ri) => (
                    <tr key={ri}>
                      <td className="text-[11px] text-white/30 font-medium pr-3 text-right">{labels[ri]}</td>
                      {row.map((val, ci) => {
                        const isDiag = ri === ci
                        const intensity = val / 50
                        return (
                          <td key={ci} className="p-1">
                            <div
                              className={`w-16 h-14 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                                isDiag
                                  ? 'text-emerald-300 border border-emerald-500/20'
                                  : 'text-white/40 border border-white/[0.04]'
                              }`}
                              style={{
                                background: isDiag
                                  ? `rgba(16,185,129,${intensity * 0.3})`
                                  : `rgba(239,68,68,${(val / 50) * 0.2})`,
                              }}
                            >
                              {val}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Model info */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Model Information</h2>
              <p className="text-xs text-white/25">Current deployment details</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Model Version', value: 'v3.2.1' },
              { label: 'Total Training Samples', value: '2,547' },
              { label: 'Last Updated', value: '2 days ago' },
              { label: 'Inference Time (avg)', value: '145ms' },
              { label: 'Framework', value: 'PyTorch 2.1' },
              { label: 'Architecture', value: 'Transformer-based' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-white/30">{item.label}</span>
                <span className="font-medium text-white/60">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/30">Training Progress</span>
                <span className="text-indigo-400 font-medium">100%</span>
              </div>
              <Progress value={100} variant="gradient" size="sm" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/30">GPU Utilization</span>
                <span className="text-amber-400 font-medium">72%</span>
              </div>
              <Progress value={72} variant="warning" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
