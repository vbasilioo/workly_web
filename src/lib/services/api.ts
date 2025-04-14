import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.token) {
    config.headers.set('Authorization', `Bearer ${session.token}`);
  }

  return config;
});

export { api };
