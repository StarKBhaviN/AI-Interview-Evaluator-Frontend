"use client"
import React, { useEffect, useState } from 'react'
import { 
  Brain, 
  History, 
  Play, 
  LogOut, 
  Calendar, 
  Trophy, 
  User, 
  ChevronRight,
  TrendingUp,
  FileText,
  X as CloseIcon,
  Volume2,
  Briefcase,
  Clock,
  ArrowUpRight,
  Sparkles,
  Shield
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { convertFileSrc } from '@tauri-apps/api/core'

interface InterviewHistoryItem {
  id: string
  date: string
  position: string
  score: number
  questionsCount: number
  warnings?: {time: string, flags: string[]}[]
  details: any[]
}

const AVAILABLE_ROLES = [
  { id: '1', title: 'Senior Full Stack Engineer', company: 'TechFlow Systems', department: 'Engineering', type: 'Full-time' },
  { id: '2', title: 'Product UI Designer', company: 'Creative Studio', department: 'Design', type: 'Contract' },
  { id: '3', title: 'AI Solutions Architect', company: 'BrainCore AI', department: 'R&D', type: 'Full-time' },
]

const SCHEDULED_MEETINGS = [
  { id: '1', title: 'Technical Interview', company: 'TechFlow Systems', date: 'March 30, 2026', time: '10:00 AM' },
  { id: '2', title: 'HR Screening', company: 'Creative Studio', date: 'April 2, 2026', time: '02:30 PM' },
]

import { getClientMeetings } from '@/lib/api'

export default function DashboardClient() {
  const router = useRouter()
  const [candidate, setCandidate] = useState<any>(null)
  const [history, setHistory] = useState<InterviewHistoryItem[]>([])
  const [selectedHistory, setSelectedHistory] = useState<InterviewHistoryItem | null>(null)
  const [meetingCode, setMeetingCode] = useState('')
  const [joinError, setJoinError] = useState('')

  const [availableMeetings, setAvailableMeetings] = useState<any[]>([])
  const [showPracticeConfirm, setShowPracticeConfirm] = useState(false)

  useEffect(() => {
    const storedCandidate = localStorage.getItem('candidateData')
    const sessionUser = sessionStorage.getItem('currentUser')
    const storedHistory = localStorage.getItem('interviewHistory')

    if (storedCandidate || sessionUser) {
      const userData = sessionUser ? JSON.parse(sessionUser) : JSON.parse(storedCandidate!)
      setCandidate(userData)
      if (!storedCandidate) {
        localStorage.setItem('candidateData', JSON.stringify(userData))
      }
    } else {
      router.push('/')
    }

    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }

    // Fetch dynamic meetings
    const fetchMeetings = async () => {
      try {
        const meetings = await getClientMeetings()
        setAvailableMeetings(meetings)
      } catch (err) {
        console.error('Failed to fetch meetings', err)
      }
    }
    fetchMeetings()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('candidateData')
    localStorage.removeItem('interviewHistory')
    localStorage.removeItem('interviewResults')
    localStorage.removeItem('interviewQuestions')
    router.push('/')
  }

  const handleStartPractice = () => {
    setShowPracticeConfirm(true)
  }

  const confirmPractice = () => {
    router.push('/waiting-room')
  }

  const handleApply = (meeting: any) => {
    if (candidate) {
      const updatedCandidate = { ...candidate, position: meeting.title }
      
      // 1. Update active session
      localStorage.setItem('candidateData', JSON.stringify(updatedCandidate))
      localStorage.setItem('currentMeetingCode', meeting.code) // Track which meeting is active
      setCandidate(updatedCandidate)

      // 2. Update global registered list (legacy compatibility)
      const registered = localStorage.getItem('registeredCandidates')
      if (registered) {
        const users = JSON.parse(registered)
        const updatedUsers = users.map((u: any) => u.email === candidate.email ? updatedCandidate : u)
        localStorage.setItem('registeredCandidates', JSON.stringify(updatedUsers))
      }
    }
    router.push('/waiting-room')
  }

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setJoinError('')
    
    try {
      const globalMeetings = await getClientMeetings()
      const meeting = globalMeetings.find((m: any) => m.code.toUpperCase() === meetingCode.toUpperCase())
      
      if (meeting) {
        // Pre-fill position from meeting
        const updatedCandidate = { ...candidate, position: meeting.title }
        localStorage.setItem('candidateData', JSON.stringify(updatedCandidate))
        localStorage.setItem('currentMeetingCode', meeting.code) // Store meeting code for session submission
        router.push('/waiting-room')
        return
      }
    } catch (err) {
      console.error('Failed to join meeting', err)
    }
    
    setJoinError('Invalid meeting code. Please check and try again.')
  }

  if (!candidate) return null

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navbar */}
        <div className="flex items-center justify-between glass p-4 px-6 rounded-2xl border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">AI Interviewer</h1>
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Candidate Portal</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 px-4 rounded-xl hover:bg-white/[0.05] transition-all text-white/40 hover:text-red-400 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/[0.06] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all">
              <User className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                Welcome Back
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                {candidate.name}
              </h2>
              <p className="text-white/40 max-w-md text-balance leading-relaxed">
                {candidate.position && candidate.position !== 'Unspecified' ? (
                  <>
                    You are currently tracking for <span className="text-white/70 font-semibold">{candidate.position}</span>. 
                    Improve your readiness with a simulated session or explore formal roles below.
                  </>
                ) : (
                  <>
                    You haven&apos;t selected a position yet. Choose an opportunity from the 
                    <span className="text-white/70 font-semibold"> Marketplace</span> below or start a practice session.
                  </>
                )}
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <button 
                  onClick={handleStartPractice}
                  className="flex items-center gap-3 p-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-sm shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Take Practice Interview
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/[0.06] flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Best Performance</h3>
              <div className="text-5xl font-black text-emerald-400 italic tabular-nums">
                {history.length > 0 ? Math.max(...history.map((h: InterviewHistoryItem) => h.score)) : '--'}
                <span className="text-xl text-white/20 not-italic ml-1 font-bold">/100</span>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-2 text-white/40 text-sm relative z-10">
              <TrendingUp className="w-4 h-4" />
              <span>Higher than 82% of candidates</span>
            </div>
          </div>
        </div>

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Job Marketplace (Client Postings) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Available Opportunities</h3>
                    <p className="text-white/30 text-xs">Interviews posted by official clients</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {availableMeetings.map((meeting) => (
                  <div 
                    key={meeting.id || meeting.code}
                    className="glass group p-5 rounded-2xl border border-white/[0.06] hover:border-indigo-500/30 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.08] text-white/20 group-hover:text-indigo-400 transition-colors">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex flex-col">
                        <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{meeting.title}</h4>
                        <span className="text-[10px] text-indigo-400/60 font-black uppercase tracking-widest">{meeting.company || 'Global Recruitment'}</span>
                      </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-indigo-400/80 font-medium">{meeting.company || 'TechFlow Systems'}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="text-xs text-white/30">{meeting.department || 'Engineering'}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-white/40 border border-white/[0.08]">{meeting.type || 'Full-time'}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApply(meeting)}
                      className="p-3 px-5 rounded-xl bg-white/[0.04] hover:bg-indigo-500 text-white/60 hover:text-white border border-white/[0.08] hover:border-indigo-400 font-bold text-xs transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
                {availableMeetings.length === 0 && (
                  <div className="text-center py-10 glass rounded-2xl border border-white/[0.04]">
                    <p className="text-white/20 text-sm font-medium">No live opportunities at the moment.</p>
                  </div>
                )}
              </div>
            </div>

            {/* History Table */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/[0.08]">
                    <History className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Past Performances</h3>
                    <p className="text-white/30 text-xs">Review your interview records and transcripts</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl border border-white/[0.06] overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/30">Date</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/30">Position</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/30 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {history.length > 0 ? history.map((item: InterviewHistoryItem) => (
                      <tr 
                        key={item.id} 
                        onClick={() => setSelectedHistory(item)}
                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-white/20" />
                            <span className="text-sm font-medium text-white/70">
                              {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold text-white/90">{item.position}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <span className={`text-lg font-bold tabular-nums ${item.score >= 80 ? 'text-emerald-400' : item.score >= 60 ? 'text-indigo-400' : 'text-amber-400'}`}>
                              {item.score}
                            </span>
                            <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.02] flex items-center justify-center border border-white/[0.06]">
                              <FileText className="w-6 h-6 text-white/10" />
                            </div>
                            <p className="text-white/20 text-xs font-medium">No interview history available</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-12">
            
            {/* Join by Code Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Play className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Quick Join</h3>
                  <p className="text-white/30 text-xs">Enter a meeting code to start</p>
                </div>
              </div>

              <form onSubmit={handleJoinByCode} className="space-y-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                    placeholder="Enter Code (e.g. TECH-X1)" 
                    className="w-full p-4 pl-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500/50 outline-none transition-all placeholder:text-white/10 uppercase tracking-widest font-mono text-sm"
                  />
                  <Shield className="w-4 h-4 text-white/10 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                {joinError && (
                  <p className="text-rose-400 text-[10px] font-bold uppercase tracking-wider ml-1 animate-shake">
                    {joinError}
                  </p>
                )}
                <button 
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-white/5 hover:bg-emerald-400 hover:text-black transition-all active:scale-95"
                >
                  Join Meeting
                </button>
              </form>
            </div>

            {/* Scheduled Meetings */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Meetings</h3>
                  <p className="text-white/30 text-xs">Upcoming scheduled sessions</p>
                </div>
              </div>

              <div className="space-y-4">
                {SCHEDULED_MEETINGS.map((meeting) => (
                  <div key={meeting.id} className="glass p-5 rounded-3xl border border-white/[0.06] relative overflow-hidden group hover:border-purple-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:opacity-10 transition-all scale-150">
                      <Calendar className="w-12 h-12" />
                    </div>
                    <div className="relative z-10 space-y-3">
                      <h4 className="font-bold text-white/90">{meeting.title}</h4>
                      <p className="text-xs text-purple-400 font-semibold">{meeting.company}</p>
                      <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-2 text-[11px] text-white/30">
                          <Calendar className="w-3 h-3" />
                          {meeting.date}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-white/30">
                          <Clock className="w-3 h-3" />
                          {meeting.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* History Detail Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-10 overflow-y-auto">
          <div className="glass max-w-4xl w-full rounded-3xl border border-white/[0.06] overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <History className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedHistory.position} Interview</h3>
                  <p className="text-white/40 text-xs">{new Date(selectedHistory.date).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedHistory(null)}
                className="p-2 rounded-xl hover:bg-white/[0.05] text-white/40 hover:text-white transition-all outline-none"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Overall Performance', value: selectedHistory.score, color: 'text-indigo-400' },
                  { label: 'Questions Attempted', value: selectedHistory.questionsCount, color: 'text-white' },
                  { label: 'Status', value: 'Analyzed', color: 'text-emerald-400' }
                ].map((stat, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-white/30 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Proctoring Timeline (New Section) */}
              {selectedHistory.warnings && selectedHistory.warnings.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pl-1">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white/30">Proctoring Incident Report</h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-widest">
                      {selectedHistory.warnings.length} Incidents
                    </span>
                  </div>
                  <div className="glass rounded-[2rem] border border-white/[0.04] overflow-hidden">
                    <div className="divide-y divide-white/[0.04]">
                      {selectedHistory.warnings.map((log: any, idx: number) => (
                        <div key={idx} className="p-4 px-6 flex items-start gap-6 hover:bg-white/[0.02] transition-colors group">
                          <div className="flex flex-col items-center gap-3 pt-2">
                             <div className="text-sm font-black font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                                {log.time}
                             </div>
                             <div className="w-[2px] h-full bg-white/10 group-last:hidden" />
                          </div>
                          <div className="flex-1 py-1">
                             <div className="flex flex-wrap gap-2.5 mb-2">
                                {log.flags.map((flag: string, fIdx: number) => (
                                  <span key={fIdx} className="text-xs font-black uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg">
                                    {flag}
                                  </span>
                                ))}
                             </div>
                             <p className="text-sm text-white/40 font-semibold tracking-wide">AI Proctoring System Incident Flag</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Drilldown */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/30 pl-1">Detailed Transcript Review</h4>
                {selectedHistory.details.map((detail: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Record {idx + 1}</span>
                        <h5 className="text-md font-bold text-white/90">
                          {detail.questionText || `Question ${idx + 1}`}
                        </h5>
                      </div>
                      <div className="flex gap-2">
                        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                           Rel: {Math.round(detail.relevance_score * 100)}%
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                           Conf: {Math.round(detail.confidence_score * 100)}%
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black/20 border border-white/[0.04] italic text-white/50 text-sm leading-relaxed">
                      &quot;{detail.transcript}&quot;
                    </div>

                    {/* Audio Player */}
                    {detail.audioPath && (
                      <div className="pt-2">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <Volume2 className="w-4 h-4 text-white/40" />
                          <audio controls src={convertFileSrc(detail.audioPath)} className="flex-1 h-8 invert opacity-80" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Practice Confirmation Modal */}
      {showPracticeConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[70] flex items-center justify-center p-6">
          <div className="glass max-w-md w-full rounded-[2.5rem] border border-white/[0.1] bg-[#0A0A0F] p-10 animate-scale-in text-center space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">Ready for a Practice Session?</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                This will start a mock interview to help you prepare. Your performance will be recorded in your history, but won&apos;t be visible to employers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button 
                onClick={() => setShowPracticeConfirm(false)}
                className="py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white/40 font-bold text-xs uppercase tracking-widest hover:bg-white/[0.06] hover:text-white transition-all"
              >
                Go Back
              </button>
              <button 
                onClick={confirmPractice}
                className="py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Start Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

