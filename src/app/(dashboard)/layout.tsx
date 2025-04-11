'use client'

import { Sidebar } from '@/components/organisms/dashboard/Sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
          <Sidebar />
          <div className="lg:pl-72">
            <main className="p-4 md:p-8 mx-auto max-w-7xl">
              <div className="rounded-xl border bg-card shadow-sm">
                <div className="p-6">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </SessionProvider>
    </QueryClientProvider>
  )
} 