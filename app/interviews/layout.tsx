"use client"
import AuthGuard from '@/components/auth/AuthGuard';

export default function InterviewsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={['Candidate']}>{children}</AuthGuard>;
}
