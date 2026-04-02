"use client"
import React, { useEffect, useState } from 'react'
import AuthClient from '@/components/auth/AuthClient'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app.store'

export default function Home() {
  const router = useRouter()
  const setUserStore = useAppStore((state) => state.setUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = sessionStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      setUserStore(user)
      if (user.role === 'Admin') router.push('/admin/dashboard')
      else if (user.role === 'Client') router.push('/client/dashboard')
      else router.push('/dashboard')
    } else {
      setLoading(false)
    }
  }, [router, setUserStore])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  return <AuthClient />
}

