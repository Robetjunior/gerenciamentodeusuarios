
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import EditUser from '@/pages/EditUser'; // Import the original EditUser component
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditUserPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <ProtectedRoute>
      <EditUser />
    </ProtectedRoute>
  );
}
