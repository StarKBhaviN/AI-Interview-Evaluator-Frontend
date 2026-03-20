"use client"
import React, { useEffect, useState } from 'react'
import { Progress } from '../ui/progress'
import { CheckCircle, Upload, Sparkles, ArrowRight } from 'lucide-react'

export default function CompletedClient() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadComplete(true)
          return 100
        }
        return prev + 3
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl" />

      <div className="glass rounded-2xl max-w-lg w-full animate-fade-in-up overflow-hidden">
        {/* Success header */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-b border-white/[0.06] px-8 py-8 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            {/* Celebration dots */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-float"
                style={{
                  top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                  left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 50}%`,
                  background: i % 2 === 0 ? '#10b981' : '#06b6d4',
                  animationDelay: `${i * 200}ms`,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Interview Completed!</h1>
          <p className="text-white/40 text-sm">Thank you for completing the interview</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Upload progress */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-white/60">
                  {uploadComplete ? 'Upload Complete' : 'Uploading responses'}
                </span>
              </div>
              <span className={`text-sm font-bold ${uploadComplete ? 'text-emerald-400' : 'text-indigo-400'}`}>
                {uploadProgress}%
              </span>
            </div>
            <Progress
              value={uploadProgress}
              variant={uploadComplete ? 'success' : 'gradient'}
              size="sm"
              showStripes={!uploadComplete}
            />
          </div>

          {uploadComplete && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Success message */}
              <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-center">
                <p className="text-emerald-300 text-sm font-medium flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  All responses successfully uploaded and processed
                </p>
              </div>

              {/* Next steps */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white/60">What happens next?</h3>
                {[
                  'Your responses have been analyzed by our AI system',
                  'View your performance feedback on the next screen',
                  'Our team will review results and contact you soon',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-400 text-xs">{index + 1}</span>
                    </div>
                    <span className="text-white/40">{item}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={() => (window.location.href = '/feedback')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                View My Feedback
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
