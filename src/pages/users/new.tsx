
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NewUser from '@/pages/NewUser';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewUserPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!user || user.role !== 'admin') {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <NewUser />
    </ProtectedRoute>
  );
}
