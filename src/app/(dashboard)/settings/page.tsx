'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Settings2, 
  SlidersHorizontal, 
  Lock, 
  FileText, 
  RefreshCw
} from 'lucide-react'
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
import { mockSettings } from '@/lib/mock/settings'
import { Settings } from '@/lib/types'
import { toast } from 'sonner'
import { SettingsTable } from '@/components/organisms/dashboard/SettingsTable'
import { SettingsForm } from '@/components/molecules/settings/SettingsForm'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings[]>(mockSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentSetting, setCurrentSetting] = useState<Settings | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [groupFilter, setGroupFilter] = useState<string | null>(null)
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleCreateSetting = async (data: any) => {
    try {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newSetting = {
        id: `setting-${Math.floor(Math.random() * 1000)}`,
        key: data.key,
        value: data.value,
        group: data.group,
        description: data.description,
        isPublic: data.isPublic,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setSettings(prev => [...prev, newSetting])
      setIsCreateDialogOpen(false)
      toast.success('Configuração criada com sucesso')
    }
    catch (error) {
      console.error('Error creating setting:', error)
      toast.error('Erro ao criar configuração')
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleEditSetting = async (data: any) => {
    try {
      if (!currentSetting) return
      
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedSetting = {
        ...currentSetting,
        description: data.description,
        group: data.group,
        value: data.value,
        isPublic: data.isPublic,
        updatedAt: new Date().toISOString()
      }
      
      setSettings(prev => 
        prev.map(setting => 
          setting.id === currentSetting.id ? updatedSetting : setting
        )
      )
      
      setIsEditDialogOpen(false)
      setCurrentSetting(null)
      toast.success('Configuração atualizada com sucesso')
    }
    catch (error) {
      console.error('Error updating setting:', error)
      toast.error('Erro ao atualizar configuração')
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleOpenEditDialog = (setting: Settings) => {
    setCurrentSetting(setting)
    setIsEditDialogOpen(true)
  }

  const handleDeleteSetting = (id: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? {...setting, isActive: false} : setting
      )
    )
    toast.success('Configuração desativada com sucesso')
  }

  const handleRestoreSetting = (id: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? {...setting, isActive: true} : setting
      )
    )
    toast.success('Configuração restaurada com sucesso')
  }

  const handleInitializeDefaultSettings = async () => {
    try {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Configurações padrão inicializadas com sucesso')
    }
    catch (error) {
      toast.error('Erro ao inicializar configurações padrão')
    }
    finally {
      setIsLoading(false)
    }
  }

  const filterSettings = (settingsList: Settings[]) => {
    let filtered = settingsList
    
    if (searchTerm) {
      filtered = filtered.filter(setting => 
        setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(setting.value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (groupFilter) {
      filtered = filtered.filter(setting => setting.group === groupFilter)
    }
    
    if (visibilityFilter !== 'all') {
      filtered = filtered.filter(setting => 
        visibilityFilter === 'public' ? setting.isPublic : !setting.isPublic
      )
    }
    
    filtered = filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.key.localeCompare(b.key)
      } else {
        return b.key.localeCompare(a.key)
      }
    })
    
    return filtered
  }
  
  const allSettings = filterSettings(settings)
  const activeSettings = filterSettings(settings.filter(s => s.isActive))
  const inactiveSettings = filterSettings(settings.filter(s => !s.isActive))
  
  const groups = [...new Set(settings.map(s => s.group))]
  
  const clearFilters = () => {
    setSearchTerm('')
    setGroupFilter(null)
    setVisibilityFilter('all')
    setSortOrder('asc')
  }

  return (
      <div className="w-full min-h-screen bg-gray-50 pt-6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">
              Configurações do Sistema
            </h1>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleInitializeDefaultSettings}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Restaurar Padrões
              </Button>
              
              <Button
                className="bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500 transition-colors"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Configuração
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Buscar por chave, descrição ou valor..." 
                  className="pl-10 bg-gray-50 border-gray-200 w-full" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <Select value={groupFilter || 'all'} onValueChange={(value) => setGroupFilter(value === 'all' ? null : value)}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os grupos</SelectItem>
                    {groups.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1 md:flex-none bg-white">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filtros
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filtros</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs font-normal text-gray-500 pt-2">
                      Visibilidade
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setVisibilityFilter('all')} className={visibilityFilter === 'all' ? 'bg-sky-50 text-sky-600' : ''}>
                      Todas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVisibilityFilter('public')} className={visibilityFilter === 'public' ? 'bg-sky-50 text-sky-600' : ''}>
                      <Lock className="mr-2 h-4 w-4" />
                      Públicas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVisibilityFilter('private')} className={visibilityFilter === 'private' ? 'bg-sky-50 text-sky-600' : ''}>
                      <Lock className="mr-2 h-4 w-4" />
                      Privadas
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                      Ordenação
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setSortOrder('asc')} className={sortOrder === 'asc' ? 'bg-sky-50 text-sky-600' : ''}>
                      Chave (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('desc')} className={sortOrder === 'desc' ? 'bg-sky-50 text-sky-600' : ''}>
                      Chave (Z-A)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {(searchTerm || groupFilter || visibilityFilter !== 'all' || sortOrder !== 'asc') && (
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
                
                {groupFilter && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 flex gap-1 pl-2 pr-1 py-1">
                    <span>Grupo: {groupFilter}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full hover:bg-blue-100" 
                      onClick={() => setGroupFilter(null)}
                    >×</Button>
                  </Badge>
                )}
                
                {visibilityFilter !== 'all' && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-600 flex gap-1 pl-2 pr-1 py-1">
                    <span>Visibilidade: {visibilityFilter === 'public' ? 'Públicas' : 'Privadas'}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full hover:bg-purple-100" 
                      onClick={() => setVisibilityFilter('all')}
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

          <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="data-[state=active]:bg-sky-50 data-[state=active]:text-sky-600">
                <Settings2 className="h-4 w-4 mr-2" />
                Todas
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600">
                <FileText className="h-4 w-4 mr-2" />
                Ativas
              </TabsTrigger>
              <TabsTrigger value="inactive" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
                <FileText className="h-4 w-4 mr-2" />
                Inativas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <SettingsTable 
                settings={allSettings}
                isLoading={isLoading}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteSetting}
              />
            </TabsContent>
            
            <TabsContent value="active">
              <SettingsTable 
                settings={activeSettings}
                isLoading={isLoading}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteSetting}
              />
            </TabsContent>
            
            <TabsContent value="inactive">
              <SettingsTable 
                settings={inactiveSettings}
                isLoading={isLoading}
                isInactive
                onEdit={handleOpenEditDialog}
                onRestore={handleRestoreSetting}
              />
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nova Configuração</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar uma nova configuração.
              </DialogDescription>
            </DialogHeader>
            
            <SettingsForm
              onSubmit={handleCreateSetting}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Configuração</DialogTitle>
              <DialogDescription>
                Atualize os campos da configuração.
              </DialogDescription>
            </DialogHeader>
            
            {currentSetting && (
              <SettingsForm
                setting={currentSetting}
                onSubmit={handleEditSetting}
                isLoading={isLoading}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
  )
} 