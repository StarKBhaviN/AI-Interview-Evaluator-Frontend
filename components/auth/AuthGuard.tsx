"use client"
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppStore } from '@/store/app.store'

export function AuthGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'Candidate' | 'Client' | 'Admin' }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAppStore()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // 1. If hitting root or login, allow (unless already logged in, then redirect)
    if (pathname === '/') {
      if (user) {
        if (user.role === 'Admin') router.push('/admin/dashboard')
        else if (user.role === 'Client') router.push('/client/dashboard')
        else router.push('/dashboard')
      } else {
        setAuthorized(true)
      }
      return
    }

    // 2. If not logged in and trying to access protected routes, redirect to home
    if (!user) {
      router.push('/')
      return
    }

    // 3. Role-based protection: check explicit requiredRole prop first, then path auto-detection
    if (requiredRole && user.role !== requiredRole) {
      router.push('/')
      return
    }

    const isAdminRoute = pathname.startsWith('/admin')
    const isClientRoute = pathname.startsWith('/client')
    const isCandidateRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/resume-parsing') || pathname.startsWith('/interview')

    if (isAdminRoute && user.role !== 'Admin') {
      router.push('/')
    } else if (isClientRoute && user.role !== 'Client') {
      router.push('/')
    } else if (isCandidateRoute && user.role !== 'Candidate') {
      router.push('/')
    } else {
      setAuthorized(true)
    }
  }, [user, pathname, router, requiredRole])

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard;
