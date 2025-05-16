import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, LoginCredentials, User } from '@/types';
import { api } from '@/services/api';
import { toast } from '@/components/ui/sonner';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  updateUserData: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' | 'LOGOUT' | 'GET_USER_START' }
  | { type: 'LOGIN_SUCCESS' | 'GET_USER_SUCCESS'; payload: { user: User; access_token: string } }
  | { type: 'LOGIN_ERROR' | 'GET_USER_ERROR'; payload: string }
  | { type: 'UPDATE_USER_DATA'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'GET_USER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'GET_USER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        access_token: action.payload.access_token,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER_DATA':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGIN_ERROR':
    case 'GET_USER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        user: null,
        access_token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  access_token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      api.setAuthToken(storedToken); 
      getCurrentUser();
    } else {
      dispatch({ type: 'GET_USER_ERROR', payload: 'Token não encontrado' });
    }
  }, []);

  // Update localStorage when token changes
  useEffect(() => {
    if (state.access_token) {
      localStorage.setItem('access_token', state.access_token);
    } else {
      localStorage.removeItem('access_token');
    }
  }, [state.access_token]);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user, access_token } = await api.login(credentials);
      api.setAuthToken(access_token); 
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, access_token } });
      toast(`Bem-vindo, ${user.name}!`);
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: (error as Error).message });
      toast(`Falha no login: ${(error as Error).message}`);
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('access_token');
    toast('Você foi desconectado com sucesso');
  };

  const getCurrentUser = async () => {
    const storedToken = localStorage.getItem('access_token');
    if (!storedToken) {
      dispatch({ type: 'GET_USER_ERROR', payload: 'Token não encontrado' });
      return;
    }

    dispatch({ type: 'GET_USER_START' });
      try {
        const user = await api.getCurrentUser(storedToken);
        dispatch({ type: 'GET_USER_SUCCESS', payload: { user, access_token: storedToken } });
      } catch (error) {
        dispatch({ type: 'GET_USER_ERROR', payload: (error as Error).message });
        localStorage.removeItem('access_token');
        api.setAuthToken(); 
        toast('Sessão expirada. Faça login novamente.');
      }
    };

  // Função para atualizar os dados do usuário localmente após edição
  const updateUserData = (user: User) => {
    if (state.user && state.user.id === user.id) {
      dispatch({ type: 'UPDATE_USER_DATA', payload: user });
      toast(`Perfil atualizado com sucesso`);
    }
  };

  const value = {
    ...state,
    login,
    logout,
    getCurrentUser,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
