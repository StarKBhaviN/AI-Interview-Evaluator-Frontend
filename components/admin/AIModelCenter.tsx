"use client"
import React, { useState, useEffect } from 'react'
import { 
  Cpu, 
  Database, 
  Activity, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  BarChart2, 
  RefreshCw 
} from 'lucide-react'
import { getBaseUrl } from '@/lib/api'

interface AIStatus {
  relevance: {
    status: string
    data_count: number
    can_train: boolean
  }
  confidence: {
    status: string
    features: string[]
  }
}

export default function AIModelCenter() {
  const [status, setStatus] = useState<AIStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [training, setTraining] = useState(false)

  const fetchStatus = async () => {
    try {
      const baseUrl = await getBaseUrl()
      const res = await fetch(`${baseUrl}/api/ai/status`)
      const data = await res.json()
      setStatus(data)
    } catch (err) {
      console.error('Failed to fetch AI status:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const handleTrain = async () => {
    if (training) return
    setTraining(true)
    try {
      const baseUrl = await getBaseUrl()
      await fetch(`${baseUrl}/api/ai/train-relevance`, { method: 'POST' })
      alert('Training started in background. It will take a few minutes.')
    } catch (err) {
      alert('Failed to start training.')
    } finally {
      setTraining(false)
    }
  }

  if (loading) return (
    <div className="p-10 flex items-center justify-center">
      <RefreshCw className="w-8 h-8 text-white/20 animate-spin" />
    </div>
  )

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-1 text-white">AI Model Management</h3>
          <p className="text-white/40 text-sm">Monitor and fine-tune your interview intelligence engines</p>
        </div>
        <button 
          onClick={fetchStatus}
          className="p-2 rounded-xl border border-white/[0.06] hover:bg-white/[0.04] transition-all"
        >
          <RefreshCw className="w-4 h-4 text-white/40" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
        {/* Model 2: Relevance Scorer */}
        <div className="glass p-6 rounded-[2rem] border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02] transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Cpu className="w-6 h-6 text-indigo-400" />
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              status?.relevance.status === 'Fine-tuned' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {status?.relevance.status}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-lg">Answer Relevance Scorer</h4>
              <p className="text-white/30 text-xs mt-1">RoBERTa-base Engine (Semantic Analysis)</p>
            </div>

            <div className="flex items-center gap-6 py-4 border-y border-white/[0.06]">
              <div className="space-y-1">
                <p className="text-[10px] text-white/20 uppercase font-black tracking-wider">Training Data</p>
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-white/40" />
                  <span className="font-bold text-sm">{status?.relevance.data_count} Pairs</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/20 uppercase font-black tracking-wider">Stability</p>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-400">High</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleTrain}
              disabled={training || !status?.relevance.can_train}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                training 
                  ? 'bg-white/5 text-white/20 cursor-wait' 
                  : status?.relevance.can_train 
                    ? 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/10' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              {training ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {training ? 'Fine-tuning in Progress...' : 'Run RoBERTa Fine-tuning'}
            </button>
            {!status?.relevance.can_train && (
              <p className="text-rose-400/60 text-[10px] text-center italic">
                * Need at least 5 training pairs to start
              </p>
            )}
          </div>
        </div>

        {/* Model 3: Confidence Analyzer */}
        <div className="glass p-6 rounded-[2rem] border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02] transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <BarChart2 className="w-6 h-6 text-purple-400" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
              Ready
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-lg">Confidence & Tone Analyzer</h4>
              <p className="text-white/30 text-xs mt-1">Acoustic Prosody Engine (V1 Rules)</p>
            </div>

            <div className="space-y-3 py-4 border-y border-white/[0.06]">
                <p className="text-[10px] text-white/20 uppercase font-black tracking-wider">Active Audio Features</p>
                <div className="flex flex-wrap gap-2">
                  {status?.confidence.features.map(f => (
                    <span key={f} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/60">
                       {f}
                    </span>
                  ))}
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
              <p className="text-[11px] text-white/50 leading-relaxed">
                The engine is currently using **Rule-Based V1**. It detects nervousness through silence ratios and energy spikes. No training required for V1.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tip Box */}
      <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-indigo-400" />
        </div>
        <p className="text-xs text-white/40 leading-relaxed">
          <strong className="text-white/70 block mb-0.5">Admin Tip:</strong>
          Insert more (Question, Answer, Score) pairs in `training_data.json` to improve the Relevance Scorer. Larger datasets result in more accurate talent assessment.
        </p>
      </div>
    </div>
  )
}
