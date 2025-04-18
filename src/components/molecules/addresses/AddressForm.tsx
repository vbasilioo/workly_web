'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Address } from '@/lib/types'

const addressSchema = z.object({
  street: z.string().min(3, 'Rua deve ter no mínimo 3 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 00000-000'),
  type: z.string().min(1, 'Tipo é obrigatório'),
})

type AddressFormData = z.infer<typeof addressSchema>

interface AddressFormProps {
  address?: Address
  onSubmit: (data: AddressFormData) => void
  isLoading: boolean
}

export function AddressForm({ address, onSubmit, isLoading }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: address?.street || '',
      number: address?.number || '',
      complement: address?.complement || '',
      neighborhood: address?.neighborhood || '',
      city: address?.city || '',
      state: address?.state || '',
      zipCode: address?.zipCode || '',
      type: address?.type || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="street">Logradouro</Label>
        <Input
          id="street"
          {...register('street')}
          placeholder="Av. Paulista"
          disabled={isLoading}
        />
        {errors.street && (
          <p className="text-sm text-red-500">{errors.street.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            {...register('number')}
            placeholder="1578"
            disabled={isLoading}
          />
          {errors.number && (
            <p className="text-sm text-red-500">{errors.number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            {...register('complement')}
            placeholder="Sala 304"
            disabled={isLoading}
          />
          {errors.complement && (
            <p className="text-sm text-red-500">{errors.complement.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input
          id="neighborhood"
          {...register('neighborhood')}
          placeholder="Bela Vista"
          disabled={isLoading}
        />
        {errors.neighborhood && (
          <p className="text-sm text-red-500">{errors.neighborhood.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="São Paulo"
            disabled={isLoading}
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            {...register('state')}
            placeholder="SP"
            maxLength={2}
            disabled={isLoading}
          />
          {errors.state && (
            <p className="text-sm text-red-500">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">CEP</Label>
        <Input
          id="zipCode"
          {...register('zipCode')}
          placeholder="00000-000"
          disabled={isLoading}
        />
        {errors.zipCode && (
          <p className="text-sm text-red-500">{errors.zipCode.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select 
          value={watch('type')} 
          onValueChange={(value) => setValue('type', value)}
          disabled={isLoading}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Comercial">Comercial</SelectItem>
            <SelectItem value="Residencial">Residencial</SelectItem>
            <SelectItem value="Depósito">Depósito</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500"
        disabled={isLoading}
      >
        {isLoading ? 'Salvando...' : address ? 'Atualizar Endereço' : 'Adicionar Endereço'}
      </Button>
    </form>
  )
} 