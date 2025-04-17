'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/atoms/brand/Logo'
import { Menu, LayoutDashboard, Users, LogOut, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral do sistema'
  },
  {
    title: 'Funcionários',
    href: '/employees',
    icon: Users,
    description: 'Gerenciar funcionários'
  },
  /*{
    title: 'Calendário',
    href: '/calendar',
    icon: Calendar,
    description: 'Agendar compromissos'
  },*/
  {
    title: 'Usuários',
    href: '/users',
    icon: User,
    adminOnly: true,
    description: 'Gerenciar acesso ao sistema'
  },
  /*{
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
    description: 'Ajustar preferências'
  },
  {
    title: 'Notificações',
    href: '/notifications',
    icon: Bell,
    description: 'Visualizar notificações'
  }*/
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      setCollapsed(savedState === 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(collapsed))
  }, [collapsed])

  const isActive = (path: string) => pathname === path

  async function handleSignOut() {
    await signOut({ callbackUrl: '/' });
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-40">
          <Button variant="outline" size="icon" className="rounded-full shadow-md bg-white">
            <Menu className="h-5 w-5 text-blue-600" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 border-r-0 bg-gradient-to-b from-blue-50 to-white">
          <div className="flex h-full flex-col">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              <Logo className="justify-start" />
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    isActive(item.href)
                      ? "bg-blue-700 text-white"
                      : "bg-blue-100/80 text-blue-600 group-hover:bg-blue-200"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    {item.description && (
                      <span className={cn(
                        "text-xs font-normal",
                        isActive(item.href) ? "text-blue-100" : "text-gray-500"
                      )}>
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
            <Separator className="bg-blue-100" />
            <div className="p-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200" 
                onClick={handleSignOut}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <LogOut className="h-5 w-5" />
                </div>
                <span>Sair do sistema</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div 
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:flex-col transition-all duration-300 ease-in-out bg-gradient-to-b from-blue-50 to-white border-r border-blue-100",
          collapsed ? "lg:w-20" : "lg:w-80"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-between">
            {!collapsed && <Logo className="justify-start" />}
            {collapsed && <div className="w-full flex justify-center">
              <Logo.Icon className="h-8 w-8" />
            </div>}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="absolute -right-4 top-16 bg-white border border-blue-100 rounded-full h-8 w-8 shadow-md hover:bg-blue-50 text-blue-500 z-40"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-200 group relative",
                  collapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5",
                  isActive(item.href)
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                )}
                title={collapsed ? item.title : undefined}
              >
                <div className={cn(
                  "flex shrink-0 items-center justify-center rounded-lg",
                  collapsed ? "h-10 w-10" : "h-9 w-9",
                  isActive(item.href)
                    ? "bg-blue-700 text-white"
                    : "bg-blue-100/80 text-blue-600 group-hover:bg-blue-200"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                
                {!collapsed && (
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    {item.description && (
                      <span className={cn(
                        "text-xs font-normal",
                        isActive(item.href) ? "text-blue-100" : "text-gray-500"
                      )}>
                        {item.description}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </nav>
          
          <Separator className="bg-blue-100" />
          
          <div className="p-3">
            <Button 
              variant="ghost" 
              className={cn(
                "text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200",
                collapsed ? "justify-center p-2 w-full" : "w-full justify-start gap-3"
              )}
              onClick={handleSignOut}
              title={collapsed ? "Sair do sistema" : undefined}
            >
              <div className={cn(
                "flex shrink-0 items-center justify-center rounded-lg bg-red-100",
                collapsed ? "h-10 w-10" : "h-9 w-9"
              )}>
                <LogOut className="h-5 w-5" />
              </div>
              {!collapsed && <span>Sair do sistema</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 