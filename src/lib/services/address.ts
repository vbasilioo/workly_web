
import { Address, CreateAddressRequest, CreateAddressWithEmployeeRequest, UpdateAddressRequest } from '../types';
import { api } from './api';

export const addressService = {
    async create(data: CreateAddressRequest): Promise<Address> {
        const response = await api.post<Address>('/addresses', data);
        return response.data;
    },

    async createWithEmployee(data: CreateAddressWithEmployeeRequest): Promise<Address> {
        const response = await api.post<Address>('/addresses/with-employee', data);
        return response.data;
    },

    async getById(id: string): Promise<Address> {
        const response = await api.get<Address>(`/addresses/${id}`);
        return response.data;
    },

    async getByEmployeeId(employeeId: string): Promise<Address> {
        const response = await api.get<Address>(`/addresses/employee/${employeeId}`);
        return response.data;
    },

    async update(id: string, data: UpdateAddressRequest): Promise<Address> {
        const response = await api.put<Address>(`/addresses/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/addresses/${id}`);
    },
};
