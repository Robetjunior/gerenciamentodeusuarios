
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from './Dashboard'; // Use relative path
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
