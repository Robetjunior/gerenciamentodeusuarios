
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <Lock className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
        <p className="mb-8 text-muted-foreground">
          You don't have permission to access this page. Please contact an administrator if you
          believe this is an error.
        </p>
        <div className="space-x-4">
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
