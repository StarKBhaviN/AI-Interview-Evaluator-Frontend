"use client"
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Brain, Lock, Mail } from 'lucide-react'

export default function AdminLoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (email === 'admin@eval.ai' && password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true')
      window.location.href = '/admin/dashboard'
    } else {
      setError('Invalid admin credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex relative overflow-hidden">
      {/* Left panel — gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/30 animate-pulse-glow">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">AI Interview</h1>
          <h2 className="text-2xl font-semibold text-gradient mb-4">Evaluator</h2>
          <p className="text-white/30 text-sm leading-relaxed max-w-sm mx-auto">
            Intelligent interview assessment platform powered by advanced AI analysis for evaluating candidates with precision.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass rounded-2xl max-w-md w-full p-8 animate-fade-in-up">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">AI Interview Evaluator</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Admin Login</h2>
          <p className="text-white/30 text-sm mb-8">Access the admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-white/50 text-xs font-medium flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email
              </Label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 rounded-xl focus:border-indigo-500/40 focus:bg-white/[0.06] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/50 text-xs font-medium flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Password
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 rounded-xl focus:border-indigo-500/40 focus:bg-white/[0.06] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
