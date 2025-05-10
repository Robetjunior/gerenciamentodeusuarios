import { LoginCredentials, RegisterData, User } from '@/types';

const USERS_KEY = 'users';

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

const getStoredUsers = (): User[] => {
  const storedUsers = localStorage.getItem(USERS_KEY);
  return storedUsers ? JSON.parse(storedUsers) : [];
};

const updateStoredUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Authenticates a user with email and password.
 */
export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  await delay();

  const users = getStoredUsers();
  const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  const token = btoa(`${user.email}:${user.password}`);
  return { user, token };
};

/**
 * Registers a new user.
 */
export const register = async (data: RegisterData, token?: string): Promise<User> => {
  await delay();
  
  if (!token) throw new Error('Token de autenticação não fornecido');

  const users = getStoredUsers();
  if (users.find(u => u.email === data.email)) {
    throw new Error('Email já cadastrado');
  }

  const newUser: User = {
    id: String(Date.now()),
    ...data,
  };

  users.push(newUser);
  updateStoredUsers(users);

  return newUser;
};

const getUsersFromStorage = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  return storedUsers ? JSON.parse(storedUsers) : [];
};

/**
 * Retrieves the current user based on the provided token.
 */
export const getCurrentUser = async (token: string): Promise<User> => {
  await delay();

  if (!token) {
    throw new Error('Token não fornecido');
  }

  try {
    const decodedToken = atob(token);
    const [email, password] = decodedToken.split(':');

    const users = getUsersFromStorage();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  } catch (error) {
    throw new Error('Token inválido');
  }
};

/**
 * Retrieves a user by ID.
 */
export const getUserById = async (id: string, token?: string): Promise<User> => {
  await delay();
  
  if (!token) throw new Error('Token de autenticação não fornecido');

  const users = getUsersFromStorage();
  const user = users.find(u => u.id === id);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
};

/**
 * Updates an existing user
 */
export const updateUser = async (userId: string, userData: Partial<User>, token?: string): Promise<User> => {
  // Simulate API call to update user
  await delay();
  
  if (!token) throw new Error('Token de autenticação não fornecido');
  
  const users = getUsersFromStorage();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Usuário não encontrado');
  }
  
  // Update user data
  const updatedUser = { ...users[userIndex], ...userData };
  users[userIndex] = updatedUser;
  
  // Save updated users to storage
  localStorage.setItem('users', JSON.stringify(users));
  
  return updatedUser; // Return the updated user
};

/**
 * Deletes a user by ID.
 */
export const deleteUser = async (id: string, token?: string): Promise<void> => {
  await delay();
  
  if (!token) throw new Error('Token de autenticação não fornecido');

  const users = getUsersFromStorage();
  const updatedUsers = users.filter(u => u.id !== id);

  if (users.length === updatedUsers.length) {
    throw new Error('Usuário não encontrado');
  }

  localStorage.setItem('users', JSON.stringify(updatedUsers));
};
