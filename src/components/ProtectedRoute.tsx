
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  const roleTitles: Record<Role, string> = {
    admin: 'administrador',
    manager: 'gerente',
    user: 'usuário',
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Autenticação necessária',
        description: 'Por favor, faça login para acessar esta página',
      });
    } else if (!loading && isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
      toast({
        variant: 'destructive',
        title: 'Acesso negado',
        description: `Sua função (${roleTitles[user.role]}) não tem permissão para acessar esta página`,
      });
    }
  }, [isAuthenticated, loading, user, allowedRoles]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
