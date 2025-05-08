
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, User, UserCheck } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your role-based access control system.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{user?.role}</div>
              <p className="text-xs text-muted-foreground">
                Your access level determines what you can do in the system.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Name</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.name}</div>
              <p className="text-xs text-muted-foreground">
                Your profile name as shown in the system.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Permissions</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {user?.role === 'admin' && (
                  <>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>View all users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Create new users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Edit all users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Delete users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Change user roles</p>
                    </div>
                  </>
                )}
                
                {user?.role === 'manager' && (
                  <>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>View all users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Edit regular users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Cannot create users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Cannot delete users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Cannot change user roles</p>
                    </div>
                  </>
                )}
                
                {user?.role === 'user' && (
                  <>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>View own profile</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Edit own profile</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Cannot view other users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Cannot create users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Cannot delete users</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Role-Based Access Control System</CardTitle>
            <CardDescription>
              This system demonstrates how different user roles have different permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Role Hierarchy:</h3>
              <div className="space-y-2">
                <div className="rounded-md border bg-admin/10 p-3">
                  <p className="font-medium text-admin">Admin</p>
                  <p className="text-sm">
                    Complete access with ability to manage all users and assign roles.
                  </p>
                </div>
                <div className="rounded-md border bg-manager/10 p-3">
                  <p className="font-medium text-manager">Manager</p>
                  <p className="text-sm">
                    Can view all users and edit regular users, but cannot change roles or add new users.
                  </p>
                </div>
                <div className="rounded-md border bg-user/10 p-3">
                  <p className="font-medium text-user">User</p>
                  <p className="text-sm">
                    Can only access and edit their own profile information.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              These permissions are enforced both on the frontend and backend for security.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
