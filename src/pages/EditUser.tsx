
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { User } from '@/types';
import Layout from '@/components/Layout';
import UserForm from '@/components/UserForm';
import { toast } from '@/components/ui/use-toast';

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedUser = await api.getUserById(id, token);
        
        // Check if the current user has permission to edit this user
        if (currentUser?.role === 'user' && currentUser.id !== id) {
          toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'You do not have permission to edit other users',
          });
          navigate('/profile');
          return;
        }
        
        // Managers can't edit admins or other managers
        if (
          currentUser?.role === 'manager' &&
          (fetchedUser.role === 'admin' || fetchedUser.role === 'manager') &&
          currentUser.id !== id
        ) {
          toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: `Managers cannot edit ${fetchedUser.role} accounts`,
          });
          navigate('/users');
          return;
        }
        
        setUser(fetchedUser);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: (error as Error).message,
        });
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id, token, navigate]);
  
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
          <p className="text-lg font-medium">User not found</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
          <p className="text-muted-foreground">Update user information and permissions.</p>
        </div>
        
        <UserForm user={user} isEditing />
      </div>
    </Layout>
  );
};

export default EditUser;
