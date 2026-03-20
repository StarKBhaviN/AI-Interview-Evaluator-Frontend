"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Loader2, FileText, X, Plus, Sparkles } from 'lucide-react'

interface Skill {
  id: string
  name: string
}

export default function ResumeParsingClient() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [extractedSkills, setExtractedSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setExtractedSkills([
        { id: '1', name: 'React' },
        { id: '2', name: 'TypeScript' },
        { id: '3', name: 'Node.js' },
        { id: '4', name: 'REST APIs' },
        { id: '5', name: 'Git' },
        { id: '6', name: 'Agile' },
        { id: '7', name: 'Problem Solving' },
        { id: '8', name: 'Communication' },
      ])
      setIsProcessing(false)
    }, 2500)
  }, [])

  const removeSkill = (id: string) => {
    setExtractedSkills((prev) => prev.filter((s) => s.id !== id))
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setExtractedSkills((prev) => [...prev, { id: Date.now().toString(), name: newSkill.trim() }])
      setNewSkill('')
    }
  }

  const handleConfirm = () => {
    localStorage.setItem('extractedSkills', JSON.stringify(extractedSkills))
    window.location.href = '/instructions'
  }

  const candidateName = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('candidateData') || '{}').name || 'Resume'
    : 'Resume'

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />

      <div className="glass rounded-2xl max-w-2xl w-full animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/[0.06] px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Resume Analysis</h1>
              <p className="text-white/40 text-xs">AI is extracting your skills and experience</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {isProcessing ? (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                </div>
                <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Analyzing Resume</h2>
              <p className="text-white/40 text-sm">AI is reading and extracting key information…</p>
              <div className="mt-6 space-y-2 max-w-xs mx-auto">
                {['Scanning document…', 'Extracting skills…', 'Identifying experience…'].map((s, i) => (
                  <div key={i} className="h-3 rounded-full animate-shimmer bg-white/[0.04]" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Resume preview */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{candidateName}.pdf</p>
                  <p className="text-emerald-400 text-xs mt-0.5">✓ Successfully parsed</p>
                </div>
                <span className="text-white/20 text-xs">2 pages</span>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white/70">Extracted Skills</h3>
                  <span className="text-xs text-white/30">{extractedSkills.length} skills found</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill, index) => (
                    <div
                      key={skill.id}
                      className="group flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-300 transition-all duration-200 cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => removeSkill(skill.id)}
                    >
                      {skill.name}
                      <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>

                {/* Add skill */}
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill…"
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/40 transition-all"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Confirm & Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
