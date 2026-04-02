"use client"
import React from 'react'
import CandidateReportClient from '@/components/admin/CandidateReportClient'
import { useParams } from 'next/navigation'

export default function DynamicCandidateReportPage() {
  const params = useParams()
  const id = params.id as string

  return <CandidateReportClient sessionId={id} />
}
