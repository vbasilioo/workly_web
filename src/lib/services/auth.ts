import { LoginRequest, LoginResponse } from '../types';
import { api } from './api';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
}; 