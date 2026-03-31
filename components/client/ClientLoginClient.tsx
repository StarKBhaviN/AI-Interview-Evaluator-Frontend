"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Brain, Briefcase, Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ClientLoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, allow any client login but set a standard
    if (password.length >= 6) {
      localStorage.setItem('clientLoggedIn', 'true')
      localStorage.setItem('clientData', JSON.stringify({ email }))
      router.push('/client/dashboard')
    } else {
      setError('Password must be at least 6 characters.')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="glass rounded-[2rem] max-w-md w-full animate-fade-in-up overflow-hidden border border-white/[0.06] p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Client Portal</h1>
            <p className="text-white/30 text-xs font-medium">Hiring Manager Login</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Email</Label>
            <Input
              type="email"
              placeholder="hr@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/10 rounded-2xl p-6 focus:border-emerald-500/50 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/10 rounded-2xl p-6 focus:border-emerald-500/50 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-white/5 hover:bg-emerald-400 hover:text-black transition-all active:scale-95"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}
