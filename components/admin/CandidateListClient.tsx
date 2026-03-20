"use client"
import React, { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, ExternalLink, Download, Loader2 } from 'lucide-react'
import { invoke } from '@tauri-apps/api/core'

interface Candidate {
  id: string
  name: string
  role: string
  status: string
  score: number | null
  date: string
}

export default function CandidateListClient() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const data = await invoke<Candidate[]>('get_candidates')
      setCandidates(data)
    } catch (err) {
      console.error('Failed to fetch candidates', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.role.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Candidates</h1>
          <p className="text-white/30 text-sm mt-1">{filtered.length} total candidates</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-white/20 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/40 transition-all w-64"
            />
          </div>
          <div className="flex items-center gap-2 glass p-1 rounded-xl">
            {['All', 'Approved', 'Pending', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === status 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20' 
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/[0.06]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-wider text-center">Candidate</th>
              <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-wider text-center">Applied Role</th>
              <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-wider text-center">Overall Score</th>
              <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-wider text-center">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-white/30 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/10">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-white/90">{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-white/50">{c.role}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                    c.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    c.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {c.score ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden min-w-[60px]">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${c.score}%` }} />
                      </div>
                      <span className="text-sm font-bold text-white/80">{c.score}%</span>
                    </div>
                  ) : (
                    <span className="text-xs text-white/20 italic">Not Evaluated</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-white/40">{new Date(c.date).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.1] text-white/40 hover:text-white transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.1] text-white/40 hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.1] text-white/40 hover:text-white transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
