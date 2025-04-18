'use client'

import { Sidebar } from '@/components/organisms/dashboard/Sidebar'
import { Navbar } from '@/components/organisms/dashboard/Navbar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState, useEffect, createContext } from 'react'
import { cn } from '@/lib/utils'

export const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}>({
  collapsed: false,
  setCollapsed: () => { },
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarCollapsed')
      if (savedState !== null) {
        setCollapsed(savedState === 'true')
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', String(collapsed))
    }
  }, [collapsed])

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
          <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div
              className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                collapsed ? "lg:ml-20" : "lg:ml-80"
              )}
              style={{
                transitionProperty: 'margin',
                transitionDuration: '300ms',
                transitionTimingFunction: 'ease-in-out'
              }}
            >
              <Navbar />
              <div className="flex-1">
                {children}
              </div>
            </div>
          </div>
        </SidebarContext.Provider>
      </SessionProvider>
    </QueryClientProvider>
  )
} 