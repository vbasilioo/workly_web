import { CreateUserRequest, UpdateUserRequest, User } from '../types';
import { api } from './api';

export const usersService = {
  async create(data: CreateUserRequest): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async list(): Promise<User[]> {
    const response = await api.get<{ success: boolean; message: string; data: User[] }>('/users');
    return response.data.data; 
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
}; 