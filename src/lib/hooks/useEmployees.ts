import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateEmployeeRequest, Employee, UpdateEmployeeRequest } from '../types';
import { employeesService } from '../services/employees';
import { toast } from 'sonner';

export function useEmployees() {
  const queryClient = useQueryClient();

  const { data: employees, isLoading: isLoadingEmployees } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => employeesService.list(),
  });

  const { mutateAsync: createEmployee, isPending: isCreatingEmployee } = useMutation({
    mutationFn: (data: CreateEmployeeRequest) => employeesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully');
    },
    onError: () => {
      toast.error('Error creating employee');
    },
  });

  const { mutateAsync: updateEmployee, isPending: isUpdatingEmployee } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeRequest }) =>
      employeesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated successfully');
    },
    onError: () => {
      toast.error('Error updating employee');
    },
  });

  const { mutateAsync: deleteEmployee, isPending: isDeletingEmployee } = useMutation({
    mutationFn: (id: string) => employeesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted successfully');
    },
    onError: () => {
      toast.error('Error deleting employee');
    },
  });

  return {
    employees,
    isLoadingEmployees,
    createEmployee,
    isCreatingEmployee,
    updateEmployee,
    isUpdatingEmployee,
    deleteEmployee,
    isDeletingEmployee,
  };
} 