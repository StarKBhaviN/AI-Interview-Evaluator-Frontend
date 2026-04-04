"use client"
import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Filter,
  ArrowLeft,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  X,
  MapPin,
  Clock,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getClientMeetings } from '@/lib/api'
import { useAppStore } from '@/store/app.store'

export default function MarketplaceClient() {
  const router = useRouter()
  const { user: currentUser } = useAppStore()

  // Data State
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // View State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true)
        const data = await getClientMeetings()
        setMeetings(data)
      } catch (err) {
        console.error('Failed to fetch meetings', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMeetings()
  }, [])

  // Derive unique values for filters
  const departments = useMemo(() => ['All', ...Array.from(new Set(meetings.map(m => m.department).filter(Boolean)))], [meetings])
  const locations = useMemo(() => ['All', ...Array.from(new Set(meetings.map(m => m.location).filter(Boolean)))], [meetings])
  const jobTypes = useMemo(() => ['All', ...Array.from(new Set(meetings.map(m => m.jobType).filter(Boolean)))], [meetings])

  // Filter Logic
  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.company?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDept = selectedDepartment === 'All' || m.department === selectedDepartment
      const matchesLoc = selectedLocation === 'All' || m.location === selectedLocation
      const matchesType = selectedType === 'All' || m.jobType === selectedType

      return matchesSearch && matchesDept && matchesLoc && matchesType
    })
  }, [meetings, searchQuery, selectedDepartment, selectedLocation, selectedType])

  const handleApply = (meeting: any) => {
    if (currentUser) {
      const updatedCandidate = { ...currentUser, position: meeting.title }
      localStorage.setItem('candidateData', JSON.stringify(updatedCandidate))
      localStorage.setItem('currentMeetingCode', meeting.code)
    }
    router.push('/waiting-room')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050510] bg-mesh text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] transition-all group"
            >
              <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Interview Marketplace</h1>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Explore {meetings.length} live opportunities</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white/20 hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'text-white/20 hover:text-white'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 p-3 px-5 rounded-2xl border transition-all text-sm font-bold ${showFilters ? 'bg-indigo-500 border-indigo-400' : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="glass p-8 rounded-[2.5rem] border border-indigo-500/20 bg-indigo-500/[0.02] animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Search */}
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-white/30 ml-1">Search Keywords</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Role or Company..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 pl-12 text-sm focus:border-indigo-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-white/30 ml-1">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-sm focus:border-indigo-500/50 outline-none transition-all"
                >
                  {departments.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-white/30 ml-1">Location Type</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-sm focus:border-indigo-500/50 outline-none transition-all"
                >
                  {locations.map(l => <option key={l} value={l} className="text-black">{l}</option>)}
                </select>
              </div>

              {/* Job Type */}
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-white/30 ml-1">Job Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-sm focus:border-indigo-500/50 outline-none transition-all"
                >
                  {jobTypes.map(t => <option key={t} value={t} className="text-black">{t}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                Showing {filteredMeetings.length} results
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('All');
                  setSelectedLocation('All');
                  setSelectedType('All');
                }}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-all flex items-center gap-2"
              >
                <X className="w-3 h-3" />
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Grid/List */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredMeetings.map((meeting) => (
            viewMode === 'grid' ? (
              <div
                key={meeting.id}
                className="glass group p-8 rounded-[2.5rem] border border-white/[0.06] bg-white/[0.01] hover:border-indigo-500/30 transition-all flex flex-col justify-between h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                  <Briefcase className="w-24 h-24 rotate-12" />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/20 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {meeting.jobType || 'Full-time'}
                      </span>
                      <span className="text-[9px] font-bold text-white/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meeting.date}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                      {meeting.title}
                    </h3>
                    <p className="text-xs font-black uppercase tracking-[0.15em] text-white/30 italic">
                      {meeting.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold text-white/40">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {meeting.location}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold text-white/40">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      {meeting.department}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleApply(meeting)}
                  className="w-full mt-8 py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
                >
                  Launch Session
                </button>
              </div>
            ) : (
              <div
                key={meeting.id}
                className="glass group p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] hover:border-indigo-500/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-8">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/10 group-hover:text-indigo-400 transition-all">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{meeting.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">{meeting.company}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-xs text-white/20">{meeting.department}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-xs text-white/20">{meeting.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/40">
                    {meeting.jobType}
                  </span>
                  <button
                    onClick={() => handleApply(meeting)}
                    className="p-3 px-8 rounded-2xl bg-indigo-500 hover:bg-white text-white hover:text-black font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    Start
                  </button>
                </div>
              </div>
            )
          ))}

          {filteredMeetings.length === 0 && (
            <div className="col-span-full py-32 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto opacity-20">
                <Search className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white/40">No matching opportunities</h3>
                <p className="text-sm text-white/20">Try adjusting your filters or search keywords</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
