"use client"
import React from 'react'
import { Progress } from '../ui/progress'
import { TrendingUp, MessageSquare, Code, Target, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

export default function FeedbackClient() {
  const feedback = {
    overallScore: 82,
    communicationScore: 85,
    technicalScore: 78,
    confidenceScore: 82,
    strengths: [
      'Clear and articulate communication',
      'Strong problem-solving approach',
      'Good understanding of fundamentals',
      'Positive attitude and enthusiasm',
    ],
    improvements: [
      'Provide more detailed examples',
      'Improve code optimization knowledge',
      'Practice explaining complex concepts',
      'Enhance follow-up questions',
    ],
  }

  const scores = [
    { label: 'Communication', value: feedback.communicationScore, icon: <MessageSquare className="w-5 h-5" />, color: 'indigo' },
    { label: 'Technical', value: feedback.technicalScore, icon: <Code className="w-5 h-5" />, color: 'purple' },
    { label: 'Confidence', value: feedback.confidenceScore, icon: <TrendingUp className="w-5 h-5" />, color: 'cyan' },
  ]

  const colorMap: Record<string, { bg: string; border: string; text: string; bar: "default" | "gradient" }> = {
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', bar: 'default' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', bar: 'gradient' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', bar: 'default' },
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: 'text-emerald-400' }
    if (score >= 75) return { text: 'Good', color: 'text-indigo-400' }
    if (score >= 60) return { text: 'Average', color: 'text-amber-400' }
    return { text: 'Needs Work', color: 'text-red-400' }
  }

  const overallLabel = getScoreLabel(feedback.overallScore)

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Interview Feedback</h1>
          <p className="text-white/40">Here&apos;s how you performed in the interview</p>
        </div>

        {/* Overall score */}
        <div className="glass rounded-2xl p-8 mb-6 text-center animate-fade-in-up">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Overall Score</p>
          <div className="relative inline-block mb-4">
            <div className="text-7xl font-bold text-gradient">
              {feedback.overallScore}
            </div>
            <span className="text-2xl text-white/20 font-medium">/100</span>
          </div>
          <p className={`text-sm font-semibold ${overallLabel.color}`}>{overallLabel.text}</p>
          <div className="max-w-xs mx-auto mt-4">
            <Progress value={feedback.overallScore} variant="gradient" size="lg" />
          </div>
        </div>

        {/* Score breakdown */}
        <div className="glass rounded-2xl p-6 mb-6 animate-fade-in-up animate-delay-100">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Performance Breakdown</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {scores.map((score) => {
              const c = colorMap[score.color]
              return (
                <div key={score.label} className={`p-4 rounded-xl ${c.bg} border ${c.border}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={c.text}>{score.icon}</div>
                    <span className="text-sm font-medium text-white/60">{score.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{score.value}%</div>
                  <Progress value={score.value} variant={c.bar} size="sm" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="glass rounded-2xl p-6 animate-fade-in-up animate-delay-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-emerald-300">Your Strengths</h3>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <span className="text-white/50">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6 animate-fade-in-up animate-delay-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-amber-300">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {feedback.improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <span className="text-white/50">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Note & Continue */}
        <div className="glass rounded-2xl p-6 animate-fade-in-up animate-delay-400">
          <div className="p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/15 mb-4">
            <p className="text-sm text-white/40">
              <strong className="text-indigo-300">Note:</strong> This is preliminary feedback generated by our AI system.
              A detailed analysis and final decision will be communicated by our HR team.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = '/exit')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            Continue to Exit
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
