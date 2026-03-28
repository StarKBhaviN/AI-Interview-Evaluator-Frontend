"use client"
import React from 'react'
import { Download, X, Heart, Mail } from 'lucide-react'

export default function ExitClient() {
  const candidateData = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('candidateData') || '{}')
    : {}

  const handleDownload = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    
    const results = JSON.parse(localStorage.getItem('interviewResults') || '[]')
    const doc = new jsPDF()

    // Header
    doc.setFillColor(63, 81, 181) // Indigo
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text('AI Interview Evaluation Report', 15, 25)
    
    // Candidate Details
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Candidate Name:', 15, 55)
    doc.setFont('helvetica', 'normal')
    doc.text(candidateData.name || 'N/A', 50, 55)
    
    doc.setFont('helvetica', 'bold')
    doc.text('Position:', 15, 62)
    doc.setFont('helvetica', 'normal')
    doc.text(candidateData.position || 'N/A', 50, 62)
    
    doc.setFont('helvetica', 'bold')
    doc.text('Date:', 15, 69)
    doc.setFont('helvetica', 'normal')
    doc.text(new Date().toLocaleDateString(), 50, 69)

    // Overall Score Circle/Box
    const avgRel = results.reduce((acc: any, r: any) => acc + r.relevance_score, 0) / results.length
    const avgConf = results.reduce((acc: any, r: any) => acc + r.confidence_score, 0) / results.length
    const overall = Math.round((avgRel * 0.4 + 0.75 * 0.3 + avgConf * 0.3) * 100)

    doc.setDrawColor(63, 81, 181)
    doc.setLineWidth(1)
    doc.rect(140, 50, 55, 25)
    doc.setFontSize(10)
    doc.text('OVERALL SCORE', 145, 58)
    doc.setFontSize(24)
    doc.setTextColor(63, 81, 181)
    doc.text(`${overall}/100`, 145, 70)

    // Summary Table
    autoTable(doc, {
      startY: 85,
      head: [['Metric', 'Score', 'Assessment']],
      body: [
        ['Relevance', `${Math.round(avgRel * 100)}%`, avgRel > 0.7 ? 'Excellent' : 'Good'],
        ['Communication', `${Math.round(avgConf * 100)}%`, avgConf > 0.7 ? 'Fluent' : 'Clear'],
        ['Technical', '75%', 'Foundational'],
      ],
      headStyles: { fillColor: [63, 81, 181] }

    })

    // Detailed Transcripts
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text('Detailed Q&A Transcript', 15, (doc as any).lastAutoTable.finalY + 20)
    
    let yPos = (doc as any).lastAutoTable.finalY + 30
    
    const interviewQuestions = JSON.parse(localStorage.getItem('interviewQuestions') || '[]')

    results.forEach((res: any, index: number) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      const questionText = interviewQuestions[index]?.text || `Question ${index + 1}`
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(`Q${index + 1}: ${questionText}`, 15, yPos)
      yPos += 7
      
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(10)
      doc.setTextColor(80, 80, 80)
      const transcriptLines = doc.splitTextToSize(`"${res.transcript}"`, 180)
      doc.text(transcriptLines, 15, yPos)
      
      yPos += (transcriptLines.length * 5) + 5
      
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.text(`Relevance: ${Math.round(res.relevance_score * 100)}% | Confidence: ${Math.round(res.confidence_score * 100)}%`, 15, yPos)
      
      yPos += 15
    })

    doc.save(`Interview-Report-${candidateData.name || 'Candidate'}.pdf`)
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
