'use client'

import { Eye, Edit, MoreVertical, RefreshCw, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Settings } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { SettingsForm } from '@/components/molecules/settings/SettingsForm'

interface SettingsTableProps {
  settings: Settings[]
  isLoading: boolean
  isInactive?: boolean
  onEdit: (setting: Settings) => void
  onDelete?: (id: string) => void
  onRestore?: (id: string) => void
}

export function SettingsTable({ 
  settings, 
  isLoading, 
  isInactive = false,
  onEdit,
  onDelete,
  onRestore
}: SettingsTableProps) {
  const [settingDetail, setSettingDetail] = useState<Settings | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleViewDetails = (setting: Settings) => {
    setSettingDetail(setting)
    setIsDetailOpen(true)
  }

  const renderValue = (value: any) => {
    if (value === null || value === undefined) return '-'
    
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    
    if (typeof value === 'boolean') {
      return value ? 
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativado</Badge> : 
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Desativado</Badge>
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    
    return String(value)
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[200px]">Chave</TableHead>
              <TableHead className="w-[250px]">Valor</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Visibilidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            )}

            {!isLoading && settings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma configuração {isInactive ? 'inativa' : ''} encontrada.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && settings.map((setting) => (
              <TableRow key={setting.id}>
                <TableCell>
                  <div className="font-medium">
                    {setting.key}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">
                    {setting.description}
                  </div>
                </TableCell>
                <TableCell>
                  {renderValue(setting.value)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline" 
                    className={`
                      ${setting.group === 'company' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                      ${setting.group === 'email' ? 'border-purple-200 bg-purple-50 text-purple-700' : ''}
                      ${setting.group === 'system' ? 'border-gray-200 bg-gray-50 text-gray-700' : ''}
                      ${setting.group === 'files' ? 'border-amber-200 bg-amber-50 text-amber-700' : ''}
                      ${setting.group === 'support' ? 'border-green-200 bg-green-50 text-green-700' : ''}
                      ${setting.group === 'notifications' ? 'border-cyan-200 bg-cyan-50 text-cyan-700' : ''}
                    `}
                  >
                    {setting.group}
                  </Badge>
                </TableCell>
                <TableCell>
                  {setting.isPublic ? (
                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                      Pública
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                      Privada
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Abrir menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => handleViewDetails(setting)}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit(setting)}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!isInactive ? (
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer"
                          onClick={() => onDelete?.(setting.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Desativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          className="text-green-600 cursor-pointer"
                          onClick={() => onRestore?.(setting.id)}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Restaurar
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

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Configuração</DialogTitle>
            <DialogDescription>
              Informações completas sobre a configuração.
            </DialogDescription>
          </DialogHeader>
          
          {settingDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Chave</h3>
                  <p className="mt-1 font-mono text-sm">{settingDetail.key}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                  <p className="mt-1">{settingDetail.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Valor</h3>
                  <div className="mt-1 font-mono text-sm break-all">
                    {typeof settingDetail.value === 'object' 
                      ? JSON.stringify(settingDetail.value, null, 2) 
                      : String(settingDetail.value)
                    }
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Grupo</h3>
                  <p className="mt-1">
                    <Badge
                      variant="outline" 
                      className={`
                        ${settingDetail.group === 'company' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                        ${settingDetail.group === 'email' ? 'border-purple-200 bg-purple-50 text-purple-700' : ''}
                        ${settingDetail.group === 'system' ? 'border-gray-200 bg-gray-50 text-gray-700' : ''}
                        ${settingDetail.group === 'files' ? 'border-amber-200 bg-amber-50 text-amber-700' : ''}
                        ${settingDetail.group === 'support' ? 'border-green-200 bg-green-50 text-green-700' : ''}
                        ${settingDetail.group === 'notifications' ? 'border-cyan-200 bg-cyan-50 text-cyan-700' : ''}
                      `}
                    >
                      {settingDetail.group}
                    </Badge>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Visibilidade</h3>
                  <p className="mt-1">
                    {settingDetail.isPublic ? (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                        Pública
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                        Privada
                      </Badge>
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    {settingDetail.isActive ? (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                        Inativo
                      </Badge>
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Criado em</h3>
                  <p className="mt-1">{format(new Date(settingDetail.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Atualizado em</h3>
                  <p className="mt-1">{format(new Date(settingDetail.updatedAt), 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 