'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash } from 'lucide-react';
import { useUsers } from '@/lib/hooks/useUsers';
import { UserForm } from '@/components/molecules/UserForm';
import { CreateUserRequest, UpdateUserRequest, User } from '@/lib/types';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

interface UserTableProps {
  users: User[];
}

export function UsersTable() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    users,
    isLoadingUsers,
    createUser,
    isCreatingUser,
    updateUser,
    isUpdatingUser,
    deleteUser,
    isDeletingUser,
  } = useUsers();

  console.log(users);

  const handleCreateUser = async (data: CreateUserRequest) => {
    await createUser(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateUser = async (data: UpdateUserRequest) => {
    if (!selectedUser) return;
    await updateUser({ id: selectedUser.id, data: data });
    setIsUpdateDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    await deleteUser(selectedUser.id);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  if (users?.length === 0) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
        <Alert>
          <AlertTitle>No users found</AlertTitle>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add User
      </Button>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  {user.createdAt
                    ? format(new Date(user.createdAt), 'MM/dd/yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsUpdateDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastro de Usuário</DialogTitle>
            <DialogDescription>
              Adicione um novo usuário ao sistema. Preencha os campos abaixo e clique em cadastrar.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={(data) => handleCreateUser(data as CreateUserRequest)}
            isLoading={isCreatingUser}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>
              Update the user's information.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={selectedUser}
            onSubmit={handleUpdateUser}
            isLoading={isUpdatingUser}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Usuário</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeletingUser}
            >
              {isDeletingUser ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 