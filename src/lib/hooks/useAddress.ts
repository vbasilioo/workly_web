import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    CreateAddressRequest,
    CreateAddressWithEmployeeRequest,
    UpdateAddressRequest,
} from '../types';
import { addressService } from '../services/address';
import { toast } from 'sonner';

export function useAddresses() {
    const queryClient = useQueryClient();

    const { mutateAsync: createAddress, isPending: isCreatingAddress } = useMutation({
        mutationFn: (data: CreateAddressRequest) => addressService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Endereço criado com sucesso');
        },
        onError: () => {
            toast.error('Erro ao criar endereço');
        },
    });

    const { mutateAsync: createWithEmployee, isPending: isCreatingWithEmployee } = useMutation({
        mutationFn: (data: CreateAddressWithEmployeeRequest) => addressService.createWithEmployee(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Endereço cadastrado com funcionário com sucesso');
        },
        onError: () => {
            toast.error('Erro ao cadastrar endereço com funcionário');
        },
    });

    const { mutateAsync: updateAddress, isPending: isUpdatingAddress } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAddressRequest }) =>
            addressService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Endereço atualizado com sucesso');
        },
        onError: () => {
            toast.error('Erro ao atualizar endereço');
        },
    });

    const { mutateAsync: deleteAddress, isPending: isDeletingAddress } = useMutation({
        mutationFn: (id: string) => addressService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Endereço deletado com sucesso');
        },
        onError: () => {
            toast.error('Erro ao deletar endereço');
        },
    });

    return {
        createAddress,
        isCreatingAddress,
        createWithEmployee,
        isCreatingWithEmployee,
        updateAddress,
        isUpdatingAddress,
        deleteAddress,
        isDeletingAddress,
    };
}
