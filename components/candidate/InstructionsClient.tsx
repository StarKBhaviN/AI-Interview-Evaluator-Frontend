"use client"
import React, { useState } from 'react'
import { Shield, Eye, Clock, Mic, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function InstructionsClient() {
  const [agreed, setAgreed] = useState(false)

  const instructions = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'No Cheating',
      description: 'Do not use external resources, tabs, or get help from others during the interview.',
      color: 'indigo',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Fullscreen Required',
      description: 'The interview must be completed in fullscreen mode. Exiting will be flagged.',
      color: 'purple',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Time Limits',
      description: 'Each question has a time limit. Answer clearly and concisely within the given time.',
      color: 'cyan',
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: 'Audio Required',
      description: 'Your microphone must be on and working. Responses will be recorded and analyzed.',
      color: 'emerald',
    },
  ]

  const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    indigo: { bg: 'bg-indigo-500/8', border: 'border-indigo-500/15', text: 'text-indigo-300', icon: 'bg-indigo-500/15 text-indigo-400' },
    purple: { bg: 'bg-purple-500/8', border: 'border-purple-500/15', text: 'text-purple-300', icon: 'bg-purple-500/15 text-purple-400' },
    cyan: { bg: 'bg-cyan-500/8', border: 'border-cyan-500/15', text: 'text-cyan-300', icon: 'bg-cyan-500/15 text-cyan-400' },
    emerald: { bg: 'bg-emerald-500/8', border: 'border-emerald-500/15', text: 'text-emerald-300', icon: 'bg-emerald-500/15 text-emerald-400' },
  }

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />

      <div className="glass rounded-2xl max-w-2xl w-full animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/[0.06] px-8 py-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Interview Instructions</h1>
          <p className="text-white/40 text-sm">Please read carefully before proceeding</p>
        </div>

        <div className="p-8 space-y-5">
          {/* Instructions */}
          <div className="space-y-3">
            {instructions.map((item, index) => {
              const c = colorMap[item.color]
              return (
                <div
                  key={index}
                  className={`flex gap-4 p-4 rounded-xl ${c.bg} border ${c.border} animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${c.text} mb-0.5`}>{item.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Warning */}
          <div className="flex gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/15">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-300 text-sm mb-0.5">Important</h4>
              <p className="text-white/40 text-sm leading-relaxed">
                Any suspicious activity will be flagged and may result in disqualification.
                Ensure you&apos;re in a quiet, well-lit environment with a stable internet connection.
              </p>
            </div>
          </div>

          {/* Agreement checkbox */}
          <label
            htmlFor="agree"
            className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              agreed
                ? 'bg-emerald-500/8 border border-emerald-500/20'
                : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]'
            }`}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
              agreed
                ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30'
                : 'border-white/20'
            }`}>
              {agreed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="hidden"
            />
            <span className={`text-sm font-medium ${agreed ? 'text-emerald-300' : 'text-white/50'}`}>
              I have read and agree to follow all interview instructions
            </span>
          </label>

          {/* Continue button */}
          <button
            onClick={() => agreed && (window.location.href = '/waiting-room')}
            disabled={!agreed}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              agreed
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
            }`}
          >
            Continue to Waiting Room
          </button>
        </div>
      </div>
    </div>
  )
}
