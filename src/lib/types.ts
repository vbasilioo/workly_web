export interface User {
  id: string;
  email: string;
  name: string;
  role: 'administrator' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  hireDate: string;
  rg: string;
  salary: number;
  department: string;
  isActive: boolean
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  key: string;
  value: any;
  group: string;
  description: string;
  isPublic: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  data: {
    access_token: string;
    user: User
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'administrator' | 'user';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: 'administrator' | 'user';
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: 'active' | 'inactive';
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  status?: 'active' | 'inactive';
} 