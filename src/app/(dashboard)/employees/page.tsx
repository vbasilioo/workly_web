/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Filter, Download, Search, Users } from 'lucide-react'
import { EmployeesTable } from '@/components/organisms/dashboard/EmployeesTable'
import { EmployeeForm } from '@/components/molecules/employees/EmployeeForm'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { Input } from '@/components/ui/input'

export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { employees, createEmployee } = useEmployees()
  const [searchTerm, setSearchTerm] = useState('')

  const handleCreateEmployee = async (data: any) => {
    try {
      await createEmployee(data)
      setIsCreateDialogOpen(false)
    }
    catch (error) {
      console.error('Error creating employee:', error)
    }
  }

  const activeEmployees = employees?.filter((employee) => employee.isActive === true)
  const inactiveEmployees = employees?.filter((employee) => employee.isActive === false)

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-8">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-7 w-7" />
              Funcionários
            </h2>
            <p className="text-blue-100 mt-1">
              Gerencie seus funcionários ativos e inativos
            </p>
          </div>
          <Button
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg w-full lg:w-auto"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-4 -mt-8 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-auto md:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar funcionário..." 
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

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
          <Tabs 
            defaultValue="active" 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="bg-gray-100 p-1 rounded-lg mb-4 w-full justify-start">
              <TabsTrigger 
                value="active" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Ativos ({activeEmployees?.length})
              </TabsTrigger>
              <TabsTrigger 
                value="inactive" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Inativos ({inactiveEmployees?.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-0">
              {activeEmployees && (
                <div className="overflow-x-auto w-full">
                  <EmployeesTable employees={activeEmployees} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="inactive" className="mt-0">
              {inactiveEmployees && (
                <div className="overflow-x-auto w-full">
                  <EmployeesTable employees={inactiveEmployees} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-blue-600">Novo Funcionário</DialogTitle>
            <DialogDescription className="text-gray-600">
              Preencha as informações do novo funcionário. Clique em cadastrar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            onSubmit={handleCreateEmployee}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 