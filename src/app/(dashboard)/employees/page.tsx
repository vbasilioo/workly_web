/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Plus,
  Download,
  Search,
  Users,
  SlidersHorizontal,
  FileSpreadsheet,
  FileText,
  Mail,
  Calendar
} from 'lucide-react'
import { EmployeesTable } from '@/components/organisms/dashboard/EmployeesTable'
import { EmployeeForm } from '@/components/molecules/employees/EmployeeForm'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AddressForm, AddressFormData } from '@/components/molecules/addresses/AddressForm'
import { Progress } from '@/components/ui/progress'
import { useAddresses } from '@/lib/hooks/useAddress'

export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [createdEmployeeId, setCreatedEmployeeId] = useState<string | null>(null)
  const { employees, createEmployee, isLoadingEmployees, isCreatingEmployee } = useEmployees()
  const { createWithEmployee } = useAddresses()
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const steps = [
    { id: 1, title: 'Dados do Funcionário' },
    { id: 2, title: 'Endereço' },
  ]
  const totalSteps = steps.length;
  const progressValue = (step / totalSteps) * 100;


  const handleCreateEmployee = async (data: any) => {
    try {
      const employeeData = {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        rg: data.rg || '',
        cnh: data.cnh || '',
        observations: data.observations || '',
        phone: data.phone || '',
        position: data.position,
        department: data.department,
        salary: data.salary,
        hireDate: data.hireDate,
        status: 'active' as 'active' | 'inactive',
      }

      const created = await createEmployee(employeeData)

      if (created?.id) {
        setCreatedEmployeeId(created.id)
        setStep(2)
      }
    } catch (error) {
      console.error("Erro ao criar funcionário:", error)
    }
  }

  const handleAddressSubmit = async (data: AddressFormData) => {
    try {
      if (!createdEmployeeId) return;

      const addressData = {
        street: data.street,
        number: data.number || '',
        complement: data.complement || '',
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        reference: data.reference || '',
        employeeId: createdEmployeeId, 
      };

      await createWithEmployee(addressData);

      setIsCreateDialogOpen(false);
      setStep(1);
      setCreatedEmployeeId(null);
    } catch (error) {
      console.error("Erro ao cadastrar endereço:", error);
    }
  };

  const filterEmployees = (employeesList: any[]) => {
    return employeesList
      ?.filter(employee =>
        (searchTerm === '' ||
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.rg.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchTerm.toLowerCase())
        ) &&
        (departmentFilter === null || employee.department === departmentFilter)
      )
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name)
        } else {
          return b.name.localeCompare(a.name)
        }
      }) || []
  }
  const activeEmployees = filterEmployees(employees?.filter((employee) => employee.isActive === true) || [])
  const inactiveEmployees = filterEmployees(employees?.filter((employee) => employee.isActive === false) || [])

  const departments = employees?.map(e => e.department)
    .filter((dept, index, array) => dept && array.indexOf(dept) === index) || []

  const handleExport = (format: 'excel' | 'pdf' | 'email') => {
    switch (format) {
      case 'excel':
        alert('Exportando para Excel...')
        break
      case 'pdf':
        alert('Exportando para PDF...')
        break
      case 'email':
        alert('Enviando por email...')
        break
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setDepartmentFilter(null)
    setSortOrder('asc')
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-6">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email, RG, cargo..."
                className="pl-10 bg-gray-50 border-gray-200 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Select value={departmentFilter || 'all'} onValueChange={(value) => setDepartmentFilter(value === 'all' ? null : value)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 md:flex-none bg-white">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOrder('asc')} className={sortOrder === 'asc' ? 'bg-indigo-50 text-indigo-600' : ''}>
                    Nome (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder('desc')} className={sortOrder === 'desc' ? 'bg-indigo-50 text-indigo-600' : ''}>
                    Nome (Z-A)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 md:flex-none bg-white">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Exportar lista</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
                    Exportar para Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="mr-2 h-4 w-4 text-red-600" />
                    Exportar para PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('email')}>
                    <Mail className="mr-2 h-4 w-4 text-purple-600" />
                    Enviar por Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {(searchTerm || departmentFilter || sortOrder !== 'asc') && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Filtros ativos:</span>

              {searchTerm && (
                <Badge variant="outline" className="bg-sky-50 text-sky-600 flex gap-1 pl-2 pr-1 py-1">
                  <span>Busca: {searchTerm}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full hover:bg-sky-100"
                    onClick={() => setSearchTerm('')}
                  >×</Button>
                </Badge>
              )}

              {departmentFilter && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 flex gap-1 pl-2 pr-1 py-1">
                  <span>Departamento: {departmentFilter}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full hover:bg-blue-100"
                    onClick={() => setDepartmentFilter(null)}
                  >×</Button>
                </Badge>
              )}

              {sortOrder !== 'asc' && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 flex gap-1 pl-2 pr-1 py-1">
                  <span>Ordem: Z-A</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full hover:bg-amber-200"
                    onClick={() => setSortOrder('asc')}
                  >×</Button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-sm text-gray-600 hover:text-blue-500"
                onClick={clearFilters}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end mb-4">
          <Button
            className="bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500 transition-colors"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
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
                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400 data-[state=active]:bg-yellow-300"></span>
                  Ativos <span className="ml-1.5 text-xs px-1.5 py-0.5 bg-gray-200 text-black rounded-full data-[state=active]:bg-blue-500">
                    {activeEmployees?.length}
                  </span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400 data-[state=active]:bg-red-300"></span>
                  Inativos <span className="ml-1.5 text-xs px-1.5 py-0.5 bg-gray-200 text-black rounded-full data-[state=active]:bg-blue-500">
                    {inactiveEmployees?.length}
                  </span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-0">
              {isLoadingEmployees ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin h-6 w-6 border-2 border-sky-500 border-t-transparent rounded-full"></div>
                  <span className="ml-2 text-gray-600">Carregando funcionários...</span>
                </div>
              ) : activeEmployees?.length > 0 ? (
                <div className="overflow-x-auto w-full">
                  <EmployeesTable employees={activeEmployees} />
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">Nenhum funcionário ativo encontrado</p>
                  <p className="text-gray-500 text-sm mb-4">
                    {searchTerm || departmentFilter
                      ? "Tente remover alguns filtros para ver mais resultados"
                      : "Adicione um novo funcionário para começar"}
                  </p>
                  {!(searchTerm || departmentFilter) && (
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-sky-400 to-blue-400"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Funcionário
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="inactive" className="mt-0">
              {isLoadingEmployees ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin h-6 w-6 border-2 border-sky-500 border-t-transparent rounded-full"></div>
                  <span className="ml-2 text-gray-600">Carregando funcionários...</span>
                </div>
              ) : inactiveEmployees?.length > 0 ? (
                <div className="overflow-x-auto w-full">
                  <EmployeesTable employees={inactiveEmployees} />
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">Nenhum funcionário inativo encontrado</p>
                  <p className="text-gray-500 text-sm">
                    {searchTerm || departmentFilter
                      ? "Tente remover alguns filtros para ver mais resultados"
                      : "Funcionários desativados aparecerão aqui"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-50 rounded-full">
                <Users className="h-5 w-5 text-sky-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Funcionários</p>
                <p className="text-xl font-bold">{employees?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-full">
                <Calendar className="h-5 w-5 text-teal-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Média de Tempo</p>
                <p className="text-xl font-bold">2.5 anos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-full">
                <FileSpreadsheet className="h-5 w-5 text-teal-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Última Atualização</p>
                <p className="text-xl font-bold">Hoje</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-full h-auto rounded-xl">
          {step === 1 && (
            <>
              <DialogHeader className="border-b pb-4">
                <DialogTitle className="text-xl font-bold text-sky-500">Novo Funcionário</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Preencha os dados do funcionário. Clique em cadastrar para continuar.
                </DialogDescription>
              </DialogHeader>

              <EmployeeForm
                onSubmit={handleCreateEmployee}
                onCancel={() => setIsCreateDialogOpen(false)}
                isSubmitting={isCreatingEmployee}
              />
            </>
          )}

          {step === 2 && (
            <>
              <DialogHeader className="border-b pb-4">
                <DialogTitle className="text-xl font-bold text-sky-500">Endereço</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Cadastre o endereço relacionado ao funcionário.
                </DialogDescription>
              </DialogHeader>

              <AddressForm
                userId={createdEmployeeId!}
                onCancel={() => {
                  setIsCreateDialogOpen(false)
                  setStep(1)
                  setCreatedEmployeeId(null)
                }}
                onSubmit={handleAddressSubmit}
              />
            </>
          )}

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
              <span>{steps[step - 1].title}</span>
              <span>Etapa {step} de {steps.length}</span>
            </div>
            <Progress
              value={progressValue}
              className="mb-4 h-2 bg-muted"
            />

          </div>


        </DialogContent>
      </Dialog>
    </div>
  )
} 