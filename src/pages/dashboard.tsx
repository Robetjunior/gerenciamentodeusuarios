
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard'; // Import the original Dashboard component
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
