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
  const [warningLogs, setWarningLogs] = useState<{time: string, flags: string[]}[]>([])
  const [step, setStep] = useState<'permissions' | 'posture' | 'interview'>('permissions')
  const [loading, setLoading] = useState(true)

  const currentQuestion = questions[currentQ]
  const isLastQuestion = questions.length > 0 && currentQ === questions.length - 1
  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0

  const robotMood = React.useMemo(() => {
    if (showWarning) return 'warning'
    if (isRecording) {
      // Use a more stable dependency for max volume to avoid re-calculating on every waveform frame
      const maxVol = Math.max(...waveform, 0)
      if (confidence > 85) return 'smiling'
      if (maxVol < 10) return 'thinking'
      return 'neutral'
    }
    return 'neutral'
  }, [showWarning, isRecording, waveform, confidence])

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

  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const tabSwitchedRef = React.useRef(false)
  const micMutedRef = React.useRef(false)

  useEffect(() => {
    if (questions.length === 0 || step !== 'interview') return
    
    // Tab Switching Detection
    // Tab/Window Focusing Detection
    const handleInactivity = () => {
      tabSwitchedRef.current = true
      setWarningMsg('Interaction with other windows/tabs detected')
      setShowWarning(true)
      setWarningLogs(prev => [...prev, { time: formatTime(180 - timeLeft), flags: ["Tab switching detected"] }])
    }

    window.addEventListener('blur', handleInactivity)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') handleInactivity()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const timer = setInterval(() => {
      if (permissions.audio !== 'granted' || permissions.video !== 'granted') return
      setTimeLeft((prev) => {
        if (prev <= 1) { handleTimeUp(); return 0 }
        return prev - 1
      })
    }, 1000)

    // Real Proctoring Check (Webcam)
    const proctoringInterval = setInterval(async () => {
      if (!isRecording || !videoRef.current || !canvasRef.current) return

      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
        canvas.toBlob(async (blob) => {
        if (!blob) return
        const formData = new FormData()
        formData.append('frame', blob, 'frame.jpg')
        
        // Append frontend detected flags
        formData.append('tab_switched', tabSwitchedRef.current.toString())
        formData.append('mic_muted', micMutedRef.current.toString())

        try {
          const response = await fetch('http://localhost:8000/check-cheating', {
            method: 'POST',
            body: formData,
          })
          const data = await response.json()
          
          // Reset flags after successful report
          if (response.ok) {
            tabSwitchedRef.current = false
            micMutedRef.current = false
          }

          if (data.cheat_detected) {
            // Filter out flags that we already logged from the frontend (like Tab Switching)
            // if they are returning from the backend to avoid duplicates in the same timestamp
            const finalFlags = data.flags.filter((flag: string) => {
              if (flag === "Tab switching detected" || flag === "Microphone muted") {
                 // If we already have a log with this exact time and flag, skip it
                 const isDup = warningLogs.some(l => l.time === formatTime(180 - timeLeft) && l.flags.includes(flag))
                 return !isDup
              }
              return true
            })

            if (finalFlags.length > 0) {
              setWarningLogs(prev => [...prev, { time: formatTime(180 - timeLeft), flags: finalFlags }])
              setWarningMsg(finalFlags.join(', '))
              setShowWarning(true)
            }
          }
        } catch (err) {
          console.error('Proctoring check failed', err)
        }
      }, 'image/jpeg', 0.6)
    }, 8000) // Check every 8 seconds

    return () => { 
      clearInterval(timer)
      clearInterval(proctoringInterval)
      window.removeEventListener('blur', handleInactivity)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [currentQ, showWarning, questions, isRecording])

  const [permissions, setPermissions] = useState<{
    audio: 'pending' | 'granted' | 'denied',
    video: 'pending' | 'granted' | 'denied'
  }>({ audio: 'pending', video: 'pending' })

  const checkPermissions = async () => {
    console.log('Checking permissions...')
    setPermissions({ audio: 'pending', video: 'pending' })
    if (videoRef.current) videoRef.current.srcObject = null
    
    // Slight delay for visual feedback in case of instant rejection
    await new Promise(resolve => setTimeout(resolve, 500))

    // 1. Check Video first
    let vStatus: 'granted' | 'denied' = 'denied'
    try {
      const vStream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = vStream
      if (videoRef.current) videoRef.current.srcObject = vStream
      vStatus = 'granted'
    } catch (err) {
      console.error('Video access denied', err)
      vStatus = 'denied'
    }

    // 2. Check Audio
    let aStatus: 'granted' | 'denied' = 'denied'
    try {
      // NOTE: We don't want to double-prompt if possible, but browsers usually 
      // handle these separately if denied once.
      const aStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // We don't need to keep this stream here as the visualizer effect 
      // will handle its own stream lifecycle when isRecording is true.
      // However, we need to know it IS possible.
      aStream.getTracks().forEach(t => t.stop())
      aStatus = 'granted'
    } catch (err) {
      console.error('Audio access denied', err)
      aStatus = 'denied'
    }

    setPermissions({ audio: aStatus, video: vStatus })
    if (vStatus === 'granted' && aStatus === 'granted') {
      setStep('posture')
    }
  }

  useEffect(() => {
    checkPermissions()
  }, [])

  // Sync stream with video element when it mounts/unmounts across steps
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [step, permissions.video])

  useEffect(() => {
    let audioContext: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let dataArray: Uint8Array | null = null
    let animationFrame: number | null = null

    const startVisualizer = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        
        // Monitor Microphone Mute status
        const audioTrack = stream.getAudioTracks()[0]
        if (audioTrack) {
          audioTrack.onmute = () => { micMutedRef.current = true }
          audioTrack.onunmute = () => { micMutedRef.current = false }
          // Check initial state
          micMutedRef.current = !audioTrack.enabled || audioTrack.muted
          if (micMutedRef.current) {
            setWarningLogs(prev => [...prev, { time: formatTime(180 - timeLeft), flags: ["Microphone muted"] }])
          }
        }

        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const source = audioContext.createMediaStreamSource(stream)
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 64
        source.connect(analyser)
        
        const bufferLength = analyser.frequencyBinCount
        dataArray = new Uint8Array(bufferLength)

        const draw = () => {
          if (!analyser || !dataArray) return
          analyser.getByteFrequencyData(dataArray as any)
          
          // Map frequency data to our 30-bar waveform
          const normalized = Array.from(dataArray).slice(0, 30).map(val => (val / 255) * 100)
          setWaveform(normalized)
          
          animationFrame = requestAnimationFrame(draw)
        }
        draw()
      } catch (err) {
        console.error('Visualizer failed:', err)
      }
    }

    if (isRecording) {
      startVisualizer()
      const confidenceInterval = setInterval(() => {
        setConfidence((prev) => {
          const maxVol = Math.max(...waveform, 0)
          let target = 75
          
          if (maxVol < 5) {
            // Very quiet - user is likely not speaking
            target = 30 + Math.random() * 10
          } else if (maxVol < 15) {
            // Low volume
            target = 55 + Math.random() * 15
          } else {
            // Good volume
            target = 75 + Math.random() * 15
          }

          // Smooth transition towards target
          const diff = target - prev
          const next = prev + (diff * 0.2) // 20% movement towards target per tick
          
          return Math.min(98, Math.max(15, next))
        })
      }, 200)
      
      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame)
        if (audioContext) audioContext.close()
        clearInterval(confidenceInterval)
      }
    } else {
      setWaveform(Array(30).fill(0))
    }
  }, [isRecording])


  const handleTimeUp = () => { if (isRecording) handleStopRecording(); handleNext() }
  
  const [audioPaths, setAudioPaths] = useState<Record<number, string>>({})

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1)
      setTimeLeft(180)
      setConfidence(0)
      setShowSubmit(false)
    }
  }

  const handleJump = (index: number) => {
    if (isRecording) {
      setWarningMsg('Stop recording before jumping to another question')
      setShowWarning(true)
      return
    }
    setCurrentQ(index)
    setTimeLeft(180)
    setConfidence(0)
    setShowSubmit(false)
  }

  const handleStartRecording = async () => { 
    if (permissions.audio !== 'granted' || permissions.video !== 'granted') {
      checkPermissions()
      return
    }
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
      setAudioPaths(prev => ({ ...prev, [currentQ]: path }))
    } catch (err) {
      console.error('Failed to stop recording', err)
    }
  }

  const handleNext = () => {
    setShowSubmit(false)
    if (!isLastQuestion) { 
      setCurrentQ(currentQ + 1)
      setTimeLeft(180)
      setConfidence(0)
    }
  }

  const handleFinish = () => {
    // Save mapped paths and questions to localStorage for the processing page
    localStorage.setItem('interviewAudioPaths', JSON.stringify(audioPaths))
    localStorage.setItem('interviewQuestions', JSON.stringify(questions))
    localStorage.setItem('interviewWarnings', JSON.stringify(warningLogs))
    window.location.href = '/processing' 
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
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-purple-500/5 rounded-full blur-[120px] -z-10" />

      <canvas ref={canvasRef} className="hidden" />

      {/* Permissions Step (Hardware Guard) */}
      {step === 'permissions' && (
        <div className="fixed inset-0 bg-[#020205]/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full glass rounded-[2.5rem] p-10 text-center border border-white/[0.08] shadow-2xl relative overflow-hidden">
            {/* Background Blurs */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
              <AlertTriangle className="w-10 h-10 text-indigo-400" />
            </div>
            
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight italic uppercase">Hardware Guard</h2>
            <p className="text-white/40 text-sm mb-10 leading-relaxed font-medium">
              Enable your <span className="text-white/80">essential peripherals</span> to proceed <br/> with the AI proctoring stage.
            </p>
            
            {/* Simple Indicator of what's missing */}
            <div className="space-y-4 mb-8">
               <div className={`p-4 rounded-2xl border flex items-center justify-between ${permissions.video === 'granted' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.03] border-white/[0.05]'}`}>
                  <div className="flex items-center gap-3">
                    <TrendingUp className={`w-4 h-4 ${permissions.video === 'granted' ? 'text-emerald-400' : 'text-white/20'}`} />
                    <span className={`text-xs font-bold ${permissions.video === 'granted' ? 'text-emerald-400' : 'text-white/40'}`}>Camera Access</span>
                  </div>
                  {permissions.video === 'granted' && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
               </div>
               <div className={`p-4 rounded-2xl border flex items-center justify-between ${permissions.audio === 'granted' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.03] border-white/[0.05]'}`}>
                  <div className="flex items-center gap-3">
                    <Mic className={`w-4 h-4 ${permissions.audio === 'granted' ? 'text-emerald-400' : 'text-white/20'}`} />
                    <span className={`text-xs font-bold ${permissions.audio === 'granted' ? 'text-emerald-400' : 'text-white/40'}`}>Microphone Access</span>
                  </div>
                  {permissions.audio === 'granted' && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
               </div>
            </div>

            <button
                onClick={checkPermissions}
                className="w-full py-5 rounded-[1.25rem] bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/40 hover:bg-indigo-400 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
              Authorize Hardware
            </button>
          </div>
        </div>
      )}

      {/* Posture Guidance Step */}
      {step === 'posture' && (
        <div className="fixed inset-0 bg-[#020205] z-[90] flex items-center justify-center p-8 animate-fade-in">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Guide Side */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-black text-white mb-4 italic uppercase tracking-tight">Setup your stage</h2>
                <p className="text-white/40 text-lg leading-relaxed">
                  Proper alignment ensures accurate proctoring and a better interview experience.
                </p>
              </div>

              <div className="glass rounded-[2rem] p-8 border-white/[0.08] relative overflow-hidden">
                <img src="/gui/posture.png" alt="Ideal Posture Illustration" className="w-full h-auto rounded-xl opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent opacity-60" />
              </div>

              <div className="space-y-4">
                {[
                  "Position yourself 2-3 feet from the screen",
                  "Center your head in the preview windows",
                  "Ensure your face is well-lit and clearly visible"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-[10px] font-black">{i+1}</div>
                    <p className="text-white/60 text-sm font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Preview Side */}
            <div className="space-y-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[3rem] blur opacity-30" />
                <div className="relative glass rounded-[3rem] aspect-square overflow-hidden border-white/[0.08] bg-black shadow-2xl">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover grayscale-[0.2]"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {/* Calibration Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-80 rounded-[4rem] border-2 border-dashed border-white/20 relative">
                       <div className="absolute inset-0 bg-indigo-500/5 rounded-[4rem]" />
                    </div>
                  </div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] font-black text-white/60 tracking-[0.2em] uppercase">Calibration Mirror</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('interview')}
                className="w-full py-6 rounded-[2rem] bg-indigo-500 text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/40 hover:bg-indigo-400 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-4"
              >
                I'm properly aligned
                <TrendingUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto py-4 relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight italic">AI INTERVIEW STAGE</h1>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-none">Status: {isRecording ? 'LIVE STREAMING' : 'READY TO START'}</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-1">Time Left</div>
              <div className={`text-2xl font-black font-mono tabular-nums ${timeLeft < 30 ? 'text-red-400 animate-countdown-pulse' : 'text-indigo-400'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="text-right min-w-[100px]">
              <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-1 font-mono">
                {currentQ + 1} / {questions.length}
              </div>
              <Progress value={progress} variant="gradient" size="sm" className="h-1.5" />
            </div>
          </div>
        </div>

        {/* Question Panel */}
        <div className="glass rounded-3xl p-6 mb-8 border-white/[0.08] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp className="w-12 h-12 text-white" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[10px] font-black px-3 py-1 rounded-full border shadow-sm uppercase tracking-wider ${difficultyColors[currentQuestion.difficulty]}`}>
              {currentQuestion.difficulty}
            </span>
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40 uppercase tracking-wider">
              {currentQuestion.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight max-w-3xl">
            {currentQuestion.text}
          </h2>

          {/* Question Navigator Bubbles */}
          <div className="flex flex-wrap gap-2 mt-6 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
            {questions.map((_, idx) => {
              const isCurrent = idx === currentQ
              const isAnswered = !!audioPaths[idx]
              return (
                <button
                  key={idx}
                  onClick={() => handleJump(idx)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 relative group/bubble ${
                    isCurrent 
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-110 z-10' 
                      : isAnswered
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-white/[0.02] border border-white/[0.05] text-white/20 hover:bg-white/[0.08] hover:text-white/40'
                  }`}
                >
                  {idx + 1}
                  {isAnswered && !isCurrent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#020205] shadow-lg" />
                  )}
                  {/* Tooltip */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-[8px] text-white opacity-0 group-hover/bubble:opacity-100 pointer-events-none whitespace-nowrap z-20">
                     Question {idx + 1} {isAnswered ? '(Answered)' : ''}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dual Screen Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Panel 1: Interviewer */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur opacity-25" />
            <div className="relative glass rounded-[2.5rem] aspect-video overflow-hidden border-white/[0.08] bg-[#020205]/40 flex items-center justify-center shadow-2xl transition-transform hover:scale-[1.01] duration-500">
               {/* Mood Backdrop */}
              <div className={`absolute inset-0 opacity-20 blur-[80px] transition-colors duration-1000 ${
                robotMood === 'warning' ? 'bg-red-500' :
                robotMood === 'smiling' ? 'bg-emerald-500' :
                robotMood === 'thinking' ? 'bg-amber-500' : 'bg-indigo-500'
              }`} />
              
              <div className="relative z-10 text-center">
                <img 
                  src={`/robots/${robotMood}.png`} 
                  alt="Robot Interviewer" 
                  className={`w-64 h-64 object-contain transition-all duration-700 ${isRecording ? 'animate-float' : 'opacity-80 scale-95'}`}
                />
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/5 backdrop-blur-md">
                    <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
                    <span className="text-[10px] font-black text-white/60 tracking-[0.2em] uppercase">Interviewer Live</span>
                  </div>
                  <p className="text-white/40 text-[11px] font-medium tracking-wide">
                    {robotMood === 'warning' ? 'Detecting anomalies...' : 
                     robotMood === 'smiling' ? 'Great response!' :
                     robotMood === 'thinking' ? 'Listening carefully...' : 'Ready for your answer'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Candidate */}
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-[2.5rem] blur opacity-25" />
             <div className="relative glass rounded-[2.5rem] aspect-video overflow-hidden border-white/[0.08] bg-black/40 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              {/* Overlays */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-end justify-between gap-6">
                   {/* Waveform Overlay */}
                   <div className="flex items-end gap-[3px] h-12 flex-1 pb-2">
                    {waveform.map((height, index) => (
                      <div
                        key={index}
                        className={`w-1.5 rounded-full transition-all duration-75 ${
                          isRecording
                            ? 'bg-gradient-to-t from-indigo-500 to-purple-400'
                            : 'bg-white/10'
                        }`}
                        style={{ height: `${Math.max(6, height)}%` }}
                      />
                    ))}
                  </div>

                  {/* Confidence Overlay */}
                  {isRecording && (
                    <div className="w-32 bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/5 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Conf.</span>
                          <span className="text-[10px] font-bold text-emerald-400">{Math.round(confidence)}%</span>
                        </div>
                        <Progress value={confidence} variant="success" size="sm" className="h-1" />
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-white tracking-widest uppercase">Self Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Command Bar */}
        <div className="flex items-center justify-center gap-4 mt-12 pb-12">
            <button
               onClick={handleBack}
               disabled={currentQ === 0 || isRecording}
               className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-90 disabled:opacity-20 disabled:cursor-not-allowed rotate-180"
             >
               <SkipForward className="w-6 h-6" />
            </button>

            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="px-12 py-5 rounded-[2rem] bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-100 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                Commence Recording
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="px-12 py-5 rounded-[2rem] bg-red-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(239,68,68,0.3)] hover:bg-red-400 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center gap-4 animate-pulse-glow"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Square className="w-3 h-3" />
                </div>
                Terminate Recording
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={isLastQuestion || isRecording}
              className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-90 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <SkipForward className="w-6 h-6" />
            </button>
        </div>

        {/* Final Submit Button - Only shows up when we reach the end or have answered everything */}
        <div className={`flex flex-col items-center justify-center -mt-4 animate-fade-in transition-all duration-500 ${isLastQuestion ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none h-0'}`}>
           <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Final session reached</p>
           <button
             onClick={handleFinish}
             className="px-16 py-5 rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-4"
           >
             Submit Final Interview
             <AlertTriangle className="w-4 h-4" />
           </button>
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
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${confidence}%` }} />
              </div>
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
                Confirm Answer
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
