
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Profile from '@/pages/Profile'; // Import the original Profile component
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
}
