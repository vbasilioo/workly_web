'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const employeeSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.string().min(1, 'Selecione um cargo'),
  department: z.string().min(1, 'Selecione um departamento'),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().optional(),
})

type EmployeeFormData = z.infer<typeof employeeSchema>

interface EmployeeFormProps {
  initialData?: Partial<EmployeeFormData>
  onSubmit: (data: EmployeeFormData) => void
  onCancel: () => void
}

const departments = [
  'Tecnologia',
  'Design',
  'Marketing',
  'Vendas',
  'RH',
  'Financeiro',
  'Administração',
]

const roles = [
  'Desenvolvedor',
  'Designer',
  'Gerente',
  'Analista',
  'Coordenador',
  'Diretor',
  'Assistente',
]

export function EmployeeForm({ initialData, onSubmit, onCancel }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            placeholder="João da Silva"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="joao@workly.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">Cargo</Label>
          <Select onValueChange={(value) => register('role').onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cargo" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-destructive">{errors.role.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="department">Departamento</Label>
          <Select onValueChange={(value) => register('department').onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um departamento" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-sm text-destructive">{errors.department.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="startDate">Data de início</Label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate')}
          />
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate.message}</p>
          )}
        </div>

        {initialData?.endDate !== undefined && (
          <div className="grid gap-2">
            <Label htmlFor="endDate">Data de saída</Label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate')}
            />
            {errors.endDate && (
              <p className="text-sm text-destructive">{errors.endDate.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  )
} 