
import Layout from '@/components/Layout';
import UserForm from '@/components/UserForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const NewUser = () => {
  const { user } = useAuth();
  
  // Check if current user is admin
  const isAdmin = user?.role === 'admin';
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New User</h1>
          <p className="text-muted-foreground">Add a new user to the system.</p>
        </div>
        
        {isAdmin ? (
          <UserForm />
        ) : (
          <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              Only administrators can create new users.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Layout>
  );
};

export default NewUser;
