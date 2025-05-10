
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EditUser from '@/pages/EditUser';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditUserPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <ProtectedRoute>
      <EditUser />
    </ProtectedRoute>
  );
}
