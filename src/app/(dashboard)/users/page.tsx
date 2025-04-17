'use client'

import { useState } from 'react'
import { UsersTable } from '@/components/organisms/dashboard/UsersTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Filter, Download, Search, UserCog } from 'lucide-react'

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-8">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <UserCog className="h-7 w-7" />
              Usuários do Sistema
            </h2>
            <p className="text-blue-100 mt-1">
              Gerencie os usuários que têm acesso ao sistema
            </p>
          </div>
          <Button
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg w-full lg:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-4 -mt-8 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar usuário..." 
                className="pl-10 bg-gray-50 border-gray-200 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8 overflow-x-auto">
          <div className="w-full">
            <UsersTable />
          </div>
        </div>
      </div>
    </div>
  )
} 