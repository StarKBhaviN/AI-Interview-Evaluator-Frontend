"use client"
import React, { useState, useEffect } from 'react'
import { Progress } from '../ui/progress'
import { Camera, Mic, Clock, Play, User, HelpCircle } from 'lucide-react'

export default function WaitingRoomClient() {
  const [countdown, setCountdown] = useState(15)
  const [micLevel, setMicLevel] = useState(0)
  const candidateData = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('candidateData') || '{}')
    : {}

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)
    const micInterval = setInterval(() => {
      setMicLevel(Math.random() * 100)
    }, 100)
    return () => {
      clearInterval(timer)
      clearInterval(micInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />

      <div className="glass rounded-2xl max-w-2xl w-full animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/[0.06] px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Interview Waiting Room</h1>
          <p className="text-white/40 text-sm">Get ready — your interview will begin shortly</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Camera preview */}
          <div className="bg-[#080818] rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden border border-white/[0.06]">
            <div className="text-center z-10">
              <Camera className="w-12 h-12 mx-auto mb-2 text-white/20" />
              <p className="text-white/30 text-sm">Camera Preview</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            {/* Corner indicators */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-500/40 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-indigo-500/40 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-indigo-500/40 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-500/40 rounded-br-lg" />
            {/* Recording dot */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
              <span className="text-[10px] text-white/40 font-medium">LIVE</span>
            </div>
          </div>

          {/* Mic level */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-white/60">Microphone Level</span>
              </div>
              <span className="text-xs text-emerald-400">Monitoring</span>
            </div>
            <Progress value={micLevel} variant="gradient" size="sm" />
          </div>

          {/* Countdown */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/15 text-center">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Starting in</p>
            <div className="text-7xl font-bold text-gradient mb-1 animate-countdown-pulse">
              {countdown}
            </div>
            <p className="text-white/30 text-sm">seconds</p>
          </div>

          {/* Interview details */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: User, label: 'Candidate', value: candidateData.name || 'Unknown' },
              { icon: HelpCircle, label: 'Position', value: candidateData.position || 'Unknown' },
              { icon: HelpCircle, label: 'Questions', value: '5' },
              { icon: Clock, label: 'Time/Question', value: '3 min' },
            ].map((item, index) => (
              <div key={index} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-white/25 text-xs mb-0.5">{item.label}</p>
                <p className="text-white/80 text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Start button */}
          <button
            onClick={() => (window.location.href = '/interview')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Interview Now
          </button>
        </div>
      </div>
    </div>
  )
}
