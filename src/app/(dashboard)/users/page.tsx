/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { UsersTable } from '@/components/organisms/dashboard/UsersTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Filter, Search, UserCog, Loader2 } from 'lucide-react'
import { useUsers } from '@/lib/hooks/useUsers'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserForm } from '@/components/molecules/UserForm'
import { User, CreateUserRequest, UpdateUserRequest } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  const { 
    users, 
    isLoadingUsers, 
    createUser, 
    isCreatingUser, 
    updateUser,
    isUpdatingUser,
    deleteUser,
    isDeletingUser
  } = useUsers()

  useEffect(() => {
    if (users) {
      const filtered = users.filter(user => {
        const matchesSearch = 
          searchTerm === '' || 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesRole = roleFilter === null || user.role === roleFilter

        return matchesSearch && matchesRole
      })
      
      setFilteredUsers(filtered)
    }
  }, [users, searchTerm, roleFilter])

  const handleCreateUser = async (data: any) => {
    try {
      await createUser(data as CreateUserRequest)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const handleUpdateUser = async (data: any) => {
    if (!selectedUser) return
    
    try {
      await updateUser({ id: selectedUser.id, data: data as UpdateUserRequest })
      setIsEditDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    
    try {
      await deleteUser(selectedUser.id)
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setRoleFilter(null)
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full bg-gradient-to-r from-sky-400 to-blue-400 text-white px-6 py-8">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <UserCog className="h-7 w-7" />
              Usuários do Sistema
            </h2>
            <p className="text-sky-100 mt-1">
              Gerencie os usuários que têm acesso ao sistema
            </p>
          </div>
          <Button
            className="bg-white text-sky-500 hover:bg-sky-50 shadow-lg w-full lg:w-auto"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-4 -mt-8 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar por nome, email, cargo..." 
                className="pl-10 bg-gray-50 border-gray-200 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant={roleFilter === 'administrator' ? 'default' : 'outline'} 
                className="flex-1 md:flex-none"
                onClick={() => setRoleFilter(roleFilter === 'administrator' ? null : 'administrator')}
              >
                <Filter className="mr-2 h-4 w-4" />
                Administradores
              </Button>
              <Button 
                variant={roleFilter === 'user' ? 'default' : 'outline'} 
                className="flex-1 md:flex-none"
                onClick={() => setRoleFilter(roleFilter === 'user' ? null : 'user')}
              >
                <Filter className="mr-2 h-4 w-4" />
                Usuários
              </Button>
            </div>
          </div>
          
          {/* Filtros ativos */}
          {(searchTerm || roleFilter) && (
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
              
              {roleFilter && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 flex gap-1 pl-2 pr-1 py-1">
                  <span>Tipo: {roleFilter === 'administrator' ? 'Administrador' : 'Usuário'}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 rounded-full hover:bg-blue-100" 
                    onClick={() => setRoleFilter(null)}
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

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8 overflow-x-auto">
          {isLoadingUsers ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
              <span className="ml-2 text-gray-600">Carregando usuários...</span>
            </div>
          ) : (
            <div className="w-full">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <UserCog className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">Nenhum usuário encontrado</p>
                  <p className="text-gray-500 text-sm mb-4">
                    {searchTerm || roleFilter
                      ? "Tente remover alguns filtros para ver mais resultados" 
                      : "Adicione um novo usuário para começar"}
                  </p>
                  {!(searchTerm || roleFilter) && (
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-sky-400 to-blue-400"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Usuário
                    </Button>
                  )}
                </div>
              ) : (
                <UsersTable
                  users={filteredUsers}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de criação de usuário */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-sky-500">Novo Usuário</DialogTitle>
            <DialogDescription className="text-gray-600">
              Preencha as informações do novo usuário. Clique em cadastrar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={handleCreateUser}
            isLoading={isCreatingUser}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de edição de usuário */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-sky-500">Editar Usuário</DialogTitle>
            <DialogDescription className="text-gray-600">
              Atualize as informações do usuário. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSubmit={handleUpdateUser}
              isLoading={isUpdatingUser}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Excluir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário <span className="font-semibold">{selectedUser?.name}</span>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeletingUser}
            >
              {isDeletingUser ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 