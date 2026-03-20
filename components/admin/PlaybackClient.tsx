"use client"
import React, { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, ArrowLeft } from 'lucide-react'
import { Progress } from '../ui/progress'

const transcript = [
  { time: '0:00', speaker: 'AI', text: 'Tell us about your background and experience in software development.', highlight: false },
  { time: '0:05', speaker: 'Candidate', text: 'I have over 5 years of experience working with React and TypeScript.', highlight: false },
  { time: '0:15', speaker: 'Candidate', text: 'I started as a junior developer at a startup where I built customer-facing dashboards.', highlight: false },
  { time: '0:30', speaker: 'Candidate', text: 'I gradually moved into leading frontend architecture decisions for the team.', highlight: true },
  { time: '0:45', speaker: 'Candidate', text: 'I have extensive experience with state management using Redux and Zustand.', highlight: false },
  { time: '1:00', speaker: 'Candidate', text: 'Um, I also worked on, uh, performance optimization for large-scale applications.', highlight: true },
]

export default function PlaybackClient() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(35)
  const [activeSegment, setActiveSegment] = useState(3)

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
          <h1 className="text-2xl font-bold text-white">Interview Playback</h1>
          <p className="text-white/30 text-sm mt-0.5">Arjun Patel — React Developer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player */}
        <div className="glass rounded-2xl overflow-hidden lg:col-span-2">
          {/* Video area */}
          <div className="aspect-video bg-[#080818] flex items-center justify-center relative">
            <div className="text-center z-10">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2 mx-auto cursor-pointer hover:bg-white/20 transition-all" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
              </div>
              <p className="text-white/30 text-sm">Audio Playback</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
          </div>

          {/* Controls */}
          <div className="p-5 space-y-3">
            <Progress value={progress} variant="gradient" size="sm" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30 font-mono">4:32</span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white transition-all">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button className="p-2 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white transition-all">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-white/30" />
                <span className="text-xs text-white/30 font-mono">12:45</span>
              </div>
            </div>
            <button className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08] text-sm font-medium transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Recording
            </button>
          </div>
        </div>

        {/* Transcript */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Synced Transcript</h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {transcript.map((line, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-sm transition-all cursor-pointer ${
                  i === activeSegment
                    ? 'bg-indigo-500/10 border border-indigo-500/20'
                    : 'bg-white/[0.01] border border-transparent hover:bg-white/[0.03]'
                } ${line.highlight ? 'border-l-2 border-l-amber-500' : ''}`}
                onClick={() => setActiveSegment(i)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-white/20 font-mono">{line.time}</span>
                  <span className={`text-[11px] font-semibold ${line.speaker === 'AI' ? 'text-indigo-400' : 'text-cyan-400'}`}>
                    {line.speaker}
                  </span>
                </div>
                <p className={`text-white/40 leading-relaxed ${line.highlight ? 'text-amber-300/60' : ''}`}>
                  {line.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
