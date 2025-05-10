
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import NewUser from '@/pages/NewUser'; // Import the original NewUser component
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewUserPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!user || user.role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, router]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <NewUser />
    </ProtectedRoute>
  );
}
