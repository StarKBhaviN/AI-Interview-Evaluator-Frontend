"use client"
import React, { useEffect, useState } from 'react'
import { Brain, Check } from 'lucide-react'

const statuses = [
  { label: 'Analyzing speech clarity', icon: '🎤' },
  { label: 'Evaluating response relevance', icon: '🎯' },
  { label: 'Checking keyword coverage', icon: '🔑' },
  { label: 'Calculating confidence scores', icon: '📊' },
  { label: 'Generating feedback report', icon: '📝' },
]

export default function ProcessingClient() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let idx = 0
    const interval = setInterval(() => {
      idx++
      if (idx < statuses.length) {
        setCurrentIndex(idx)
      } else {
        clearInterval(interval)
        setDone(true)
        setTimeout(() => { window.location.href = '/completed' }, 1200)
      }
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float animate-delay-300" />

      <div className="glass rounded-2xl max-w-md w-full p-10 text-center animate-fade-in-up">
        {/* Brain animation */}
        <div className="relative mb-8 inline-block">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-pulse-glow">
            <Brain className="w-12 h-12 text-white" />
          </div>
          {/* Orbiting particles */}
          <div className="absolute inset-[-20px] animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50" />
          </div>
          <div className="absolute inset-[-30px] animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          </div>
          <div className="absolute inset-[-15px] animate-spin-slow" style={{ animationDuration: '6s' }}>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Processing Your Interview</h2>
        <p className="text-white/40 text-sm mb-8">Our AI is analyzing your responses</p>

        {/* Steps */}
        <div className="space-y-3 text-left">
          {statuses.map((s, index) => {
            const isDone = index < currentIndex || done
            const isCurrent = index === currentIndex && !done
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                  isDone
                    ? 'bg-emerald-500/8 border border-emerald-500/15'
                    : isCurrent
                    ? 'bg-indigo-500/8 border border-indigo-500/15'
                    : 'bg-white/[0.01] border border-transparent'
                }`}
              >
                <span className="text-lg">{s.icon}</span>
                <span className={`text-sm font-medium flex-1 transition-all duration-300 ${
                  isDone ? 'text-emerald-400' :
                  isCurrent ? 'text-white' :
                  'text-white/20'
                }`}>
                  {s.label}
                </span>
                {isDone && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {isCurrent && (
                  <div className="w-4 h-4 border-2 border-indigo-400/50 border-t-indigo-400 rounded-full animate-spin" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
