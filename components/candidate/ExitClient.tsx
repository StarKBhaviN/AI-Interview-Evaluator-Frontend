"use client"
import React from 'react'
import { Download, X, Heart, Mail } from 'lucide-react'

export default function ExitClient() {
  const candidateData = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('candidateData') || '{}')
    : {}

  const handleDownload = () => {
    const reportData = {
      candidate: candidateData.name,
      position: candidateData.position,
      overallScore: 82,
      date: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `interview-report-${candidateData.name?.replace(/\s/g, '-') || 'report'}.json`
    const link = document.createElement('a')
    link.setAttribute('href', dataUri)
    link.setAttribute('download', exportFileDefaultName)
    link.click()
  }

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />

      <div className="glass rounded-2xl max-w-lg w-full animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/[0.06] px-8 py-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/30">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Thank You!</h1>
          <p className="text-white/40 text-sm">Your interview has been completed successfully</p>
        </div>

        <div className="p-8 space-y-5">
          {/* Summary */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            {[
              { label: 'Candidate', value: candidateData.name || 'N/A' },
              { label: 'Position', value: candidateData.position || 'N/A' },
              { label: 'Questions Answered', value: '5' },
              { label: 'Overall Score', value: '82/100', highlight: true },
            ].map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-white/30">{item.label}</span>
                <span className={`font-medium ${item.highlight ? 'text-gradient font-bold' : 'text-white/70'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Close Application
            </button>
          </div>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-white/20 text-xs flex items-center justify-center gap-1.5">
              <Mail className="w-3 h-3" />
              You will receive details at your registered email
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
