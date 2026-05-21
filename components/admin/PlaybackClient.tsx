"use client"
import React, { useState, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, ArrowLeft } from 'lucide-react'
import { Progress } from '../ui/progress'
import { getBaseUrl } from '@/lib/api'

export default function PlaybackClient({ sessionId, details }: { sessionId: string, details: any[] }) {
  const [activeSegment, setActiveSegment] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleSegmentClick = async (index: number) => {
    setActiveSegment(index)
    // Construct real backend audio URL
    const baseUrl = await getBaseUrl()
    const url = `${baseUrl}/api/admin/audio/${sessionId}/${details[index].questionIndex}`
    setAudioUrl(url)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player */}
        <div className="glass rounded-2xl overflow-hidden lg:col-span-2 border border-white/[0.05]">
          <div className="aspect-video bg-[#020205] flex flex-col items-center justify-center relative group">
            <div className="relative z-10 text-center space-y-4">
              <div 
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isPlaying ? 'bg-indigo-500 shadow-indigo-500/40 scale-110' : 'bg-white/10 hover:bg-white/20'}`}
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-8 h-8 text-white fill-current" /> : <Play className="w-8 h-8 text-white ml-2 fill-current" />}
              </div>
              <div>
                <p className="text-white font-bold tracking-widest text-[10px] uppercase">Question {details[activeSegment]?.questionIndex! + 1}</p>
                <p className="text-white/30 text-xs mt-1 max-w-xs mx-auto italic">"{details[activeSegment]?.questionText}"</p>
              </div>
            </div>
            
            {/* Visualizer Mock */}
            <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-1 opacity-20">
               {Array(40).fill(0).map((_, i) => (
                 <div key={i} className="w-1 bg-indigo-400 rounded-t-full" style={{ height: isPlaying ? `${20 + Math.random() * 60}%` : '5%', transition: 'height 0.1s' }} />
               ))}
            </div>

            {audioUrl && (
              <audio 
                ref={audioRef}
                src={audioUrl} 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                autoPlay
              />
            )}
          </div>

          <div className="p-6 bg-white/[0.02]">
             <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                   <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">
                      <span>Live Playback</span>
                      <span>{isPlaying ? 'Streaming' : 'Paused'}</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-indigo-500 transition-all duration-300 ${isPlaying ? 'w-1/2' : 'w-0'}`} />
                   </div>
                </div>
                <button className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-xl">
                   <Download className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Synced Transcript</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {details.map((item, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl text-sm transition-all cursor-pointer border ${
                  i === activeSegment
                    ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20'
                    : 'bg-white/[0.01] border-transparent hover:bg-white/[0.03] hover:border-white/10'
                }`}
                onClick={() => handleSegmentClick(i)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Question {item.questionIndex + 1}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[10px] font-bold text-indigo-400">{item.sentiment}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">{Math.round(item.relevance_score * 100)}% Match</span>
                </div>
                <p className={`text-sm leading-relaxed ${i === activeSegment ? 'text-white' : 'text-white/40'}`}>
                  {item.transcript || "No speech detected for this segment."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
