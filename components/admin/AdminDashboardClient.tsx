"use client"
import React, { useState } from 'react'
import { 
  Shield, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Plus, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  LogOut,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminDashboardClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'candidates'>('overview')

  const stats = [
    { label: 'Total Clients', value: '24', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Candidates', value: '1,428', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Interviews Completed', value: '3,842', icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Platform Growth', value: '+12%', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ]

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Navbar */}
        <div className="flex items-center justify-between glass p-4 px-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-rose-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Admin Console</h1>
              <p className="text-rose-400 text-[10px] uppercase tracking-[0.2em] font-black">Super Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl hover:bg-white/[0.05] text-white/40 hover:text-red-400 transition-all font-medium flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Live</span>
                </div>
              </div>
              <p className="text-white/40 text-xs font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Dynamic Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl w-fit">
          {(['overview', 'clients', 'candidates'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-2 px-6 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-white/40 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass rounded-[2.5rem] border border-white/[0.06] bg-white/[0.01] overflow-hidden min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="p-10 flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Analytics Engine Active</h3>
                <p className="text-white/30 max-w-sm mx-auto">
                  Monitor all platform metrics, hiring trends, and candidate success rates from this central hub.
                </p>
              </div>
              <button className="flex items-center gap-2 p-3 px-8 rounded-2xl bg-white text-black font-bold text-sm hover:scale-105 transition-all">
                Export Full Report
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{activeTab === 'clients' ? 'Company Name' : 'Candidate Name'}</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl ${activeTab === 'clients' ? 'bg-emerald-500/10' : 'bg-indigo-500/10'} flex items-center justify-center font-bold text-xs`}>
                            {activeTab === 'clients' ? 'C' : 'U'}{i}
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-rose-400 transition-colors">
                              {activeTab === 'clients' ? `TechCorp Solutions ${i}` : `Alex Johnson ${i}`}
                            </h4>
                            <p className="text-xs text-white/20">Active since March 2026</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                           Active
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 rounded-xl hover:bg-white/[0.05] text-white/20 hover:text-white transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
