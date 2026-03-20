"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Tag, Key, Loader2 } from 'lucide-react'
import { invoke } from '@tauri-apps/api/core'

interface Question {
  id: string
  text: string
  category: string
  difficulty: string
  tags: string[]
  keywords: string[]
}

const difficultyColors: Record<string, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Hard: 'bg-red-500/15 text-red-400 border-red-500/20',
}

export default function QuestionBankClient() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingQ, setEditingQ] = useState<Question | null>(null)
  const [form, setForm] = useState({ text: '', category: 'Technical', difficulty: 'Medium', tags: '', keywords: '' })

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const data = await invoke<Question[]>('get_questions')
      setQuestions(data)
    } catch (err) {
      console.error('Failed to fetch questions', err)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditingQ(null)
    setForm({ text: '', category: 'Technical', difficulty: 'Medium', tags: '', keywords: '' })
    setShowModal(true)
  }

  const openEdit = (q: Question) => {
    setEditingQ(q)
    setForm({ text: q.text, category: q.category, difficulty: q.difficulty, tags: q.tags.join(', '), keywords: q.keywords.join(', ') })
    setShowModal(true)
  }

  const handleSave = async () => {
    const qData = {
      id: editingQ?.id || '',
      text: form.text,
      category: form.category,
      difficulty: form.difficulty,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    }

    try {
      const savedQ = await invoke<Question>('save_question', { question: qData })
      if (editingQ) {
        setQuestions((prev) => prev.map((q) => (q.id === editingQ.id ? savedQ : q)))
      } else {
        setQuestions((prev) => [...prev, savedQ])
      }
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save question', err)
    }
  }

  const handleDelete = async (id: string) => {
    // In a real app we'd call DELETE /api/questions/[id]
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Question Bank</h1>
          <p className="text-white/30 text-sm mt-1">{questions.length} questions available</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="glass rounded-2xl p-5 card-hover">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-white/80 flex-1 mr-4">{q.text}</h3>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(q)} className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-indigo-500/15 hover:border-indigo-500/20 text-white/30 hover:text-indigo-400 transition-all">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-red-500/15 hover:border-red-500/20 text-white/30 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${difficultyColors[q.difficulty]}`}>{q.difficulty}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{q.category}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {q.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-white/30 border border-white/[0.04]">
                  <Tag className="w-2.5 h-2.5" />{tag}
                </span>
              ))}
              {q.keywords.map((kw) => (
                <span key={kw} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/8 text-cyan-400/60 border border-cyan-500/10">
                  <Key className="w-2.5 h-2.5" />{kw}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass rounded-2xl max-w-lg w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editingQ ? 'Edit Question' : 'Add Question'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-white/40 mb-1.5 block">Question Text</label>
                <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/40 transition-all resize-none" placeholder="Enter question..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-white/40 mb-1.5 block">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/60 focus:outline-none appearance-none bg-[#1a1a3e]">
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Situational">Situational</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/40 mb-1.5 block">Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/60 focus:outline-none appearance-none bg-[#1a1a3e]">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-white/40 mb-1.5 block">Tags (comma-separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/40 transition-all" placeholder="react, frontend" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40 mb-1.5 block">Expected Keywords (comma-separated)</label>
                <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/40 transition-all" placeholder="useState, Redux, context" />
              </div>
              <button onClick={handleSave} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                {editingQ ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
