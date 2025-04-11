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
import { MoreHorizontal, Pencil, Trash2, RotateCcw, AlertTriangle } from 'lucide-react'
import { EmployeeForm } from '@/components/molecules/employees/EmployeeForm'

interface Employee {
  id: string
  name: string
  email: string
  role: string
  department: string
  startDate: string
  endDate?: string
  status: 'active' | 'inactive'
}

interface EmployeesTableProps {
  employees: Employee[]
}

type DialogType = 'edit' | 'deactivate' | 'reactivate' | null

export function EmployeesTable({ employees }: EmployeesTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [dialogType, setDialogType] = useState<DialogType>(null)

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
    // TODO: Implementar integração com backend
    console.log('Form submitted:', data)
    handleCloseDialog()
  }

  const handleConfirmDeactivate = async () => {
    // TODO: Implementar integração com backend
    console.log('Deactivating employee:', selectedEmployee?.id)
    handleCloseDialog()
  }

  const handleConfirmReactivate = async () => {
    // TODO: Implementar integração com backend
    console.log('Reactivating employee:', selectedEmployee?.id)
    handleCloseDialog()
  }

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead>Funcionário</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="hidden md:table-cell">Departamento</TableHead>
              <TableHead className="hidden md:table-cell">Data de Início</TableHead>
              {employees[0]?.status === 'inactive' && (
                <TableHead className="hidden md:table-cell">Data de Saída</TableHead>
              )}
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{employee.name}</span>
                      <span className="text-sm text-muted-foreground md:hidden">
                        {employee.role}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {employee.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{employee.role}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {employee.department}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(employee.startDate)}
                </TableCell>
                {employee.status === 'inactive' && (
                  <TableCell className="hidden md:table-cell">
                    {employee.endDate && formatDate(employee.endDate)}
                  </TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAction(employee, 'edit')}>
                        <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                        Editar
                      </DropdownMenuItem>
                      {employee.status === 'active' ? (
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive" 
                          onClick={() => handleAction(employee, 'deactivate')}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Desativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleAction(employee, 'reactivate')}>
                          <RotateCcw className="mr-2 h-4 w-4 text-muted-foreground" />
                          Reativar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Edição */}
      <Dialog open={dialogType === 'edit'} onOpenChange={() => dialogType === 'edit' && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
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

      {/* Modal de Desativação */}
      <Dialog open={dialogType === 'deactivate'} onOpenChange={() => dialogType === 'deactivate' && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desativar Funcionário</DialogTitle>
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

      {/* Modal de Reativação */}
      <Dialog open={dialogType === 'reactivate'} onOpenChange={() => dialogType === 'reactivate' && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reativar Funcionário</DialogTitle>
            <DialogDescription>
              Deseja reativar este funcionário? Ele voltará a aparecer na lista de funcionários ativos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmReactivate}>
              Confirmar Reativação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 