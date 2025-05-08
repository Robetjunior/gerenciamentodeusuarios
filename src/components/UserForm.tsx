
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, RegisterData, Role } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Mail, User as UserIcon, UserCheck } from 'lucide-react';

interface UserFormProps {
  user?: User;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, isEditing = false }) => {
  const { user: currentUser, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<RegisterData>({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const canEditRole = currentUser?.role === 'admin';
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '', role: '' };
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!isEditing && !formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as Role }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isEditing && user) {
        // Only send fields that were changed
        const updateData: Partial<User> = {};
        if (formData.name !== user.name) updateData.name = formData.name;
        if (formData.email !== user.email) updateData.email = formData.email;
        if (formData.role !== user.role) updateData.role = formData.role;
        
        await api.updateUser(user.id, updateData, token);
        toast({ title: 'Success', description: 'User updated successfully' });
      } else {
        await api.register(formData, token);
        toast({ title: 'Success', description: 'User created successfully' });
      }
      
      navigate('/users');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder="Full Name"
                className="pl-10"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Select
                disabled={!canEditRole}
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              {!canEditRole && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Only administrators can change roles
                </p>
              )}
              {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/users')}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserForm;
