"use client"
import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppStore } from '@/store/app.store'

export function AuthGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, hasHydrated } = useAppStore()
  const [debugMsg, setDebugMsg] = useState('')

  useEffect(() => {
    if (!hasHydrated) return

    // helper for case-insensitive role check
    const rolesMatch = (r1?: string, r2?: string) => {
      if (!r1 || !r2) return false
      return r1.toLowerCase() === r2.toLowerCase()
    }

    // Role detection based on path
    const isAdminPath = pathname.startsWith('/admin')
    const isClientPath = pathname.startsWith('/client')
    const isCandidatePath =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/resume-parsing') ||
      pathname.startsWith('/interview')

    // 1. Not logged in → redirect to login page
    if (!user) {
      setDebugMsg('No user found, redirecting to /')
      router.replace('/')
      return
    }

    // 2. Explicit role check via prop
    if (requiredRole && !rolesMatch(user.role, requiredRole)) {
      setDebugMsg(`Role mismatch: Expected ${requiredRole} but got ${user.role}. Redirecting...`)
      router.replace('/')
      return
    }

    // 3. Path-based protection (auto-detection)
    if (isAdminPath && !rolesMatch(user.role, 'Admin')) {
      setDebugMsg(`Admin path but role is ${user.role}. Redirecting...`)
      router.replace('/')
    } else if (isClientPath && !rolesMatch(user.role, 'Client')) {
      setDebugMsg(`Client path but role is ${user.role}. Redirecting...`)
      router.replace('/')
    } else if (isCandidatePath && !rolesMatch(user.role, 'Candidate')) {
      setDebugMsg(`Candidate path but role is ${user.role}. Redirecting...`)
      router.replace('/')
    }
  }, [user, pathname, router, requiredRole, hasHydrated])

  // While hydrating, show a loading spinner
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
      </div>
    )
  }

  // If we have a debug message, it means a redirect is about to happen
  if (debugMsg) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 gap-4 text-center">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-amber-500 font-mono text-sm uppercase tracking-widest">{debugMsg}</p>
        <p className="text-white/20 text-[10px] font-mono">Current Path: {pathname}</p>
      </div>
    )
  }

  // Not logged in (after hydration) → show spinner briefly while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard;
