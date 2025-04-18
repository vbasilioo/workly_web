/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Plus, 
  Filter, 
  Download, 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  FileSpreadsheet, 
  FileText, 
  Mail,
  Building
} from 'lucide-react'
import { AddressesTable } from '@/components/organisms/dashboard/AddressesTable'
import { AddressForm } from '@/components/molecules/addresses/AddressForm'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { mockAddresses } from '@/lib/mock/addresses'
import { Address } from '@/lib/types'
import { toast } from 'sonner'

export default function AddressesPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleCreateAddress = async (data: any) => {
    try {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newAddress = {
        id: `address-${Math.floor(Math.random() * 1000)}`,
        street: data.street,
        number: data.number,
        complement: data.complement || '',
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        type: data.type,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setAddresses(prev => [...prev, newAddress])
      setIsCreateDialogOpen(false)
      toast.success('Endereço criado com sucesso')
    }
    catch (error) {
      console.error('Error creating address:', error)
      toast.error('Erro ao criar endereço')
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => 
      prev.map(address => 
        address.id === id ? {...address, isActive: false} : address
      )
    )
    toast.success('Endereço desativado com sucesso')
  }

  const handleRestoreAddress = (id: string) => {
    setAddresses(prev => 
      prev.map(address => 
        address.id === id ? {...address, isActive: true} : address
      )
    )
    toast.success('Endereço restaurado com sucesso')
  }

  const filterAddresses = (addressesList: Address[]) => {
    return addressesList
      .filter(address => 
        (searchTerm === '' || 
          address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.zipCode.toLowerCase().includes(searchTerm.toLowerCase())
        ) && 
        (typeFilter === null || address.type === typeFilter)
      )
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.city.localeCompare(b.city)
        } else {
          return b.city.localeCompare(a.city)
        }
      })
  }
  
  const activeAddresses = filterAddresses(addresses.filter((address) => address.isActive === true))
  const inactiveAddresses = filterAddresses(addresses.filter((address) => address.isActive === false))

  const types = [...new Set(addresses.map(a => a.type).filter(Boolean))]
  
  const handleExport = (format: 'excel' | 'pdf' | 'email') => {
    switch (format) {
      case 'excel':
        toast.info('Exportando para Excel...')
        break
      case 'pdf':
        toast.info('Exportando para PDF...')
        break
      case 'email':
        toast.info('Enviando por email...')
        break
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setTypeFilter(null)
    setSortOrder('asc')
  }

  return (
      <div className="w-full min-h-screen bg-gray-50 pt-6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">
              Endereços
            </h1>
            
            <div className="flex items-center gap-2">
              <Button
                className="bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500 transition-colors"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Endereço
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Buscar por rua, cidade, estado, CEP..." 
                  className="pl-10 bg-gray-50 border-gray-200 w-full" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <Select value={typeFilter || 'all'} onValueChange={(value) => setTypeFilter(value === 'all' ? null : value)}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
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
                      Cidade (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('desc')} className={sortOrder === 'desc' ? 'bg-indigo-50 text-indigo-600' : ''}>
                      Cidade (Z-A)
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
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Exportar para Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Exportar para PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('email')}>
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar por Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {(searchTerm || typeFilter || sortOrder !== 'asc') && (
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
                
                {typeFilter && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 flex gap-1 pl-2 pr-1 py-1">
                    <span>Tipo: {typeFilter}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full hover:bg-blue-100" 
                      onClick={() => setTypeFilter(null)}
                    >×</Button>
                  </Badge>
                )}
                
                {sortOrder !== 'asc' && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 flex gap-1 pl-2 pr-1 py-1">
                    <span>Ordenação: Z-A</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full hover:bg-amber-100" 
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

          <Tabs defaultValue="active" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-4">
              <TabsTrigger 
                value="active" 
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600"
              >
                <Building className="h-4 w-4 mr-2" />
                Endereços Ativos
              </TabsTrigger>
              <TabsTrigger 
                value="inactive" 
                className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Endereços Inativos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <AddressesTable 
                addresses={activeAddresses}
                isLoading={isLoading}
                onDelete={handleDeleteAddress}
              />
            </TabsContent>
            
            <TabsContent value="inactive">
              <AddressesTable 
                addresses={inactiveAddresses}
                isLoading={isLoading}
                isInactive
                onRestore={handleRestoreAddress}
              />
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Endereço</DialogTitle>
              <DialogDescription>
                Preencha o formulário para adicionar um novo endereço.
              </DialogDescription>
            </DialogHeader>
            
            <AddressForm 
              onSubmit={handleCreateAddress}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
  )
} 