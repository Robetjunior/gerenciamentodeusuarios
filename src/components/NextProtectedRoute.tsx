
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types';
import { toast } from '@/components/ui/sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const NextProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  const roleTitles: Record<Role, string> = {
    admin: 'administrador',
    manager: 'gerente',
    user: 'usuário',
  };

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        toast('Autenticação necessária: Por favor, faça login para acessar esta página');
        router.push('/login');
      } else if (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
        toast(`Acesso negado: Sua função (${roleTitles[user.role]}) não tem permissão para acessar esta página`);
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, loading, user, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default NextProtectedRoute;
