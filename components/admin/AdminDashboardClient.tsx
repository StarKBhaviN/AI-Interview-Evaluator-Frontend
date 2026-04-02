"use client"
import React, { useState, useEffect, useMemo } from 'react'
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
  ChevronDown,
  Download,
  FileText,
  Filter,
  RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app.store'
import AIModelCenter from './AIModelCenter'

export default function AdminDashboardClient() {
  const router = useRouter()
  const { logout, user: currentUser } = useAppStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'candidates' | 'ai-models'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const [stats, setStats] = useState([
    { label: 'Avg Score', value: '--', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Candidates', value: '--', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Pass Rate', value: '--', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Growth', value: '+0%', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ])
  
  const [candidates, setCandidates] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsRes, candRes, clientRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/stats'),
        fetch('http://localhost:8000/api/admin/sessions'),
        fetch('http://localhost:8000/api/admin/clients')
      ])
      
      const statsData = await statsRes.json()
      const candData = await candRes.json()
      const clientData = await clientRes.json()

      setStats([
        { label: 'Avg Score', value: statsData.avgScore.toString(), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Total Candidates', value: statsData.totalCandidates.toString(), icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'Pass Rate', value: `${statsData.passRate}%`, icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Growth', value: `${statsData.growth >= 0 ? '+' : ''}${statsData.growth}%`, icon: TrendingUp, color: statsData.growth >= 0 ? 'text-emerald-400' : 'text-rose-400', bg: statsData.growth >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10' },
      ])

      setCandidates(candData)
      setClients(clientData)
    } catch (err) {
      console.error('Failed to fetch admin data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const response = await fetch('http://localhost:8000/api/admin/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `platform_report_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed', err)
    } finally {
      setIsExporting(false)
    }
  }

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      c.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [candidates, searchQuery])

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [clients, searchQuery])

  return (
    <div className="min-h-screen bg-[#050510] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/5 via-[#0A0A1F] to-[#050510] text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Navbar */}
        <div className="flex items-center justify-between glass p-4 px-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-rose-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Admin Console</h1>
              <p className="text-rose-400 text-[10px] uppercase tracking-[0.2em] font-black">{currentUser?.name || 'Super Admin'}</p>
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

        {/* Dynamic Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl w-fit">
            {(['overview', 'clients', 'candidates', 'ai-models'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-2 px-6 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-black shadow-lg shadow-white/10' 
                    : 'text-white/40 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab === 'ai-models' ? 'AI Models' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {(activeTab === 'clients' || activeTab === 'candidates') && (
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-2 px-4 w-full md:w-96">
              <Search className="w-4 h-4 text-white/20" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`} 
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/20"
              />
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="glass rounded-[2.5rem] border border-white/[0.06] bg-white/[0.01] overflow-hidden min-h-[400px]">
          {activeTab === 'ai-models' && <AIModelCenter />}
          {activeTab === 'overview' && (
            <div className="p-10 flex flex-col items-center justify-center h-full text-center space-y-8 py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                <div className="relative w-24 h-24 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-indigo-400" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black tracking-tight">Intelligence Reporting</h3>
                <p className="text-white/30 max-w-sm mx-auto text-sm leading-relaxed">
                  Generate comprehensive CSV datasets of platform performance, candidate metrics, and hiring velocity.
                </p>
              </div>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-3 p-4 px-10 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
              >
                {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isExporting ? 'Generating Report...' : 'Export Full Report'}
              </button>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02]">
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Client / Company</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Email Address</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center font-black text-emerald-400 text-xs">
                            {client.company.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-white transition-colors">{client.company}</h4>
                            <p className="text-xs text-white/20">{client.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-white/40">{client.email}</td>
                      <td className="px-8 py-6 text-center">
                         <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                           {client.status}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 rounded-xl hover:bg-white/[0.05] text-white/20 hover:text-white transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-white/20 font-black uppercase tracking-[0.2em] italic">No active clients found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02]">
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Candidate Name</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center">Performance Score</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredCandidates.map((cand) => (
                    <tr key={cand.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => router.push(`/admin/report/${cand.id}`)}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center font-black text-rose-400 text-xs shadow-lg shadow-rose-500/5">
                            {cand.position.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-rose-400 transition-colors">
                              {cand.position} Candidate
                            </h4>
                            <p className="text-xs text-white/20">Ref: {cand.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${cand.score >= 70 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                           {cand.score >= 70 ? 'Eligible' : 'Review Required'} ({cand.score}%)
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 rounded-xl hover:bg-white/[0.05] text-white/20 hover:text-white transition-all transform group-hover:translate-x-1 duration-300">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && !loading && (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center text-white/20 font-black uppercase tracking-[0.2em] italic text-xs">No candidate results available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
