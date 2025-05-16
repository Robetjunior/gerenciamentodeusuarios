import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import UserCard from '@/components/UserCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Search, UserPlus, Users } from 'lucide-react';

const UsersList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await api.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar usuários',
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserDeleted = () => {
    fetchUsers();
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground">Gerencie usuários do sistema e seus níveis de acesso.</p>
          </div>

          {currentUser?.role === 'admin' && (
            <Link to="/users/new">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </Link>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários por nome, email ou função..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : (
          <>
            {filteredUsers.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} onDelete={handleUserDeleted} />
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center space-y-3 rounded-lg border bg-card p-8 text-center">
                <Users className="h-10 w-10 text-muted-foreground/60" />
                <div>
                  <p className="text-lg font-medium">Nenhum usuário encontrado</p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm
                      ? `Nenhum usuário corresponde ao termo "${searchTerm}"`
                      : "Não há usuários para exibir"}
                  </p>
                </div>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Limpar busca
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default UsersList;
