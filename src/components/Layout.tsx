
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Role } from '@/types';
import { Users, UserPlus, Settings, LogOut, User, Shield } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  requiredRoles?: Role[];
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, requiredRoles = ['admin', 'manager', 'user'] }) => {
  const { user } = useAuth();

  if (!user || !requiredRoles.includes(user.role)) {
    return null;
  }

  return (
    <Link to={to} className="w-full">
      <Button
        variant={active ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start gap-2',
          active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {icon}
        {label}
      </Button>
    </Link>
  );
};

const roleColors: Record<Role, string> = {
  admin: 'text-admin',
  manager: 'text-manager',
  user: 'text-user',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden w-64 flex-col border-r bg-card p-4 md:flex">
        <div className="flex items-center gap-2 py-4">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary">Access Control</h1>
        </div>
        
        {user && (
          <div className="mb-8 mt-6 flex flex-col items-center space-y-2 border-b pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium">{user.name}</p>
              <p className={cn('text-sm', roleColors[user.role])}>{user.role}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-1">
          <NavItem
            to="/dashboard"
            icon={<Settings className="h-5 w-5" />}
            label="Dashboard"
            active={location.pathname === '/dashboard'}
          />
          <NavItem
            to="/users"
            icon={<Users className="h-5 w-5" />}
            label="Users"
            active={location.pathname === '/users'}
            requiredRoles={['admin', 'manager']}
          />
          <NavItem
            to="/users/new"
            icon={<UserPlus className="h-5 w-5" />}
            label="Add User"
            active={location.pathname === '/users/new'}
            requiredRoles={['admin']}
          />
          <NavItem
            to="/profile"
            icon={<User className="h-5 w-5" />}
            label="My Profile"
            active={location.pathname === '/profile'}
          />
        </div>
        
        <div className="mt-auto">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => logout()}>
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="border-b bg-card p-4 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-primary">Access Control</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </Button>
          </div>
          
          {isMobileMenuOpen && (
            <div className="mt-4 flex flex-col space-y-1">
              <NavItem
                to="/dashboard"
                icon={<Settings className="h-5 w-5" />}
                label="Dashboard"
                active={location.pathname === '/dashboard'}
              />
              <NavItem
                to="/users"
                icon={<Users className="h-5 w-5" />}
                label="Users"
                active={location.pathname === '/users'}
                requiredRoles={['admin', 'manager']}
              />
              <NavItem
                to="/users/new"
                icon={<UserPlus className="h-5 w-5" />}
                label="Add User"
                active={location.pathname === '/users/new'}
                requiredRoles={['admin']}
              />
              <NavItem
                to="/profile"
                icon={<User className="h-5 w-5" />}
                label="My Profile"
                active={location.pathname === '/profile'}
              />
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => logout()}>
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          )}
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
