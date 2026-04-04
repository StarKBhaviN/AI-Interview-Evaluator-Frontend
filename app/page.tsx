"use client"
import React, { useEffect, useState, useRef } from 'react'
import AuthClient from '@/components/auth/AuthClient'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app.store'

export default function Home() {
  const router = useRouter()
  const { user, hasHydrated } = useAppStore()
  const [loading, setLoading] = useState(true)
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Only run the logic once hydration is complete
    if (!hasHydrated) return
    if (hasRedirected.current) return

    // If user is already logged in (from the hydrated store in localStorage), redirect
    if (user) {
      hasRedirected.current = true
      const role = user.role?.toLowerCase()

      if (role === 'admin') {
        router.replace('/admin/dashboard')
      } else if (role === 'client') {
        router.replace('/client/dashboard')
      } else if (role === 'candidate') {
        router.replace('/dashboard')
      } else {
        // Fallback for unknown role
        setLoading(false)
      }
    } else {
      // If no user exists after hydration, show the login/signup form
      setLoading(false)
    }
  }, [user, router, hasHydrated])

  // Show a loading spinner during the initial hydration process
  if (!hasHydrated || loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  return <AuthClient />
}
