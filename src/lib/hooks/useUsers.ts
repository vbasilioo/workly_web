import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateUserRequest, UpdateUserRequest, User } from '../types';
import { usersService } from '../services/users';
import { toast } from 'sonner';

export function useUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => usersService.list(),
  });

  const { mutateAsync: createUser, isPending: isCreatingUser } = useMutation({
    mutationFn: (data: CreateUserRequest) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: () => {
      toast.error('Error creating user');
    },
  });

  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: () => {
      toast.error('Error updating user');
    },
  });

  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Error deleting user');
    },
  });

  return {
    users,
    isLoadingUsers,
    createUser,
    isCreatingUser,
    updateUser,
    isUpdatingUser,
    deleteUser,
    isDeletingUser,
  };
} 