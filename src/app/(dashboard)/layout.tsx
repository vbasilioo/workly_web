'use client'

import { Sidebar } from '@/components/organisms/dashboard/Sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())
  const [collapsed, setCollapsed] = useState(false)
  
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      setCollapsed(savedState === 'true')
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebarCollapsed') {
        setCollapsed(e.newValue === 'true')
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar />
          <div 
            className={cn(
              "flex-1 transition-all duration-300",
              collapsed ? "lg:ml-20" : "lg:ml-80"
            )}
          >
            {children}
          </div>
        </div>
      </SessionProvider>
    </QueryClientProvider>
  )
} 