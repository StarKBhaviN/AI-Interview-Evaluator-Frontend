"use client"
import React, { useState, useEffect } from 'react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Upload, User, Mail, Briefcase, FileText, Brain } from 'lucide-react'
import { invoke } from '@tauri-apps/api/core'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app.store'

export default function CandidateLoginClient() {
  const router = useRouter()
  const setResumeFile = useAppStore((state) => state.setResumeFile)
  
  useEffect(() => {
    const stored = localStorage.getItem('candidateData')
    if (stored) {
      router.push('/dashboard')
    }
  }, [router])

  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [resumeFile, setResumeFileLocal] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const registered = localStorage.getItem('registeredCandidates')
    if (!registered) {
      setError('No accounts found. Please sign up first.')
      return
    }

    const users = JSON.parse(registered)
    const user = users.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase())
    
    if (user) {
      if (user.password === formData.password) {
        localStorage.setItem('candidateData', JSON.stringify(user))
        router.push('/dashboard')
      } else {
        setError('Incorrect password. Please try again.')
      }
    } else {
      setError('Email not found. Please register.')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resumeFile) {
      setError('Please upload your resume to register.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError('')
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      position: 'Unspecified',
      status: 'Registered',
      date: new Date().toISOString()
    }

    try {
      const registered = localStorage.getItem('registeredCandidates')
      const users = registered ? JSON.parse(registered) : []
      if (users.find((u: any) => u.email === newUser.email)) {
        setError('Email already exists. Please sign in.')
        setLoading(false)
        return
      }
      users.push(newUser)
      localStorage.setItem('registeredCandidates', JSON.stringify(users))
      localStorage.setItem('candidateData', JSON.stringify(newUser))
      if (resumeFile) setResumeFile(resumeFile)
      router.push('/resume-parsing')
    } catch (err) {
      console.error('Failed to register', err)
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === 'application/pdf') {
      setResumeFileLocal(file)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />

      <div className="glass rounded-[2.5rem] max-w-lg w-full animate-fade-in-up overflow-hidden border border-white/[0.06]">
        {/* Tabs */}
        <div className="flex border-b border-white/[0.06]">
          <button 
            type="button"
            onClick={() => { setMode('signin'); setError('') }}
            className={`flex-1 py-5 text-sm font-bold tracking-widest uppercase transition-all ${mode === 'signin' ? 'text-white bg-white/[0.02]' : 'text-white/20 hover:text-white/40'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setMode('signup'); setError('') }}
            className={`flex-1 py-5 text-sm font-bold tracking-widest uppercase transition-all ${mode === 'signup' ? 'text-white bg-white/[0.02]' : 'text-white/20 hover:text-white/40'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div className="p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h1>
              <p className="text-white/30 text-xs font-medium">{mode === 'signin' ? 'Enter your email to continue' : 'Upload your resume to get started'}</p>
            </div>
          </div>

          <form onSubmit={mode === 'signin' ? handleSignin : handleSignup} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider text-center animate-shake">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/10 rounded-2xl p-6 focus:border-indigo-500/50 transition-all font-medium"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/10 rounded-2xl p-6 focus:border-indigo-500/50 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/10 rounded-2xl p-6 focus:border-indigo-500/50 transition-all font-medium"
              />
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Resume (PDF)</Label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    dragOver
                      ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
                      : resumeFile
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-white/10 bg-white/[0.01] hover:border-white/20'
                  }`}
                >
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFileLocal(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer block">
                    <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${resumeFile ? 'text-emerald-400' : 'text-white/10'}`} />
                    <p className={`text-sm font-bold ${resumeFile ? 'text-emerald-300' : 'text-white/40'}`}>
                      {resumeFile ? resumeFile.name : 'Drop your resume here'}
                    </p>
                    <p className="text-[10px] text-white/20 mt-2 font-bold uppercase tracking-wider">PDF Max 10MB</p>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-white/5 hover:bg-indigo-400 hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading && <Brain className="w-4 h-4 animate-spin" />}
              {mode === 'signin' ? 'Access Dashboard' : loading ? 'Creating Account...' : 'Initialize Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
