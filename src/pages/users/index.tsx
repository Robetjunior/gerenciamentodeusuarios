
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import UsersList from '@/pages/UsersList'; // Import the original UsersList component
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UsersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, router]);

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <UsersList />
    </ProtectedRoute>
  );
}
