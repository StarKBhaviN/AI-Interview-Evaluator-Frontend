"use client"
import React, { useEffect, useState } from 'react'
import { Brain, Check } from 'lucide-react'

import { analyzeAudio, AnalysisResponse, generateReport, submitSession, uploadAudio } from '@/lib/api'

const statuses = [
  { label: 'Uploading audio to AI engine', icon: '🎤' },
  { label: 'Analyzing speech clarity & sentiment', icon: '🎯' },
  { label: 'Evaluating response relevance', icon: '🎯' },
  { label: 'Checking keyword coverage', icon: '🔑' },
  { label: 'Finalizing scores & report', icon: '📊' },
]

export default function ProcessingClient() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [results, setResults] = useState<AnalysisResponse[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processInterviews = async () => {
      try {
        const storedPaths = localStorage.getItem('interviewAudioPaths')
        if (!storedPaths) {
          setError('No recordings found to process.')
          return
        }
        
        const paths = JSON.parse(storedPaths) as Record<number, string>
        const storedQuestions = localStorage.getItem('interviewQuestions')
        const questions = storedQuestions ? JSON.parse(storedQuestions) as any[] : []
        
        const storedSkills = localStorage.getItem('extractedSkills')
        const skillsObj = storedSkills ? JSON.parse(storedSkills) as {name: string}[] : []
        const skills = skillsObj.map(s => s.name)

        const storedWarnings = localStorage.getItem('interviewWarnings')
        const warningLogs = storedWarnings ? JSON.parse(storedWarnings) : []

        const allResults: AnalysisResponse[] = []

        // Sequence through the UI and API calls
        for (let i = 0; i < statuses.length; i++) {
          setCurrentIndex(i)
          
          if (i === 1) { // Analyzing speech clarity & sentiment (First real API call point)
            // Iterate through questions and find matching paths in the record
            for (let j = 0; j < questions.length; j++) {
              const path = paths[j]
              if (!path) continue // Skip questions that weren't answered
              
              const questionText = questions[j]?.text || ""
              const res = await analyzeAudio(path, questionText, skills)
              
              // We need to keep track of which question this result belongs to
              allResults.push({
                ...res,
                questionIndex: j,
                questionText: questionText,
                audioPath: path
              })
            }
          }

          
          // Add some deliberate delay for visual feedback if the API is too fast
          await new Promise(r => setTimeout(r, 1200))
        }

        setResults(allResults)
        localStorage.setItem('interviewResults', JSON.stringify(allResults))
        
        // --- NEW: Generate Real AI Report ---
        setCurrentIndex(statuses.length - 1)
        const finalReport = await generateReport(allResults, warningLogs)
        localStorage.setItem('interviewReport', JSON.stringify(finalReport))
        
        // Save to interview history
        const candidateData = JSON.parse(localStorage.getItem('candidateData') || '{}')
        const overall = finalReport.overallScore

        // Combine results with audio paths and question text for history
        const detailedResults = allResults.map((res: any) => ({
          ...res,
          audioPath: res.audioPath,
          questionText: res.questionText
        }))

        const sessionId = Date.now().toString()
        const historyItem = {
          id: sessionId,
          date: new Date().toISOString(),
          position: candidateData.position || 'General',
          score: overall,
          questionsCount: allResults.length,
          warnings: warningLogs,
          details: detailedResults,
          report: finalReport
        }

        // --- NEW: Upload Audio Files & Submit to Admin Backend ---
        for (const res of allResults) {
          if (res.audioPath) {
             try {
                await uploadAudio(res.audioPath, sessionId, res.questionIndex!)
             } catch (e) {
                console.error("Failed to upload chunk:", e)
             }
          }
        }
        await submitSession(historyItem)

        const existingHistory = JSON.parse(localStorage.getItem('interviewHistory') || '[]')
        localStorage.setItem('interviewHistory', JSON.stringify([historyItem, ...existingHistory]))

        setDone(true)

        setTimeout(() => { window.location.href = '/completed' }, 1200)
      } catch (err: any) {
        console.error('Processing failed:', err)
        const msg = err.message || 'An error occurred during AI analysis.'
        setError(`${msg}. Please ensure the AI backend (Python) is running.`)
      }
    }


    processInterviews()
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float animate-delay-300" />

      <div className="glass rounded-2xl max-w-md w-full p-10 text-center animate-fade-in-up">
        {/* Brain animation */}
        <div className="relative mb-8 inline-block">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-pulse-glow">
            <Brain className="w-12 h-12 text-white" />
          </div>
          {/* Orbiting particles */}
          <div className="absolute inset-[-20px] animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50" />
          </div>
          <div className="absolute inset-[-30px] animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          </div>
          <div className="absolute inset-[-15px] animate-spin-slow" style={{ animationDuration: '6s' }}>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Processing Your Interview</h2>
        <p className="text-white/40 text-sm mb-8">Our AI is analyzing your responses</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
            <button 
              onClick={() => window.location.href = '/interview'}
              className="block w-full mt-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all font-semibold"
            >
              Back to Interview
            </button>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-3 text-left">
          {statuses.map((s, index) => {
            const isDone = index < currentIndex || done
            const isCurrent = index === currentIndex && !done
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                  isDone
                    ? 'bg-emerald-500/8 border border-emerald-500/15'
                    : isCurrent
                    ? 'bg-indigo-500/8 border border-indigo-500/15'
                    : 'bg-white/[0.01] border border-transparent'
                }`}
              >
                <span className="text-lg">{s.icon}</span>
                <span className={`text-sm font-medium flex-1 transition-all duration-300 ${
                  isDone ? 'text-emerald-400' :
                  isCurrent ? 'text-white' :
                  'text-white/20'
                }`}>
                  {s.label}
                </span>
                {isDone && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {isCurrent && (
                  <div className="w-4 h-4 border-2 border-indigo-400/50 border-t-indigo-400 rounded-full animate-spin" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
