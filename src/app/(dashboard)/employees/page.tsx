'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { EmployeesTable } from '@/components/organisms/dashboard/EmployeesTable'
import { EmployeeForm } from '@/components/molecules/employees/EmployeeForm'

// Dados mockados com tipagem correta
const activeEmployees = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@workly.com',
    role: 'Desenvolvedor',
    department: 'Tecnologia',
    startDate: '2023-01-15',
    status: 'active' as const
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@workly.com',
    role: 'Designer',
    department: 'Design',
    startDate: '2023-02-20',
    status: 'active' as const
  }
]

const inactiveEmployees = [
  {
    id: '3',
    name: 'Pedro Souza',
    email: 'pedro@workly.com',
    role: 'Gerente',
    department: 'Administração',
    startDate: '2022-06-10',
    endDate: '2023-12-31',
    status: 'inactive' as const
  }
]

export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateEmployee = async (data: any) => {
    // TODO: Implementar integração com backend
    console.log('Creating employee:', data)
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Funcionários</h2>
          <p className="text-muted-foreground">
            Gerencie seus funcionários ativos e inativos
          </p>
        </div>
        <Button 
          className="w-full md:w-auto bg-primary hover:bg-primary/90"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="active" className="data-[state=active]:bg-background">
            Ativos ({activeEmployees.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="data-[state=active]:bg-background">
            Inativos ({inactiveEmployees.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <EmployeesTable employees={activeEmployees} />
        </TabsContent>
        <TabsContent value="inactive">
          <EmployeesTable employees={inactiveEmployees} />
        </TabsContent>
      </Tabs>

      {/* Modal de Criação */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Funcionário</DialogTitle>
            <DialogDescription>
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