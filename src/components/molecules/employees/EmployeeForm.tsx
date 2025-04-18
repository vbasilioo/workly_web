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
  cpf: z.string().min(11, 'CPF é obrigatório'),
  rg: z.string().optional(),
  cnh: z.string().optional(),
  salary: z.coerce.number().positive('Salário deve ser maior que zero'),
  phone: z.string().optional(),
  hireDate: z.string().min(1, 'Data de contratação é obrigatória'),
  observations: z.string().optional(),
  cpfImageUrl: z.any().optional(),
  rgImageUrl: z.any().optional(),
  cnhImageUrl: z.any().optional(),
  position: z.string().min(1, 'Selecione um cargo'),
  department: z.string().min(1, 'Selecione um departamento'),
  endDate: z.string().optional(),
})

type EmployeeFormData = z.infer<typeof employeeSchema>

interface EmployeeFormProps {
  initialData?: Partial<EmployeeFormData>
  onSubmit: (data: EmployeeFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
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

const position = [
  'Desenvolvedor',
  'Designer',
  'Gerente',
  'Analista',
  'Coordenador',
  'Diretor',
  'Assistente',
]

export function EmployeeForm({ initialData, onSubmit, onCancel, isSubmitting: externalIsSubmitting }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData,
  })

  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : formIsSubmitting

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2 space-x-2">
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
          <Label htmlFor="position">Cargo</Label>
          <Select value={watch('position')} onValueChange={(value) => setValue('position', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cargo" />
            </SelectTrigger>
            <SelectContent>
              {position.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.position && (
            <p className="text-sm text-destructive">{errors.position.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="department">Departamento</Label>
          <Select value={watch('department')} onValueChange={(value) => setValue('department', value)}>
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
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" placeholder="000.000.000-00" {...register('cpf')} />
          {errors.cpf && <p className="text-sm text-destructive">{errors.cpf.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="rg">RG</Label>
          <Input id="rg" placeholder="00.000.000-0" {...register('rg')} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cnh">CNH</Label>
          <Input id="cnh" placeholder="00000000000" {...register('cnh')} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="salary">Salário</Label>
          <Input id="salary" type="number" step="0.01" placeholder="R$ 0,00" {...register('salary')} />
          {errors.salary && <p className="text-sm text-destructive">{errors.salary.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" placeholder='(00) 00000-0000' {...register('phone')} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hireDate">Data de contratação</Label>
          <Input id="hireDate" type="date" {...register('hireDate')} />
          {errors.hireDate && <p className="text-sm text-destructive">{errors.hireDate.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="observations">Observações</Label>
          <Input id="observations" placeholder="Informações adicionais" {...register('observations')} />
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
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-sky-400 hover:bg-sky-500 text-white"
        >
          {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  )
} 