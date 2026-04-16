import React from 'react'
import CandidateReportClient from '@/components/admin/CandidateReportClient'

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: 'all' }
  ]
}

export default function DynamicCandidateReportPage({
  params,
}: {
  params: { id: string }
}) {
  return <CandidateReportClient sessionId={params.id} />
}