/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Eye, 
  FileSpreadsheet, 
  Copy, 
  Clock,
  UserCheck,
  Check
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EmployeeForm } from '@/components/molecules/employees/EmployeeForm'
import { Employee } from '@/lib/types'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type DialogType = 'edit' | 'deactivate' | 'reactivate' | 'view' | null

interface EmployeesTableProps {
  employees: Employee[]
}

const getDepartmentColor = (department: string) => {
  const colors: Record<string, string> = {
    'RH': 'bg-purple-500 text-white',
    'TI': 'bg-emerald-500 text-white',
    'Financeiro': 'bg-amber-500 text-white',
    'Marketing': 'bg-pink-500 text-white',
    'Vendas': 'bg-indigo-500 text-white',
    'Operações': 'bg-teal-500 text-white',
    'Administrativo': 'bg-gray-700 text-white',
    'Jurídico': 'bg-red-500 text-white',
    'Diretoria': 'bg-black text-white',
  }

  return colors[department] || 'bg-gray-600 text-white'
}

const getDepartmentBadgeColor = (department: string) => {
  const colors: Record<string, string> = {
    'RH': 'bg-purple-100 text-purple-700 border-purple-200',
    'TI': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Financeiro': 'bg-amber-100 text-amber-700 border-amber-200',
    'Marketing': 'bg-pink-100 text-pink-700 border-pink-200',
    'Vendas': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Operações': 'bg-teal-100 text-teal-700 border-teal-200',
    'Administrativo': 'bg-gray-100 text-gray-700 border-gray-200',
    'Jurídico': 'bg-red-100 text-red-700 border-red-200',
    'Diretoria': 'bg-black bg-opacity-10 text-gray-900 border-gray-300',
  }

  return colors[department] || 'bg-gray-100 text-gray-700 border-gray-200'
}

export function EmployeesTable({ employees }: EmployeesTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const { deleteEmployee, restoreEmployee, updateEmployee } = useEmployees()
  const employeeId = selectedEmployee?.id as string

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const handleAction = (employee: Employee, action: DialogType) => {
    setSelectedEmployee(employee)
    setDialogType(action)
  }

  const handleCloseDialog = () => {
    setSelectedEmployee(null)
    setDialogType(null)
  }

  const handleSubmit = async (data: any) => {
    if (!selectedEmployee) return
    
    try {
      await updateEmployee({ 
        id: employeeId, 
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          position: data.position,
          department: data.department,
          status: selectedEmployee.isActive ? 'active' : 'inactive'
        } 
      })
      handleCloseDialog()
    } catch (error) {
      console.error('Error updating employee:', error)
    }
  }

  const handleConfirmDeactivate = async () => {
    if (!selectedEmployee) return
    
    try {
      await deleteEmployee(employeeId)
      handleCloseDialog()
    }
    catch (error) {
      console.error('Error deactivating employee:', error)
    }
  }

  const handleConfirmReactivate = async () => {
    if (!selectedEmployee) return
    
    try {
      await restoreEmployee(employeeId)
      handleCloseDialog()
    } catch (error) {
      console.error('Error reactivating employee:', error)
    }
  }

  const getRowColor = (index: number, isActive: boolean) => {
    if (!isActive) return "bg-gray-50"
    return index % 2 === 0 ? "bg-white" : "bg-gray-50"
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied(true)
        toast.success('ID copiado para a área de transferência')
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch(err => {
        console.error('Erro ao copiar: ', err)
        toast.error('Erro ao copiar ID')
      })
  }

  const exportEmployeeData = (employee: Employee) => {
    try {
      const { id, name, email, department, position, hireDate, phone, rg } = employee;
      const exportData = { id, name, email, department, position, hireDate, phone, rg };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `funcionario-${employee.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Dados exportados com sucesso');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast.error('Erro ao exportar dados');
    }
  };

  return (
    <>
      <div className="rounded-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-400 hover:to-blue-400">
              <TableHead className="text-white font-semibold">Funcionário</TableHead>
              <TableHead className="text-white font-semibold">Cargo</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">Departamento</TableHead>
              <TableHead className="hidden md:table-cell text-white font-semibold">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Data de Início</span>
                </div>
              </TableHead>
              {employees[0]?.isActive === false && (
                <TableHead className="hidden md:table-cell text-white font-semibold">Data de Saída</TableHead>
              )}
              <TableHead className="w-[70px] text-white font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow 
                key={employee.id} 
                className={cn(
                  "transition-colors",
                  hoveredRow === employee.id 
                    ? "bg-sky-50" 
                    : getRowColor(index, employee.isActive),
                  employee.isActive === false && "bg-opacity-60"
                )}
                onMouseEnter={() => setHoveredRow(employee.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-white shadow-sm">
                      <AvatarFallback className={getDepartmentColor(employee.department)}>
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{employee.name}</span>
                        {!employee.isActive && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600 text-xs py-0">Inativo</Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground md:hidden">
                        {employee.department}
                      </span>
                      <span className="text-sm text-gray-600 italic hover:text-blue-600 hover:underline cursor-pointer">
                        {employee.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{employee.position}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge className={cn("font-normal", getDepartmentBadgeColor(employee.department))}>
                    {employee.department}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-gray-600">
                  {formatDate(employee.hireDate)}
                </TableCell>
                {employee.isActive === false && (
                  <TableCell className="hidden md:table-cell text-red-600">
                    {employee.createdAt && formatDate(employee.createdAt)}
                  </TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "rounded-full transition-colors",
                          hoveredRow === employee.id ? "bg-sky-50 text-sky-500" : "hover:bg-sky-50 hover:text-sky-500"
                        )}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleAction(employee, 'view')}>
                        <Eye className="mr-2 h-4 w-4 text-sky-500" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction(employee, 'edit')}>
                        <Pencil className="mr-2 h-4 w-4 text-amber-600" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard(employee.id)}>
                        {isCopied ? (
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4 text-gray-600" />
                        )}
                        Copiar ID
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportEmployeeData(employee)}>
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-sky-500" />
                        Exportar dados
                      </DropdownMenuItem>
                      {employee.isActive ? (
                        <DropdownMenuItem
                          className="text-blue-500 focus:text-blue-600 focus:bg-blue-50"
                          onClick={() => handleAction(employee, 'deactivate')}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Desativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          className="text-sky-500 focus:text-sky-600 focus:bg-sky-50"
                          onClick={() => handleAction(employee, 'reactivate')}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reativar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum funcionário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogType === 'edit'} onOpenChange={() => dialogType === 'edit' && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto scrollbar-custom">
          <DialogHeader>
            <DialogTitle className="text-xl text-sky-500">Editar Funcionário</DialogTitle>
            <DialogDescription>
              Atualize as informações do funcionário. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm
              initialData={selectedEmployee}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'deactivate'} onOpenChange={() => dialogType === 'deactivate' && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Desativar Funcionário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja desativar este funcionário? Esta ação pode ser revertida posteriormente.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              O funcionário {selectedEmployee?.name} será marcado como inativo e não aparecerá mais na lista de funcionários ativos.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeactivate}>
              Confirmar Desativação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'reactivate'} onOpenChange={() => dialogType === 'reactivate' && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-500">Reativar Funcionário</DialogTitle>
            <DialogDescription>
              Deseja reativar este funcionário? Ele aparecerá novamente na lista de funcionários ativos.
            </DialogDescription>
          </DialogHeader>
          <Alert className="bg-blue-50 border-blue-100 text-blue-600">
            <UserCheck className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-500">Confirmação</AlertTitle>
            <AlertDescription>
              O funcionário {selectedEmployee?.name} será reativado e voltará a aparecer na lista de funcionários ativos.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button 
              className="bg-blue-400 hover:bg-blue-500 text-white" 
              onClick={handleConfirmReactivate}
            >
              Confirmar Reativação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'view'} onOpenChange={() => dialogType === 'view' && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-sky-500 flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={selectedEmployee ? getDepartmentColor(selectedEmployee.department) : ''}>
                  {selectedEmployee ? getInitials(selectedEmployee.name) : ''}
                </AvatarFallback>
              </Avatar>
              {selectedEmployee?.name}
            </DialogTitle>
            <DialogDescription>
              Informações detalhadas do funcionário
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="italic text-gray-600">{selectedEmployee.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">RG</p>
                <p className="font-mono">{selectedEmployee.rg}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Cargo</p>
                <p>{selectedEmployee.position}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Departamento</p>
                <Badge className={getDepartmentBadgeColor(selectedEmployee.department)}>
                  {selectedEmployee.department}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Data de Início</p>
                <p>{formatDate(selectedEmployee.hireDate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={selectedEmployee.isActive ? "default" : "outline"} className={selectedEmployee.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-700"}>
                  {selectedEmployee.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleCloseDialog}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 