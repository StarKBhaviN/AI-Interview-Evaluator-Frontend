"use client"
import React, { useState, useEffect } from 'react'
import { Progress } from '../ui/progress'
import { Mic, Square, SkipForward, TrendingUp, AlertTriangle, X, Loader2 } from 'lucide-react'

interface Question {
  id: string
  text: string
  difficulty: string
  category: string
}

const difficultyColors: Record<string, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Hard: 'bg-red-500/15 text-red-400 border-red-500/20',
}

import { invoke } from '@tauri-apps/api/core'

export default function InterviewClient() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [waveform, setWaveform] = useState<number[]>(Array(30).fill(0))
  const [confidence, setConfidence] = useState(0)
  const [showSubmit, setShowSubmit] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [warningMsg, setWarningMsg] = useState('')
  const [loading, setLoading] = useState(true)

  const currentQuestion = questions[currentQ]
  const isLastQuestion = questions.length > 0 && currentQ === questions.length - 1
  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const data = await invoke<Question[]>('get_questions')
      setQuestions(data)
    } catch (err) {
      console.error('Failed to fetch questions', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (questions.length === 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleTimeUp(); return 0 }
        return prev - 1
      })
    }, 1000)
    const cheatingCheck = setInterval(() => {
      if (Math.random() < 0.05 && !showWarning) {
        const alerts = ['Face not detected', 'Multiple persons detected', 'Tab switching detected', 'Microphone muted']
        setWarningMsg(alerts[Math.floor(Math.random() * alerts.length)])
        setShowWarning(true)
      }
    }, 10000)
    return () => { clearInterval(timer); clearInterval(cheatingCheck) }
  }, [currentQ, showWarning, questions])

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveform(Array(30).fill(0).map(() => Math.random() * 100))
        setConfidence((prev) => Math.min(100, prev + Math.random() * 5))
      }, 100)
      return () => clearInterval(interval)
    } else {
      setWaveform(Array(30).fill(0))
    }
  }, [isRecording])

  const handleTimeUp = () => { if (isRecording) handleStopRecording(); handleNext() }
  
  const [audioPaths, setAudioPaths] = useState<string[]>([])

  const handleStartRecording = async () => { 
    try {
      await invoke('start_audio_capture')
      setIsRecording(true)
      setConfidence(0) 
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  const handleStopRecording = async () => { 
    try {
      const path = await invoke<string>('stop_audio_capture')
      setIsRecording(false)
      setShowSubmit(true)
      setAudioPaths(prev => [...prev, path])
    } catch (err) {
      console.error('Failed to stop recording', err)
    }
  }

  const handleNext = () => {
    setShowSubmit(false)
    if (isLastQuestion) { 
      // Save paths to localStorage for the processing page
      localStorage.setItem('interviewAudioPaths', JSON.stringify(audioPaths))
      window.location.href = '/processing' 
    }
    else { setCurrentQ(currentQ + 1); setTimeLeft(180); setConfidence(0) }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || questions.length === 0) return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto py-6 relative z-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Interview in Progress</h1>
            <p className="text-white/30 text-sm">Question {currentQ + 1} of {questions.length}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold font-mono tabular-nums ${timeLeft < 30 ? 'text-red-400 animate-countdown-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-white/30 text-xs">Time remaining</p>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progress} variant="gradient" size="sm" className="mb-6" />

        {/* Question card */}
        <div className="glass rounded-2xl p-6 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${difficultyColors[currentQuestion.difficulty]}`}>
              {currentQuestion.difficulty}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40">
              {currentQuestion.category}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-white leading-relaxed">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Recording section */}
        <div className="glass rounded-2xl p-6 mb-6">
          {/* Waveform */}
          <div className="bg-[#080818] rounded-xl p-6 mb-6 border border-white/[0.04]">
            <div className="flex items-end justify-center gap-[3px] h-24">
              {waveform.map((height, index) => (
                <div
                  key={index}
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    isRecording
                      ? 'bg-gradient-to-t from-indigo-500 to-purple-400'
                      : 'bg-white/[0.06]'
                  }`}
                  style={{ height: `${Math.max(8, height)}%` }}
                />
              ))}
            </div>
          </div>

          {/* Confidence indicator */}
          {isRecording && (
            <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-fade-in-up">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-white/60">Confidence Level</span>
                </div>
                <span className="text-sm font-bold text-emerald-400">{Math.round(confidence)}%</span>
              </div>
              <Progress value={confidence} variant="success" size="sm" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-red-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 animate-pulse-glow"
                style={{ '--primary-glow': 'rgba(239,68,68,0.3)' } as React.CSSProperties}
              >
                <Square className="w-4 h-4" />
                Stop Recording
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recording Confirmation Popup */}
      {showSubmit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
          <div className="glass rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <h2 className="text-lg font-bold text-white mb-2">Submit this answer?</h2>
            <p className="text-white/40 text-sm mb-4">Review your response before submitting. You can re-record if needed.</p>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/50">Confidence Score</span>
                <span className="text-sm font-bold text-emerald-400">{Math.round(confidence)}%</span>
              </div>
              <Progress value={confidence} variant="success" size="sm" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowSubmit(false); setConfidence(0) }}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] font-medium text-sm transition-all"
              >
                Re-record
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anti-Cheating Warning Popup */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass rounded-2xl max-w-md w-full p-6 border-l-4 border-l-amber-500 animate-scale-in">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-amber-300">Warning Detected</h2>
                <p className="text-white/40 text-sm mt-1">{warningMsg}. Please ensure you&apos;re following all interview guidelines.</p>
              </div>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-300 font-semibold text-sm hover:bg-amber-500/25 transition-all"
            >
              OK, Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
