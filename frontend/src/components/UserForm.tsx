
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
import { toast } from '@/components/ui/sonner';
import { Mail, User as UserIcon, UserCheck } from 'lucide-react';

interface UserFormProps {
  user?: User;
  isEditing?: boolean;
  onSuccess?: (updatedUser?: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, isEditing = false, onSuccess }) => {
  const { user: currentUser, access_token } = useAuth();
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
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email é inválido';
      isValid = false;
    }
    
    if (!isEditing && !formData.password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    }
    
    if (!formData.role) {
      newErrors.role = 'Função é obrigatória';
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
      console.log("Enviando formulário com access_token:", access_token);
      
      if (isEditing && user) {
        const updateData: Partial<User> = {};
        if (formData.name !== user.name) updateData.name = formData.name;
        if (formData.email !== user.email) updateData.email = formData.email;
        if (formData.role !== user.role) updateData.role = formData.role;

        if (Object.keys(updateData).length === 0) {
          toast('Nenhuma alteração foi feita');
          return; // Evita chamada desnecessária à API
        }

        const updatedUser = await api.updateUser(user.id, updateData, access_token);
        toast('Usuário atualizado com sucesso');
        if (onSuccess) onSuccess(updatedUser);
      } else {
        await api.registerUser(formData, access_token);
        toast('Usuário criado com sucesso');
      }
      
      navigate('/users');
    } catch (error) {
      toast(`Erro: ${(error as Error).message}`);
      console.error("Erro na API:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder="Nome Completo"
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
                placeholder="nome@exemplo.com"
                className="pl-10"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
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
            <Label htmlFor="role">Função</Label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Select
                disabled={!canEditRole}
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                </SelectContent>
              </Select>
              {!canEditRole && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Apenas administradores podem alterar funções
                </p>
              )}
              {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : isEditing ? 'Atualizar Usuário' : 'Criar Usuário'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/users')}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserForm;
