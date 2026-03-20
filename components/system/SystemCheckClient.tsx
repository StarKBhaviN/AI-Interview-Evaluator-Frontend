"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Check, X, Loader2, Mic, Camera, Wifi, Volume2, ShieldAlert } from 'lucide-react'

import { invoke } from '@tauri-apps/api/core'

interface CheckItem {
  name: string
  icon: React.ReactNode
  status: 'pending' | 'checking' | 'success' | 'failed'
  detail?: string
}

interface SystemInfo {
  os: String
  arch: String
  cpu_count: number
  total_memory_gb: number
}

export default function SystemCheckClient() {
  const [checks, setChecks] = useState<CheckItem[]>([
    { name: 'Microphone Access', icon: <Mic className="w-5 h-5" />, status: 'pending', detail: 'Required for recording' },
    { name: 'Camera Access', icon: <Camera className="w-5 h-5" />, status: 'pending', detail: 'Required for monitoring' },
    { name: 'Internet Speed', icon: <Wifi className="w-5 h-5" />, status: 'pending', detail: 'Min 2 Mbps required' },
    { name: 'Audio Output', icon: <Volume2 className="w-5 h-5" />, status: 'pending', detail: 'For audio playback' },
    { name: 'Environment', icon: <ShieldAlert className="w-5 h-5" />, status: 'pending', detail: 'Quiet environment needed' },
  ])

  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [allChecked, setAllChecked] = useState(false)
  const [hasFailures, setHasFailures] = useState(false)

  useEffect(() => {
    fetchSystemInfo()
    runChecks()
  }, [])

  const fetchSystemInfo = async () => {
    try {
      const info = await invoke<SystemInfo>('get_system_info')
      setSystemInfo(info)
    } catch (err) {
      console.error('Failed to get system info', err)
    }
  }

  const runChecks = async () => {
    try {
      setChecks((prev) => prev.map((c) => ({ ...c, status: 'checking' })))
      
      const results = await invoke<any[]>('check_hardware')
      
      // Update each check based on results from Rust
      setChecks((prev) => prev.map(check => {
        const result = results.find(r => r.name === check.name)
        return result ? { ...check, status: result.status, detail: result.detail } : check
      }))

      setAllChecked(true)
    } catch (err) {
      console.error('Hardware check failed', err)
      setHasFailures(true)
      setAllChecked(true)
    }
  }

  useEffect(() => {
    if (allChecked) {
      setHasFailures(checks.some((c) => c.status === 'failed'))
    }
  }, [allChecked, checks])

  const handleRetry = () => {
    setAllChecked(false)
    setHasFailures(false)
    setChecks((prev) => prev.map((c) => ({ ...c, status: 'pending' as const })))
    runChecks()
  }

  const successCount = checks.filter((c) => c.status === 'success').length
  const progressValue = (successCount / checks.length) * 100

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh relative overflow-hidden transition-all duration-500">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="glass min-h-screen w-full p-8 md:p-16 flex flex-col animate-fade-in rounded-none border-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-float">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">System Compatibility</h1>
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <span>{systemInfo?.os || 'System'} {systemInfo?.arch}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{systemInfo?.cpu_count} Cores</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{systemInfo?.total_memory_gb}GB RAM</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 min-w-[240px]">
            <div className="flex justify-between text-sm text-white/40 mb-3">
              <span className="font-medium">Total Progress</span>
              <span className="font-bold text-indigo-400">{Math.round(progressValue)}%</span>
            </div>
            <Progress value={progressValue} variant="gradient" size="md" />
            <p className="text-[11px] text-white/20 mt-3 text-center uppercase tracking-widest font-bold">
              {successCount}/{checks.length} Parameters Verified
            </p>
          </div>
        </div>

        {/* Check items Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {checks.map((check, index) => (
            <div
              key={index}
              className={`flex flex-col gap-4 p-6 rounded-2xl transition-all duration-500 card-hover ${
                check.status === 'success'
                  ? 'bg-emerald-500/5 border border-emerald-500/10'
                  : check.status === 'failed'
                  ? 'bg-red-500/5 border border-red-500/10'
                  : check.status === 'checking'
                  ? 'bg-indigo-500/10 border border-indigo-500/20'
                  : 'bg-white/[0.02] border border-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    check.status === 'success'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : check.status === 'failed'
                      ? 'bg-red-500/15 text-red-400'
                      : check.status === 'checking'
                      ? 'bg-indigo-500/15 text-indigo-400'
                      : 'bg-white/[0.04] text-white/30'
                  }`}
                >
                  {check.icon}
                </div>
                <div className="flex-shrink-0">
                  {check.status === 'pending' && <div className="w-6 h-6 rounded-full bg-white/[0.06]" />}
                  {check.status === 'checking' && <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />}
                  {check.status === 'success' && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-scale-in">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {check.status === 'failed' && (
                    <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 animate-scale-in">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-lg ${
                  check.status === 'success' ? 'text-emerald-300' :
                  check.status === 'failed' ? 'text-red-300' :
                  check.status === 'checking' ? 'text-white' : 'text-white/50'
                }`}>
                  {check.name}
                </p>
                <p className="text-sm text-white/25 mt-1 leading-relaxed">{check.detail}</p>
              </div>

              {check.status === 'checking' && (
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-auto">
                  <div className="h-full bg-indigo-500 animate-progress-stripe w-1/2" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        {allChecked && (
          <div className="mt-auto pt-8 flex justify-center animate-fade-in-up">
            <div className="glass-light p-2 rounded-2xl flex gap-4 w-full max-w-2xl border border-white/10 shadow-2xl">
              {hasFailures && (
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="flex-1 h-14 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white rounded-xl text-lg font-bold transition-all"
                >
                  Retry Diagnostics
                </Button>
              )}
              <button
                onClick={() => (window.location.href = '/login')}
                disabled={hasFailures}
                className={`flex-1 h-14 rounded-xl font-bold text-lg transition-all duration-300 ${
                  hasFailures
                    ? 'bg-white/[0.04] text-white/10 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {hasFailures ? 'Configuration Required' : 'Proceed to Candidate Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
