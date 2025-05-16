
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { User } from '@/types';
import Layout from '@/components/Layout';
import UserForm from '@/components/UserForm';
import { toast } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { access_token, user: currentUser, updateUserData } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedUser = await api.getUserById(id, access_token);
        
        // Check if the current user has permission to edit this user
        if (currentUser?.role === 'user' && currentUser.id !== id) {
          toast('Acesso negado: Você não tem permissão para editar outros usuários');
          navigate('/profile');
          return;
        }
        
        // Managers can't edit admins or other managers
        if (
          currentUser?.role === 'manager' &&
          (fetchedUser.role === 'admin' || fetchedUser.role === 'manager') &&
          currentUser.id !== id
        ) {
          toast(`Acesso negado: Gerentes não podem editar contas de ${fetchedUser.role === 'admin' ? 'administradores' : 'gerentes'}`);
          navigate('/users');
          return;
        }
        
        setUser(fetchedUser);
      } catch (error) {
        toast(`Erro: ${(error as Error).message}`);
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchUser();
    }
  }, [id, access_token, navigate, currentUser]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex h-40 items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return (
      <Layout>
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-lg font-medium">Usuário não encontrado</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Editar Usuário</h1>
            <p className="text-muted-foreground">Atualize as informações e permissões do usuário.</p>
          </div>
          <ThemeToggle />
        </div>
        
        <UserForm 
          user={user} 
          isEditing 
          onSuccess={(updatedUser) => {
            // Atualizar dados do usuário logado se for o próprio usuário
            if (currentUser && currentUser.id === user.id && updatedUser) {
              updateUserData(updatedUser);
            }
          }}
        />
      </div>
    </Layout>
  );
};

export default EditUser;
