'use client'

import { Eye, MoreVertical, RefreshCw, Trash2 } from 'lucide-react'
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
import { format } from 'date-fns'
import { Address } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface AddressesTableProps {
  addresses: Address[]
  isLoading: boolean
  isInactive?: boolean
  onDelete?: (id: string) => void
  onRestore?: (id: string) => void
}

export function AddressesTable({ 
  addresses, 
  isLoading, 
  isInactive = false,
  onDelete,
  onRestore
}: AddressesTableProps) {
  const [addressDetail, setAddressDetail] = useState<Address | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleViewDetails = (address: Address) => {
    setAddressDetail(address)
    setIsDetailOpen(true)
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[250px]">Endereço</TableHead>
              <TableHead>Cidade/Estado</TableHead>
              <TableHead>CEP</TableHead>
              <TableHead>Tipo</TableHead>
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
                    <Skeleton className="h-6 w-24" />
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

            {!isLoading && addresses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum endereço {isInactive ? 'inativo' : ''} encontrado.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && addresses.map((address) => {
              const createdDate = new Date(address.createdAt)
              
              return (
                <TableRow key={address.id}>
                  <TableCell>
                    <div className="font-medium">
                      {address.street}, {address.number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {address.complement ? `${address.complement}, ` : ''}
                      {address.neighborhood}
                    </div>
                  </TableCell>
                  <TableCell>
                    {address.city}, {address.state}
                  </TableCell>
                  <TableCell>
                    {address.zipCode}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline" 
                      className={`
                        ${address.type === 'Comercial' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                        ${address.type === 'Residencial' ? 'border-green-200 bg-green-50 text-green-700' : ''}
                        ${address.type === 'Depósito' ? 'border-amber-200 bg-amber-50 text-amber-700' : ''}
                      `}
                    >
                      {address.type}
                    </Badge>
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
                          onClick={() => handleViewDetails(address)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {!isInactive ? (
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer"
                            onClick={() => onDelete?.(address.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Desativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-green-600 cursor-pointer"
                            onClick={() => onRestore?.(address.id)}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Restaurar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Endereço</DialogTitle>
            <DialogDescription>
              Informações completas sobre o endereço.
            </DialogDescription>
          </DialogHeader>
          
          {addressDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Logradouro</h3>
                  <p className="mt-1">{addressDetail.street}, {addressDetail.number}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Complemento</h3>
                  <p className="mt-1">{addressDetail.complement || '-'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bairro</h3>
                  <p className="mt-1">{addressDetail.neighborhood}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cidade/Estado</h3>
                  <p className="mt-1">{addressDetail.city}, {addressDetail.state}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">CEP</h3>
                  <p className="mt-1">{addressDetail.zipCode}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                  <p className="mt-1">
                    <Badge
                      variant="outline" 
                      className={`
                        ${addressDetail.type === 'Comercial' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                        ${addressDetail.type === 'Residencial' ? 'border-green-200 bg-green-50 text-green-700' : ''}
                        ${addressDetail.type === 'Depósito' ? 'border-amber-200 bg-amber-50 text-amber-700' : ''}
                      `}
                    >
                      {addressDetail.type}
                    </Badge>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data de Cadastro</h3>
                  <p className="mt-1">{format(new Date(addressDetail.createdAt), 'dd/MM/yyyy')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 