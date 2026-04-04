"use client"
import React, { useState } from 'react'
import { Plus, Trash2, X, Clock, Gauge, ListChecks } from 'lucide-react'

interface Template {
  id: number
  name: string
  questions: number
  difficulty: string
  timePerQ: number
  strictness: number
}

const initial: Template[] = [
  { id: 1, name: 'Frontend Developer', questions: 5, difficulty: 'Mixed', timePerQ: 180, strictness: 70 },
  { id: 2, name: 'Backend Developer', questions: 5, difficulty: 'Hard', timePerQ: 240, strictness: 85 },
  { id: 3, name: 'Full Stack Developer', questions: 8, difficulty: 'Mixed', timePerQ: 180, strictness: 75 },
]

export default function TemplateManagerClient() {
  const [templates, setTemplates] = useState<Template[]>(initial)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', questions: 5, difficulty: 'Mixed', timePerQ: 180, strictness: 70 })

  const handleCreate = () => {
    setTemplates((prev) => [...prev, { id: Date.now(), ...form }])
    setShowModal(false)
    setForm({ name: '', questions: 5, difficulty: 'Mixed', timePerQ: 180, strictness: 70 })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Interview Templates</h1>
          <p className="text-white/30 text-sm mt-1">{templates.length} templates created</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>

      <div className="grid gap-4">
        {templates.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-5 card-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">{t.name}</h3>
              <button onClick={() => setTemplates((prev) => prev.filter((x) => x.id !== t.id))} className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-red-500/15 hover:border-red-500/20 text-white/30 hover:text-red-400 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-1.5 mb-1">
                  <ListChecks className="w-3 h-3 text-indigo-400" />
                  <span className="text-[11px] text-white/25">Questions</span>
                </div>
                <span className="text-sm font-bold text-white/70">{t.questions}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Gauge className="w-3 h-3 text-amber-400" />
                  <span className="text-[11px] text-white/25">Difficulty</span>
                </div>
                <span className="text-sm font-bold text-white/70">{t.difficulty}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span className="text-[11px] text-white/25">Time/Q</span>
                </div>
                <span className="text-sm font-bold text-white/70">{t.timePerQ}s</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Gauge className="w-3 h-3 text-red-400" />
                  <span className="text-[11px] text-white/25">Strictness</span>
                </div>
                <span className="text-sm font-bold text-white/70">{t.strictness}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass rounded-2xl max-w-lg w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Create Template</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-white/40 mb-1.5 block">Template Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/40 transition-all" placeholder="e.g. Senior React Developer" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-white/40 mb-1.5 block">Questions: {form.questions}</label>
                  <input type="range" min={3} max={15} value={form.questions} onChange={(e) => setForm({ ...form, questions: +e.target.value })} className="w-full accent-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/40 mb-1.5 block">Time/Q: {form.timePerQ}s</label>
                  <input type="range" min={60} max={600} step={30} value={form.timePerQ} onChange={(e) => setForm({ ...form, timePerQ: +e.target.value })} className="w-full accent-indigo-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-white/40 mb-1.5 block">Strictness: {form.strictness}%</label>
                <input type="range" min={0} max={100} value={form.strictness} onChange={(e) => setForm({ ...form, strictness: +e.target.value })} className="w-full accent-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40 mb-1.5 block">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/60 focus:outline-none appearance-none">
                  <option value="Easy" className="text-black">Easy</option>
                  <option value="Medium" className="text-black">Medium</option>
                  <option value="Hard" className="text-black">Hard</option>
                  <option value="Mixed" className="text-black">Mixed</option>
                </select>
              </div>
              <button onClick={handleCreate} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
