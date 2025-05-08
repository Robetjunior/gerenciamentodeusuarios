
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="max-w-lg text-center">
        <div className="flex justify-center">
          <div className="mb-6 rounded-full bg-primary/10 p-6">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Role-Based Access Control</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          A system for managing users with different permission levels. Login to explore
          features based on your role: Admin, Manager, or User.
        </p>
        
        <div className="space-x-4">
          <Button size="lg" onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-admin">Admin</h3>
            <p className="text-sm">Full access to create, read, update, and delete all users and manage roles.</p>
          </div>
          
          <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-manager">Manager</h3>
            <p className="text-sm">Can view all users and edit regular users, but cannot modify roles or create users.</p>
          </div>
          
          <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-user">User</h3>
            <p className="text-sm">Limited access to view and edit only their own profile information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
