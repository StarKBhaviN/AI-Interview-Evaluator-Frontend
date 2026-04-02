"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Upload, User, Mail, Briefcase, FileText, Brain, ChevronDown, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app.store'

export default function AuthClient() {
  const router = useRouter()
  const setResumeFileStore = useAppStore((state) => state.setResumeFile)
  const setUserStore = useAppStore((state) => state.setUser)
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Candidate' as 'Candidate' | 'Client',
    company: '',
  })
  const [resumeFile, setResumeFileLocal] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already logged in
    const registered = localStorage.getItem('registeredUsers')
    const currentUser = sessionStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      setUserStore(user)
      redirectBasedOnRole(user.role)
    }
  }, [router, setUserStore])

  const redirectBasedOnRole = (role: string) => {
    if (role === 'Admin') router.push('/admin/dashboard')
    else if (role === 'Client') router.push('/client/dashboard')
    else router.push('/dashboard')
  }

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Invalid credentials')
      }

      const data = await response.json()
      setUserStore(data.user)
      redirectBasedOnRole(data.user.role)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.role === 'Candidate' && !resumeFile) {
      setError('Please upload your resume to register.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          company: formData.company
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Registration failed')
      }

      const data = await response.json()
      setUserStore(data.user)
      
      if (resumeFile && formData.role === 'Candidate') {
        setResumeFileStore(resumeFile)
        router.push('/resume-parsing')
      } else {
        redirectBasedOnRole(data.user.role)
      }
    } catch (err: any) {
      setError(err.message)
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
      {/* Dynamic Background Orbs */}
      <div className={`absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl transition-colors duration-1000 ${formData.role === 'Client' ? 'bg-emerald-500/10' : 'bg-indigo-500/10'}`} />
      <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl transition-colors duration-1000 ${formData.role === 'Client' ? 'bg-teal-500/10' : 'bg-purple-500/10'}`} />

      <div className="glass rounded-[2.5rem] max-w-lg w-full animate-fade-in-up overflow-hidden border border-white/[0.06] shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b border-white/[0.06]">
          <button 
            type="button"
            onClick={() => { setMode('signin'); setError('') }}
            className={`flex-1 py-6 text-xs font-black tracking-[0.2em] uppercase transition-all ${mode === 'signin' ? 'text-white bg-white/[0.02]' : 'text-white/20 hover:text-white/40'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setMode('signup'); setError('') }}
            className={`flex-1 py-6 text-xs font-black tracking-[0.2em] uppercase transition-all ${mode === 'signup' ? 'text-white bg-white/[0.02]' : 'text-white/20 hover:text-white/40'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div className="p-10">
          <div className="flex items-center gap-5 mb-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
              formData.role === 'Client' 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20' 
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20'
            }`}>
              {mode === 'signin' ? <ShieldCheck className="w-7 h-7 text-white" /> : <Brain className="w-7 h-7 text-white" />}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h1>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.15em] mt-1">
                {mode === 'signin' ? 'Secure Authentication' : 'Advanced Platform Access'}
              </p>
            </div>
          </div>

          <form onSubmit={mode === 'signin' ? handleSignin : handleSignup} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">What you want to be?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['Candidate', 'Client'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: r })}
                        className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.role === r 
                            ? 'bg-white text-black border-white' 
                            : 'bg-white/[0.02] text-white/20 border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Full Name</Label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/10 rounded-2xl p-6 focus:border-indigo-500/50 transition-all font-medium h-14"
                  />
                </div>

                {formData.role === 'Client' && (
                  <div className="space-y-2 pt-2">
                    <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Company Name <span className="text-white/20">(optional)</span></Label>
                    <Input
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/10 rounded-2xl p-6 focus:border-emerald-500/50 transition-all font-medium h-14"
                    />
                  </div>
                )}
              </>
            )}


            <div className="space-y-2">
              <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Email Address</Label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/10 rounded-2xl p-6 focus:border-indigo-500/50 transition-all font-medium h-14"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/10 rounded-2xl p-6 focus:border-indigo-500/50 transition-all font-medium h-14"
              />
            </div>

            {mode === 'signup' && formData.role === 'Candidate' && (
              <div className="space-y-2 pt-2">
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
                    <p className="text-[10px] text-white/20 mt-2 font-black uppercase tracking-widest leading-none">PDF Only (Max 10MB)</p>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 ${
                formData.role === 'Client' 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/20' 
                  : 'bg-white text-black hover:bg-indigo-400 hover:text-black shadow-white/5'
              }`}
            >
              {loading && <Brain className="w-4 h-4 animate-spin" />}
              {mode === 'signin' ? 'Access Dashboard' : loading ? 'Initializing...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
