'use client'

import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Settings } from '@/lib/types'

const settingsSchema = z.object({
  key: z.string().min(1, 'Chave é obrigatória')
    .regex(/^[a-z0-9_]+$/, 'Use apenas letras minúsculas, números e underscores'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  group: z.string().min(1, 'Grupo é obrigatório'),
  isPublic: z.boolean().default(false),
  valueType: z.enum(['string', 'number', 'boolean', 'array', 'object']),
  valueString: z.string().optional(),
  valueNumber: z.string().optional(),
  valueBoolean: z.boolean().default(false),
  valueArray: z.string().optional(),
  valueObject: z.string().optional(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

interface SettingsFormProps {
  setting?: Settings
  onSubmit: (data: any) => void
  isLoading: boolean
}

export function SettingsForm({ setting, onSubmit, isLoading }: SettingsFormProps) {
  const getInitialValueType = (value: any): 'string' | 'number' | 'boolean' | 'array' | 'object' => {
    if (value === undefined || value === null) return 'string'
    if (typeof value === 'boolean') return 'boolean'
    if (typeof value === 'number') return 'number'
    if (Array.isArray(value)) return 'array'
    if (typeof value === 'object') return 'object'
    return 'string'
  }

  const getInitialValue = (value: any, type: string): any => {
    if (value === undefined || value === null) return ''
    
    if (type === 'array' && Array.isArray(value)) {
      return value.join(', ')
    }
    
    if (type === 'object' && typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    
    return String(value)
  }

  const initialValueType = setting ? getInitialValueType(setting.value) : 'string'
  
  const settingIsPublic = typeof setting?.isPublic === 'boolean' ? setting.isPublic : false
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: {
      key: setting?.key ?? '',
      description: setting?.description ?? '',
      group: setting?.group ?? '',
      isPublic: settingIsPublic,
      valueType: initialValueType,
      valueString: initialValueType === 'string' ? String(setting?.value || '') : '',
      valueNumber: initialValueType === 'number' ? String(setting?.value || '') : '',
      valueBoolean: initialValueType === 'boolean' ? Boolean(setting?.value) : false,
      valueArray: initialValueType === 'array' ? getInitialValue(setting?.value, 'array') : '',
      valueObject: initialValueType === 'object' ? getInitialValue(setting?.value, 'object') : '',
    },
  })

  const valueType = watch('valueType')
  const isEdit = !!setting

  const processSubmit = (data: SettingsFormData) => {
    let processedValue: any

    switch (data.valueType) {
      case 'string':
        processedValue = data.valueString
        break
      case 'number':
        processedValue = Number(data.valueNumber)
        break
      case 'boolean':
        processedValue = data.valueBoolean
        break
      case 'array':
        try {
          processedValue = data.valueArray
            ? data.valueArray.split(',').map(item => item.trim())
            : []
        } catch (error) {
          processedValue = []
        }
        break
      case 'object':
        try {
          processedValue = data.valueObject ? JSON.parse(data.valueObject) : {}
        } catch (error) {
          processedValue = {}
        }
        break
      default:
        processedValue = data.valueString
    }

    const finalData = {
      key: data.key,
      description: data.description,
      group: data.group,
      isPublic: data.isPublic,
      value: processedValue,
    }

    onSubmit(finalData)
  }
  return (
    <form onSubmit={handleSubmit(processSubmit as SubmitHandler<FieldValues>)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="key">Chave</Label>
        <Input
          id="key"
          {...register('key')}
          placeholder="nome_da_configuracao"
          disabled={isLoading || isEdit}
          className={isEdit ? "bg-gray-100" : ""}
        />
        {errors.key && (
          <p className="text-sm text-red-500">{errors.key.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Descreva o propósito desta configuração"
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="group">Grupo</Label>
        <Select 
          value={watch('group')} 
          onValueChange={(value) => setValue('group', value)}
          disabled={isLoading}
        >
          <SelectTrigger id="group">
            <SelectValue placeholder="Selecione o grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="company">Empresa</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
            <SelectItem value="files">Arquivos</SelectItem>
            <SelectItem value="support">Suporte</SelectItem>
            <SelectItem value="notifications">Notificações</SelectItem>
          </SelectContent>
        </Select>
        {errors.group && (
          <p className="text-sm text-red-500">{errors.group.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="valueType">Tipo de Valor</Label>
        <Select 
          value={watch('valueType')} 
          onValueChange={(value: 'string' | 'number' | 'boolean' | 'array' | 'object') => setValue('valueType', value)}
          disabled={isLoading}
        >
          <SelectTrigger id="valueType">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">Texto</SelectItem>
            <SelectItem value="number">Número</SelectItem>
            <SelectItem value="boolean">Booleano</SelectItem>
            <SelectItem value="array">Lista</SelectItem>
            <SelectItem value="object">Objeto JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Valor</Label>
        
        {valueType === 'string' && (
          <Input
            id="valueString"
            {...register('valueString')}
            placeholder="Valor de texto"
            disabled={isLoading}
          />
        )}
        
        {valueType === 'number' && (
          <Input
            id="valueNumber"
            {...register('valueNumber')}
            placeholder="123"
            type="number"
            disabled={isLoading}
          />
        )}
        
        {valueType === 'boolean' && (
          <div className="flex items-center space-x-2">
            <Switch
              id="valueBoolean"
              checked={watch('valueBoolean')}
              onCheckedChange={(checked: boolean) => setValue('valueBoolean', checked)}
              disabled={isLoading}
            />
            <Label htmlFor="valueBoolean">
              {watch('valueBoolean') ? 'Ativado' : 'Desativado'}
            </Label>
          </div>
        )}
        
        {valueType === 'array' && (
          <>
            <Textarea
              id="valueArray"
              {...register('valueArray')}
              placeholder="valor1, valor2, valor3"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">Separe os valores por vírgulas</p>
          </>
        )}
        
        {valueType === 'object' && (
          <>
            <Textarea
              id="valueObject"
              {...register('valueObject')}
              placeholder='{"chave": "valor"}'
              rows={5}
              disabled={isLoading}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">Digite um objeto JSON válido</p>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isPublic"
          checked={watch('isPublic')}
          onCheckedChange={(checked: boolean) => setValue('isPublic', checked)}
          disabled={isLoading}
        />
        <Label htmlFor="isPublic">Configuração pública</Label>
      </div>
      <p className="text-xs text-gray-500">
        Configurações públicas podem ser acessadas sem autenticação
      </p>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500"
        disabled={isLoading}
      >
        {isLoading ? 'Salvando...' : isEdit ? 'Atualizar Configuração' : 'Adicionar Configuração'}
      </Button>
    </form>
  )
} 