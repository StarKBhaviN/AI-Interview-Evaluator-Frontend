"use client"
import React, { useState, useEffect } from 'react'
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
  LogOut
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Meeting {
  id: string
  title: string
  code: string
  date: string
  time: string
  candidates: number
  status: 'Open' | 'Closed' | 'Scheduled'
}

export default function ClientDashboardClient() {
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: '1', title: 'Senior Frontend Developer', code: 'TECH-2024-X1', date: '2026-03-30', time: '10:00 AM', candidates: 12, status: 'Open' },
    { id: '2', title: 'AI Research Lead', code: 'AI-CORE-GPT', date: '2026-04-05', time: '02:30 PM', candidates: 5, status: 'Scheduled' },
  ])
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: newTitle,
      code,
      date: newDate,
      time: newTime,
      candidates: 0,
      status: 'Open'
    }
    const updated = [newMeeting, ...meetings]
    setMeetings(updated)
    localStorage.setItem('globalMeetings', JSON.stringify(updated))
    setShowCreate(false)
    setNewTitle('')
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopySuccess(code)
    setTimeout(() => setCopySuccess(null), 2000)
  }

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-10 font-sans">
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
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-white/[0.05] text-white/40 hover:text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Interviews', value: meetings.length, icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { label: 'Candidates', value: '42', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Pending Reviews', value: '8', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Hiring Rate', value: '74%', icon: ArrowUpRight, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">Status</span>
              </div>
              <p className="text-white/40 text-xs font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-2 px-4 flex-1 max-w-md focus-within:border-emerald-500/50 transition-all">
            <Search className="w-5 h-5 text-white/20" />
            <input 
              type="text" 
              placeholder="Search interviews..." 
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
        <div className="glass rounded-[2.5rem] border border-white/[0.06] bg-white/[0.01] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Interview Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Meeting Code</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center">Candidates</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {meetings.map((meeting) => (
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
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-white/60">
                      <Users className="w-4 h-4 text-white/20" />
                      {meeting.candidates}
                    </div>
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
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="glass max-w-md w-full rounded-[2rem] border border-white/[0.1] bg-[#0A0A0F] p-8 animate-scale-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">New Interview Slot</h3>
                <button 
                  onClick={() => setShowCreate(false)}
                  className="p-2 rounded-xl hover:bg-white/[0.05] text-white/20 transition-all"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateMeeting} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Position Title</label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer" 
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500 outline-none transition-all"
                  />
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
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Create & Generate Code
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CloseIcon(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
