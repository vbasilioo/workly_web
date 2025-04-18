'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User, Bell } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavbarProps {
  className?: string
  title?: string
}

export function Navbar({ className, title }: NavbarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const getPageTitle = () => {
    if (title) return title

    const pathSegments = pathname.split('/')
    const currentPath = pathSegments[pathSegments.length - 1]

    const titles: Record<string, string> = {
      'dashboard': 'Dashboard',
      'employees': 'Funcionários',
      'users': 'Usuários do Sistema',
    }

    return titles[currentPath] || 'Dashboard'
  }

  const name = session?.user?.name || 'Usuário'

  const getUserInitials = () => {
    if (!name) return "U"
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: '/' });
  }

  return (
    <div className={cn(
      "h-16 w-full flex items-center justify-between px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-md z-10",
      className
    )}>
      <div className="flex-1 text-center">
        <h1 className="text-xl font-bold tracking-tight">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700/20">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-2 rounded-full hover:bg-blue-700/20 px-2 py-1.5">
              <Avatar className="h-9 w-9 border-2 border-white/30">
                <AvatarImage src="/avatar.png" alt={name} />
                <AvatarFallback className="bg-blue-700 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block font-medium">{name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair do sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}