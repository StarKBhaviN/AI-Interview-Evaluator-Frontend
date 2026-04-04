import React from 'react'
import CandidateReportClient from '@/components/admin/CandidateReportClient'

export async function generateStaticParams() {
  return [{ ids: ['all'] }]
}

export default async function DynamicCandidateReportPage({ params }: { params: Promise<{ ids: string[] }> }) {
  const { ids } = await params
  const id = ids?.[0]
  return <CandidateReportClient sessionId={id} />
}
