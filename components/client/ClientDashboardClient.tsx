"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { 
  Brain, 
  Plus, 
  Users, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical, 
  Copy, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  Briefcase,
  Zap,
  ArrowUpRight,
  LogOut,
  ChevronDown,
  ChevronUp,
  X,
  Trash2,
  Lock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { 
  getClientMeetings, 
  createClientMeeting, 
  getClientStats, 
  getClientCandidates,
  deleteClientMeeting,
  updateMeetingStatus
} from '@/lib/api'

interface Meeting {
  id: string
  title: string
  code: string
  date: string
  time: string
  candidates: number
  status: 'Open' | 'Closed' | 'Scheduled'
}

interface Candidate {
  id: string
  name: string
  email: string
  interviewName: string
  score: number
  status: string
  date: string
}

export default function ClientDashboardClient() {
  const router = useRouter()
  
  // States
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [stats, setStats] = useState({
    activeInterviews: 0,
    totalCandidates: 0,
    pendingReviews: 0,
    hiringRate: '0%'
  })
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showCandidatesModal, setShowCandidatesModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  
  // Form States
  const [newTitle, setNewTitle] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newJobType, setNewJobType] = useState('Full-time')
  const [newLocation, setNewLocation] = useState('Remote')
  const [newDepartment, setNewDepartment] = useState('Engineering')
  const [newRequirements, setNewRequirements] = useState('')
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const [filterMeetingCode, setFilterMeetingCode] = useState<string | null>(null)
  const [clientInfo, setClientInfo] = useState<any>(null)
  // Questions Modal State
  const [showQuestionsStep, setShowQuestionsStep] = useState(false)
  const [customQuestions, setCustomQuestions] = useState<{text: string, difficulty: string}[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [newQDiff, setNewQDiff] = useState('Medium')
  // Loading guards for action buttons
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  
  // Filter States
  const [candidateSearch, setCandidateSearch] = useState('')
  const [meetingSearch, setMeetingSearch] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof Candidate, direction: 'asc' | 'desc' }>({ 
    key: 'score', 
    direction: 'desc' 
  })

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser')
    if (userStr) {
      const user = JSON.parse(userStr)
      setClientInfo(user)
      setNewCompany(user.company || '')
      fetchData(user.id)
    } else {
      router.push('/')
    }
  }, [])

  const fetchData = async (clientId?: string) => {
    try {
      setLoading(true)
      const targetId = clientId || clientInfo?.id
      const [m, s, c] = await Promise.all([
        getClientMeetings(targetId),
        getClientStats(targetId),
        getClientCandidates(targetId)
      ])
      setMeetings(m)
      setStats(s)
      setCandidates(c)
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showQuestionsStep) {
      setShowQuestionsStep(true)
      return
    }
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const newMeeting = {
      id: Date.now().toString(),
      title: newTitle,
      company: newCompany || clientInfo?.company || '',
      clientId: clientInfo?.id || 'anonymous',
      code,
      date: newDate,
      time: newTime,
      jobType: newJobType,
      location: newLocation,
      department: newDepartment,
      requirements: newRequirements,
      candidates: 0,
      status: 'Open',
      questions: customQuestions.map(q => ({ text: q.text, difficulty: q.difficulty, category: 'Custom' }))
    }
    
    setIsCreating(true)
    try {
      await createClientMeeting(newMeeting)
      setShowCreate(false)
      setShowQuestionsStep(false)
      setNewTitle('')
      setNewCompany(clientInfo?.company || '')
      setNewDate('')
      setNewTime('')
      setNewJobType('Full-time')
      setNewLocation('Remote')
      setNewDepartment('Engineering')
      setNewRequirements('')
      setCustomQuestions([])
      fetchData()
    } catch (err) {
      console.error("Creation error:", err)
      alert("Failed to create interview. Please check if the backend is running.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteMeeting = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this interview posting?')) {
      setLoadingIds(prev => new Set(prev).add(id))
      try {
        await deleteClientMeeting(id)
        fetchData()
      } catch (err) {
        console.error('Failed to delete meeting', err)
      } finally {
        setLoadingIds(prev => { const s = new Set(prev); s.delete(id); return s })
      }
    }
  }

  const handleCloseSlot = async (id: string) => {
    setLoadingIds(prev => new Set(prev).add(`close-${id}`))
    try {
      await updateMeetingStatus(id, 'Closed')
      fetchData()
    } catch (err) {
      console.error('Failed to close slot', err)
    } finally {
      setLoadingIds(prev => { const s = new Set(prev); s.delete(`close-${id}`); return s })
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopySuccess(code)
    setTimeout(() => setCopySuccess(null), 2000)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  // Filtered Meetings
  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(meetingSearch.toLowerCase()) ||
    m.code.toLowerCase().includes(meetingSearch.toLowerCase())
  )

  // Filtered and Sorted Candidates
  const processedCandidates = useMemo(() => {
    let filtered = candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        c.interviewName.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(candidateSearch.toLowerCase())
      
      const matchesMeeting = filterMeetingCode ? (c as any).meetingCode === filterMeetingCode : true
      
      return matchesSearch && matchesMeeting
    })

    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [candidates, candidateSearch, sortConfig])

  const toggleSort = (key: keyof Candidate) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-[#0A0A1F] to-[#050510] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050510] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-[#0A0A1F] to-[#050510] text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Navbar */}
        <div className="flex items-center justify-between glass p-4 px-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Employer Hub</h1>
              <p className="text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-black">Client Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {clientInfo && (
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white">{clientInfo.name}</p>
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">
                  {clientInfo.company || clientInfo.email}
                </p>
              </div>
            )}
            {clientInfo && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-emerald-500/20">
                {clientInfo.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-white/[0.05] text-white/40 hover:text-red-400 transition-all font-bold text-xs flex items-center gap-2"
            >
              Sign Out
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Interviews', value: stats.activeInterviews, icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-500/10', glow: '0 0 20px rgba(99,102,241,0.15)' },
            { label: 'Candidates', value: stats.totalCandidates, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: '0 0 20px rgba(16,185,129,0.15)', actionable: true, onClick: () => setShowCandidatesModal(true) },
            { label: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', glow: '0 0 20px rgba(245,158,11,0.15)' },
            { label: 'Hiring Rate', value: stats.hiringRate, icon: ArrowUpRight, color: 'text-purple-400', bg: 'bg-purple-500/10', glow: '0 0 20px rgba(168,85,247,0.15)' },
          ].map((stat, i) => (
            <div 
              key={i} 
              onClick={stat.onClick}
              className={`glass p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] transition-all ${stat.actionable ? 'cursor-pointer hover:border-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shadow-lg`} style={{boxShadow: stat.glow}}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                {stat.actionable && <ArrowUpRight className="w-4 h-4 text-white/20" />}
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-white tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-2 px-4 flex-1 max-w-md focus-within:border-emerald-500/50 transition-all">
            <Search className="w-5 h-5 text-white/20" />
            <input 
              type="text" 
              value={meetingSearch}
              onChange={(e) => setMeetingSearch(e.target.value)}
              placeholder="Search interviews or codes..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/20"
            />
          </div>
          <button 
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-3 p-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" />
            Create New Interview
          </button>
        </div>

        {/* Interviews Table */}
        <div className="glass rounded-[2.5rem] border border-white/[0.06] bg-white/[0.01] overflow-visible pb-24">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Interview Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Meeting Code</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center">Candidates</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredMeetings.length > 0 ? filteredMeetings.map((meeting) => (
                <tr key={meeting.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{meeting.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> {meeting.date}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {meeting.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => copyToClipboard(meeting.code)}
                      className="inline-flex items-center gap-3 p-2 px-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/30 transition-all font-mono text-sm group/code active:scale-95"
                    >
                      <span className="text-white/70 group-hover/code:text-white">{meeting.code}</span>
                      {copySuccess === meeting.code ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/20 group-hover/code:text-emerald-400 transition-colors" />
                      )}
                    </button>
                  </td>
                  {/* Status Badge Column */}
                  <td className="px-8 py-6 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      meeting.status === 'Open'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10'
                        : meeting.status === 'Closed'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {meeting.status}
                    </span>
                  </td>
                  {/* Candidates Column */}
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => {
                        setFilterMeetingCode(meeting.code)
                        setShowCandidatesModal(true)
                      }}
                      className="inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-emerald-400 transition-colors p-2 rounded-xl hover:bg-white/[0.03]"
                    >
                      <Users className="w-4 h-4 text-white/20 group-hover:text-emerald-400" />
                      {meeting.candidates}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="relative group/menu">
                      <button className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/20 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl border border-white/[0.1] shadow-2xl py-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100]">
                        {meeting.status !== 'Closed' && (
                          <button 
                            onClick={() => handleCloseSlot(meeting.id)}
                            disabled={loadingIds.has(`close-${meeting.id}`)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-white/60 hover:text-amber-400 hover:bg-white/[0.05] transition-all disabled:opacity-40"
                          >
                            {loadingIds.has(`close-${meeting.id}`) ? (
                              <div className="w-3.5 h-3.5 border border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                            {loadingIds.has(`close-${meeting.id}`) ? 'Closing...' : 'Close Slot'}
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          disabled={loadingIds.has(meeting.id)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-white/60 hover:text-red-400 hover:bg-white/[0.05] transition-all disabled:opacity-40"
                        >
                          {loadingIds.has(meeting.id) ? (
                            <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          {loadingIds.has(meeting.id) ? 'Deleting...' : 'Delete Posting'}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-white/20 font-bold text-sm">
                    No interviews found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidates Modal (Drill-down) */}
      {showCandidatesModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4 md:p-10 overflow-hidden">
          <div className="glass w-full max-w-6xl h-full max-h-[90vh] rounded-[3rem] border border-white/[0.1] bg-[#0A0A0F] flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="p-8 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {filterMeetingCode ? `Results for ${meetings.find(m => m.code === filterMeetingCode)?.title}` : 'Company Performance'}
                  </h3>
                  <p className="text-white/40 text-xs font-medium">Detailed breakdown of all interview attempts</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowCandidatesModal(false)
                  setFilterMeetingCode(null)
                }}
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-white/40 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="px-8 py-6 bg-white/[0.01] flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-2 px-4 flex-1 w-full">
                <Search className="w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  placeholder="Search by name, interview, or email..." 
                  className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/20"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-white/40 px-4">
                <Filter className="w-4 h-4" />
                <span>Showing {processedCandidates.length} results</span>
              </div>
            </div>

            {/* Modal Content - Table */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-[#0A0A0F] z-10">
                  <tr className="border-b border-white/[0.06]">
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/20">Candidate</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/20">Applied For</th>
                    <th 
                      className="py-4 text-[10px] font-black uppercase tracking-widest text-white/20 cursor-pointer hover:text-emerald-400 transition-colors"
                      onClick={() => toggleSort('score')}
                    >
                      <div className="flex items-center gap-2">
                        Performance Score
                        {sortConfig.key === 'score' && (
                          sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {processedCandidates.map((cand) => (
                    <tr key={cand.id} className="group hover:bg-white/[0.01]">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/[0.1] flex items-center justify-center text-[10px] font-black text-white/40">
                            {cand.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{cand.name}</p>
                            <p className="text-[10px] text-white/20">{cand.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="text-xs font-medium text-white/60">{cand.interviewName}</span>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${cand.score >= 80 ? 'bg-emerald-500' : cand.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${cand.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-white">{cand.score}%</span>
                        </div>
                      </td>
                      <td className="py-5 text-right">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                          {cand.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-6">
          <div className={`glass w-full rounded-[2rem] border border-white/[0.1] bg-[#0A0A0F] p-8 animate-scale-in ${showQuestionsStep ? 'max-w-2xl' : 'max-w-md'}`}>
            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{showQuestionsStep ? 'Manage Interview Questions' : 'New Interview Slot'}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${!showQuestionsStep ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    <div className={`w-2 h-2 rounded-full ${showQuestionsStep ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    <span className="text-[10px] text-white/30 ml-1">{showQuestionsStep ? 'Step 2 of 2' : 'Step 1 of 2'}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowCreate(false); setShowQuestionsStep(false); setCustomQuestions([]) }}
                  className="p-2 rounded-xl hover:bg-white/[0.05] text-white/20 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateMeeting} className="space-y-5">
                {!showQuestionsStep ? (
                  // Step 1: Interview Details
                  <>
                    <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Position Title</label>
                        <input 
                          type="text" 
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. Senior Backend Engineer" 
                          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500 outline-none transition-all placeholder:text-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Department</label>
                        <input 
                          type="text" 
                          required
                          value={newDepartment}
                          onChange={(e) => setNewDepartment(e.target.value)}
                          placeholder="e.g. Engineering" 
                          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500 outline-none transition-all placeholder:text-white/10"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Job Type</label>
                        <select 
                          value={newJobType}
                          onChange={(e) => setNewJobType(e.target.value)}
                          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500 outline-none transition-all text-sm [color-scheme:dark]"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Location</label>
                        <select 
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500 outline-none transition-all text-sm [color-scheme:dark]"
                        >
                          <option value="Remote">Remote</option>
                          <option value="On-site">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Specific Requirements (Optional)</label>
                      <textarea 
                        value={newRequirements}
                        onChange={(e) => setNewRequirements(e.target.value)}
                        placeholder="Key skills, tech stack, or specific experience required..." 
                        rows={2}
                        className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500 outline-none transition-all placeholder:text-white/10 text-sm resize-none"
                      />
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Date</label>
                        <input 
                          type="date" 
                          required
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500 outline-none transition-all text-sm [color-scheme:dark]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Time</label>
                        <input 
                          type="time" 
                          required
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500 outline-none transition-all text-sm [color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Next: Add Questions →
                    </button>
                  </>
                ) : (
                  // Step 2: Questions Management
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-sm">
                          <span className="font-bold text-white">{newTitle}</span>
                          <span className="text-white/40 mx-2">·</span>
                          <span className="text-white/40">{newCompany}</span>
                        </div>
                      </div>

                      {/* Add Question Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          placeholder="Type a question for candidates..."
                          className="flex-1 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500 outline-none text-sm placeholder:text-white/20 transition-all"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newQuestion.trim()) {
                              e.preventDefault()
                              setCustomQuestions(prev => [...prev, { text: newQuestion.trim(), difficulty: newQDiff }])
                              setNewQuestion('')
                            }
                          }}
                        />
                        <select
                          value={newQDiff}
                          onChange={(e) => setNewQDiff(e.target.value)}
                          className={`p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs outline-none [color-scheme:dark] ${
                            newQDiff === 'Easy' ? 'text-emerald-400' :
                            newQDiff === 'Hard' ? 'text-red-400' :
                            'text-amber-400'
                          }`}
                        >
                          <option value="Easy" className="text-emerald-400">Easy</option>
                          <option value="Medium" className="text-amber-400">Medium</option>
                          <option value="Hard" className="text-red-400">Hard</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            if (newQuestion.trim()) {
                              setCustomQuestions(prev => [...prev, { text: newQuestion.trim(), difficulty: newQDiff }])
                              setNewQuestion('')
                            }
                          }}
                          className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-all flex-shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Questions List */}
                      <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
                        {customQuestions.length === 0 ? (
                          <div className="text-center py-8 text-white/20 text-sm">
                            <p className="font-bold">No custom questions added</p>
                            <p className="text-xs mt-1">You can skip this — default AI questions will be used</p>
                          </div>
                        ) : (
                          customQuestions.map((q, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] group">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg mt-0.5 flex-shrink-0 ${
                                q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                q.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' :
                                'bg-amber-500/10 text-amber-400'
                              }`}>{q.difficulty}</span>
                              <span className="text-sm text-white/70 flex-1">{q.text}</span>
                              <button
                                type="button"
                                onClick={() => setCustomQuestions(prev => prev.filter((_, idx) => idx !== i))}
                                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowQuestionsStep(false)}
                        className="flex-1 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white/40 font-bold text-sm hover:bg-white/[0.06] transition-all"
                      >
                        ← Back
                      </button>
                      <button 
                        type="submit"
                        disabled={isCreating}
                        className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                      >
                        {isCreating ? (
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Create & Generate Code'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
