import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { Role } from '@/types';
import { Users, UserPlus, Settings, LogOut, User, Shield } from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  requiredRoles?: Role[];
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, active, requiredRoles = ['admin', 'manager', 'user'] }) => {
  const { user } = useAuth();

  if (!user || !requiredRoles.includes(user.role)) {
    return null;
  }

  return (
    <Link href={href} className="w-full">
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

const roleTitles: Record<Role, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  user: 'Usuário',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden w-64 flex-col border-r bg-card p-4 md:flex">
        {/* Sidebar header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Controle de Acesso</h1>
          </div>
          <ThemeToggle />
        </div>
        
        {user && (
          <div className="mb-8 mt-6 flex flex-col items-center space-y-2 border-b pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium">{user.name}</p>
              <p className={cn('text-sm', roleColors[user.role])}>{roleTitles[user.role]}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-1">
          <NavItem
            href="/dashboard"
            icon={<Settings className="h-5 w-5" />}
            label="Painel"
            active={router.pathname === '/dashboard'}
          />
          <NavItem
            href="/users"
            icon={<Users className="h-5 w-5" />}
            label="Usuários"
            active={router.pathname === '/users'}
            requiredRoles={['admin', 'manager']}
          />
          <NavItem
            href="/users/new"
            icon={<UserPlus className="h-5 w-5" />}
            label="Adicionar Usuário"
            active={router.pathname === '/users/new'}
            requiredRoles={['admin']}
          />
          <NavItem
            href="/profile"
            icon={<User className="h-5 w-5" />}
            label="Meu Perfil"
            active={router.pathname === '/profile'}
          />
        </div>
        
        <div className="mt-auto">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            Sair
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
              <h1 className="text-lg font-bold text-primary">Controle de Acesso</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? 'Fechar' : 'Menu'}
              </Button>
            </div>
          </div>
          
          {isMobileMenuOpen && (
            <div className="mt-4 flex flex-col space-y-1">
              <NavItem
                href="/dashboard"
                icon={<Settings className="h-5 w-5" />}
                label="Painel"
                active={router.pathname === '/dashboard'}
              />
              <NavItem
                href="/users"
                icon={<Users className="h-5 w-5" />}
                label="Usuários"
                active={router.pathname === '/users'}
                requiredRoles={['admin', 'manager']}
              />
              <NavItem
                href="/users/new"
                icon={<UserPlus className="h-5 w-5" />}
                label="Adicionar Usuário"
                active={router.pathname === '/users/new'}
                requiredRoles={['admin']}
              />
              <NavItem
                href="/profile"
                icon={<User className="h-5 w-5" />}
                label="Meu Perfil"
                active={router.pathname === '/profile'}
              />
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                Sair
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
