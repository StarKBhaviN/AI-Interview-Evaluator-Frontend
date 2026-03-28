"use client"
import React, { useState, useEffect } from 'react'
import { Brain, User, Briefcase, Shield, ChevronRight, Sparkles, Zap, ShieldCheck } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const roles = [
    {
      id: 'candidate',
      title: 'For Candidates',
      description: 'Practice interviews, track your progress, and apply for formal roles.',
      icon: User,
      color: 'from-indigo-500 to-purple-600',
      shadow: 'shadow-indigo-500/20',
      href: '/candidate-login',
      featureIcon: Sparkles,
      featureText: 'AI Feedback'
    },
    {
      id: 'client',
      title: 'For Clients',
      description: 'Create interview slots, generate meeting codes, and evaluate talent.',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      href: '/client/dashboard',
      featureIcon: Zap,
      featureText: 'Quick Hiring'
    },
    {
      id: 'admin',
      title: 'For Admins',
      description: 'Monitor platform activity, manage users, and oversee all operations.',
      icon: Shield,
      color: 'from-rose-500 to-orange-600',
      shadow: 'shadow-rose-500/20',
      href: '/admin/dashboard',
      featureIcon: ShieldCheck,
      featureText: 'Full Control'
    }
  ]

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="relative z-10 max-w-5xl w-full text-center space-y-12">
        {/* Header */}
        <div className="space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
            Next-Gen Assessment
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Portal</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium">
            Welcome to the AI Interview Evaluator. Choose the path that matches your needs to get started.
          </p>
        </div>

        {/* Role Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-200">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => window.location.href = role.href}
              className="group relative glass p-8 rounded-[2.5rem] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 text-left flex flex-col h-full hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-2xl ${role.shadow} group-hover:scale-110 transition-transform duration-500`}>
                <role.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-3 flex-1">
                <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all">
                  {role.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors">
                  <role.featureIcon className="w-3 h-3" />
                  {role.featureText}
                </div>
                <div className="w-10 h-10 rounded-full bg-white/[0.04] group-hover:bg-white text-white/20 group-hover:text-black flex items-center justify-center transition-all duration-500">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Brand */}
        <div className="flex items-center justify-center gap-4 text-white/20 animate-fade-in-up delay-400">
          <div className="h-[1px] w-12 bg-white/10" />
          <Brain className="w-6 h-6" />
          <div className="h-[1px] w-12 bg-white/10" />
        </div>
      </div>
    </div>
  )
}

