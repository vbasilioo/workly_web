import { CreateEmployeeRequest, Employee, UpdateEmployeeRequest } from '../types';
import { api } from './api';

export const employeesService = {
  async create(data: CreateEmployeeRequest): Promise<Employee> {
    const response = await api.post<Employee>('/employees', data);
    return response.data;
  },

  async list(): Promise<Employee[]> {
    const response = await api.get<Employee[]>('/employees');
    return response.data;
  },

  async getById(id: string): Promise<Employee> {
    const response = await api.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateEmployeeRequest): Promise<Employee> {
    const response = await api.put<Employee>(`/employees/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/employees/${id}`);
  },

  async restore(id: string): Promise<void> {
    await api.patch(`/employees/${id}`);
  }
}; 