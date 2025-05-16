import axios from 'axios';
import { LoginCredentials, RegisterData, User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

const setAuthToken = (access_token?: string) => {
  if (access_token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

const login = async (credentials: LoginCredentials): Promise<{ user: User; access_token: string }> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  const { access_token, user } = response.data;
  setAuthToken(access_token);
  return { user, access_token };
};

const registerUser = async (data: RegisterData, access_token?: string): Promise<User> => {
  setAuthToken(access_token);
  const response = await axiosInstance.post('/users', data);
  return response.data;
};

const getCurrentUser = async (storedToken: string): Promise<User> => {
  const access_token = axiosInstance.defaults.headers.common['Authorization'];
  if (!access_token) throw new Error('Access_token não fornecido');
  const response = await axiosInstance.get('/auth/me'); // se tiver rota me
  return response.data;
};

const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get('/users');
  return response.data;
};  

const getUserById = async (id: string, access_token?: string): Promise<User> => {
  setAuthToken(access_token);
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

const updateUser = async (id: string, userData: Partial<User>, access_token?: string): Promise<User> => {
  setAuthToken(access_token);
  const response = await axiosInstance.patch(`/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id: string, access_token?: string): Promise<void> => {
  setAuthToken(access_token);
  await axiosInstance.delete(`/users/${id}`);
};

export const api = {
  login,
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
  setAuthToken
};