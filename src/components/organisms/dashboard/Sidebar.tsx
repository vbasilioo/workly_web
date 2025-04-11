'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/atoms/brand/Logo'
import { Menu, LayoutDashboard, Users, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Employees',
    href: '/employees',
    icon: Users
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    adminOnly: true
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  async function handleSignOut() {
    await signOut({ callbackUrl: '/' });
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="flex h-full flex-col">
            <div className="p-4">
              <Logo />
            </div>
            <Separator />
            <nav className="flex-1 space-y-2 p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive(item.href)
                    ? 'bg-secondary text-secondary-foreground'
                    : 'hover:bg-secondary/50'
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4">
              <Button variant="ghost" className="w-full justify-start space-x-3" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <Logo />
          </div>
          <Separator />
          <nav className="flex-1 space-y-2 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive(item.href)
                  ? 'bg-secondary text-secondary-foreground'
                  : 'hover:bg-secondary/50'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4">
            <Button variant="ghost" className="w-full justify-start space-x-3" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 