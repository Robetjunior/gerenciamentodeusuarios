
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, User, UserCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Painel</h1>
            <p className="text-muted-foreground">Bem-vindo ao sistema de controle de acesso baseado em funções.</p>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sua Função</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Gerente' : 'Usuário'}
              </div>
              <p className="text-xs text-muted-foreground">
                Seu nível de acesso determina o que você pode fazer no sistema.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seu Nome</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.name}</div>
              <p className="text-xs text-muted-foreground">
                Seu nome de perfil como mostrado no sistema.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suas Permissões</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {user?.role === 'admin' && (
                  <>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Ver todos os usuários</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Criar novos usuários</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Editar todos os usuários</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Excluir usuários</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Alterar funções de usuários</p>
                    </div>
                  </>
                )}
                
                {user?.role === 'manager' && (
                  <>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Ver todos os usuários</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Editar usuários comuns</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Não pode criar usuários</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Não pode excluir usuários</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Não pode alterar funções de usuários</p>
                    </div>
                  </>
                )}
                
                {user?.role === 'user' && (
                  <>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Ver próprio perfil</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <p>Editar próprio perfil</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Não pode ver outros usuários</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Não pode criar usuários</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                      <p>Não pode excluir usuários</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sistema de Controle de Acesso Baseado em Funções</CardTitle>
            <CardDescription>
              Este sistema demonstra como diferentes funções de usuários têm diferentes permissões.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Hierarquia de Funções:</h3>
              <div className="space-y-2">
                <div className="rounded-md border bg-admin/10 p-3">
                  <p className="font-medium text-admin">Administrador</p>
                  <p className="text-sm">
                    Acesso completo com capacidade de gerenciar todos os usuários e atribuir funções.
                  </p>
                </div>
                <div className="rounded-md border bg-manager/10 p-3">
                  <p className="font-medium text-manager">Gerente</p>
                  <p className="text-sm">
                    Pode ver todos os usuários e editar usuários comuns, mas não pode alterar funções ou adicionar novos usuários.
                  </p>
                </div>
                <div className="rounded-md border bg-user/10 p-3">
                  <p className="font-medium text-user">Usuário</p>
                  <p className="text-sm">
                    Pode acessar e editar apenas suas próprias informações de perfil.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Essas permissões são aplicadas tanto no frontend quanto no backend para segurança.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
