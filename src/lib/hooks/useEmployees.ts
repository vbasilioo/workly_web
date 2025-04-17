import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateEmployeeRequest, Employee, UpdateEmployeeRequest } from '../types';
import { employeesService } from '../services/employees';
import { toast } from 'sonner';

export function useEmployees() {
  const queryClient = useQueryClient();

  const { data: employees, isLoading: isLoadingEmployees, refetch } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => employeesService.list(),
  });

  const { mutateAsync: createEmployee, isPending: isCreatingEmployee } = useMutation({
    mutationFn: (data: CreateEmployeeRequest) => employeesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário criado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar funcionário');
    },
  });

  const { mutateAsync: updateEmployee, isPending: isUpdatingEmployee } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeRequest }) =>
      employeesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar funcionário');
    },
  });

  const { mutateAsync: deleteEmployee, isPending: isDeletingEmployee } = useMutation({
    mutationFn: (id: string) => employeesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário deletado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao deletar funcionário');
    },
  });

  const { mutateAsync: restoreEmployee, isPending: isRestoringEmployee } = useMutation({
    mutationFn: (id: string) => employeesService.restore(id),
    onSuccess: () => {
      refetch();
      toast.success('Funcionário restaurado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao restaurar funcionário');
    },
  })

  return {
    employees,
    isLoadingEmployees,
    createEmployee,
    isCreatingEmployee,
    updateEmployee,
    isUpdatingEmployee,
    deleteEmployee,
    isDeletingEmployee,
    restoreEmployee,
    isRestoringEmployee,
  };
} 