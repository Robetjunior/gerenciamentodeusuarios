
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
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
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Controle de Acesso por Funções</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Um sistema para gerenciar usuários com diferentes níveis de permissão. Faça login para explorar
          recursos baseados na sua função: Administrador, Gerente ou Usuário.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button size="lg" onClick={() => navigate('/login')}>
            Entrar
          </Button>
          <ThemeToggle />
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-admin">Administrador</h3>
            <p className="text-sm">Acesso total para criar, ler, atualizar e excluir todos os usuários e gerenciar funções.</p>
          </div>
          
          <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-manager">Gerente</h3>
            <p className="text-sm">Pode visualizar todos os usuários e editar usuários comuns, mas não pode modificar funções ou criar usuários.</p>
          </div>
          
          <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-user">Usuário</h3>
            <p className="text-sm">Acesso limitado para visualizar e editar apenas suas próprias informações de perfil.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
