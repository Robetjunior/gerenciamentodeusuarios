
import { User, LoginCredentials, RegisterData, Role } from '../types';
import { toast } from '@/components/ui/use-toast';

// Mock users database
let users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'Manager User', email: 'manager@example.com', role: 'manager' },
  { id: '3', name: 'Regular User', email: 'user@example.com', role: 'user' },
];

// Mock credentials (in a real app, this would be in the database with hashed passwords)
const credentials: Record<string, string> = {
  'admin@example.com': 'admin123',
  'manager@example.com': 'manager123',
  'user@example.com': 'user123',
};

// Mock token generation
const generateToken = (user: User): string => {
  return `mock-jwt-token-${user.id}-${user.role}-${Date.now()}`;
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to check permissions
const checkPermission = (token: string | null, requiredRole: Role[] = ['admin']) => {
  if (!token) {
    throw new Error('401 Unauthorized - Not authenticated');
  }
  
  // Debug the token
  console.log('Token being checked:', token);
  
  try {
    // In our mock token format: mock-jwt-token-[id]-[role]-[timestamp]
    // Example: mock-jwt-token-1-admin-1746741254979
    const parts = token.split('-');
    
    // Ensure token has enough parts (at least 6 parts in our format)
    if (parts.length < 6) {
      console.error('Invalid token format:', token);
      throw new Error('401 Unauthorized - Invalid token format');
    }
    
    // In our format: mock(0)-jwt(1)-token(2)-[id](3)-[role](4)-[timestamp](5)
    const userRole = parts[4]; // Role is at index 4
    console.log('Extracted user role:', userRole);
    console.log('Required roles:', requiredRole);
    
    // Verify the role is valid
    if (!['admin', 'manager', 'user'].includes(userRole)) {
      console.error('Invalid role in token:', userRole);
      throw new Error(`401 Unauthorized - Invalid role in token: ${userRole}`);
    }
    
    // Check if user has required role
    if (!requiredRole.includes(userRole as Role)) {
      console.error(`Permission denied: ${userRole} role cannot perform this action`);
      throw new Error(`403 Forbidden - ${userRole} role cannot perform this action`);
    }
    
    return userRole as Role;
  } catch (error) {
    console.error('Error during permission check:', error);
    throw error;
  }
};

export const api = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    await delay(800); // Simulating network delay
    
    const user = users.find(u => u.email === credentials.email);
    
    if (!user || credentials.password !== credentials.email.split('@')[0] + '123') {
      throw new Error('Invalid email or password');
    }
    
    const token = generateToken(user);
    return { user, token };
  },
  
  register: async (data: RegisterData, token: string | null): Promise<User> => {
    await delay(800);

    console.log('Attempting to register with token:', token);
    
    try {
      // Check if the requester has admin permissions
      const role = checkPermission(token, ['admin']);
      console.log('Permission check passed. User role:', role);
      
      // Check if email already exists
      if (users.some(u => u.email === data.email)) {
        throw new Error('400 Bad Request - Email already in use');
      }
      
      // Create password for the new user (in a real app, you'd hash this)
      const password = data.email.split('@')[0] + '123';
      credentials[data.email] = password;
      
      const newUser = {
        id: (users.length + 1).toString(),
        name: data.name,
        email: data.email,
        role: data.role,
      };
      
      users = [...users, newUser];
      console.log('User registered successfully:', newUser);
      return newUser;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },
  
  getCurrentUser: async (token: string | null): Promise<User> => {
    await delay(500);
    
    if (!token) {
      throw new Error('401 Unauthorized');
    }
    
    const userId = token.split('-')[1];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  },
  
  getAllUsers: async (token: string | null): Promise<User[]> => {
    await delay(700);
    
    // Only admin and manager can view all users
    const role = checkPermission(token, ['admin', 'manager']);
    
    return users;
  },
  
  getUserById: async (id: string, token: string | null): Promise<User> => {
    await delay(500);
    
    const requesterRole = checkPermission(token, ['admin', 'manager', 'user']);
    const requesterUserId = token?.split('-')[1];
    
    const user = users.find(u => u.id === id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Regular users can only view their own profile
    if (requesterRole === 'user' && requesterUserId !== id) {
      throw new Error('403 Forbidden - You can only access your own profile');
    }
    
    return user;
  },
  
  updateUser: async (id: string, data: Partial<User>, token: string | null): Promise<User> => {
    await delay(800);
    
    const requesterRole = checkPermission(token, ['admin', 'manager', 'user']);
    const requesterUserId = token?.split('-')[1];
    
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const user = users[userIndex];
    
    // Check permissions
    if (requesterRole === 'user' && requesterUserId !== id) {
      throw new Error('403 Forbidden - You can only edit your own profile');
    }
    
    // Only admin can change roles
    if (data.role && requesterRole !== 'admin') {
      throw new Error('403 Forbidden - Only admins can change roles');
    }
    
    // Update user
    const updatedUser = { ...user, ...data };
    users[userIndex] = updatedUser;
    
    return updatedUser;
  },
  
  deleteUser: async (id: string, token: string | null): Promise<void> => {
    await delay(800);
    
    // Only admin can delete users
    checkPermission(token, ['admin']);
    
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users = users.filter(u => u.id !== id);
  }
};

export default api;
