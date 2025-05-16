
export type Role = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
