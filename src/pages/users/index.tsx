
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UsersList from '@/pages/UsersList';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UsersPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <UsersList />
    </ProtectedRoute>
  );
}
