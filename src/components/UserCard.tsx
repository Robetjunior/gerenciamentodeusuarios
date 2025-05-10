
import { useState } from 'react';
import Link from 'next/link';
import { User, Role } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { BadgeCheck, Pencil, Trash2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: User;
  onDelete: () => void;
}

const roleBadgeStyles: Record<Role, string> = {
  admin: 'bg-admin/10 text-admin border-admin/20',
  manager: 'bg-manager/10 text-manager border-manager/20',
  user: 'bg-user/10 text-user border-user/20',
};

const roleTranslations: Record<Role, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  user: 'Usuário',
};

const UserCard: React.FC<UserCardProps> = ({ user, onDelete }) => {
  const { user: currentUser, token } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const canEdit = currentUser?.role === 'admin' || 
                 (currentUser?.role === 'manager' && user.role === 'user') || 
                 currentUser?.id === user.id;
  
  const canDelete = currentUser?.role === 'admin' && currentUser.id !== user.id;
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.deleteUser(user.id, token);
      toast('Usuário excluído com sucesso');
      onDelete();
    } catch (error) {
      toast(`Erro: ${(error as Error).message}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn('border-b bg-muted/40 py-3')}>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{user.name}</span>
          <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', roleBadgeStyles[user.role])}>
            <BadgeCheck className="mr-1 h-3.5 w-3.5" />
            {roleTranslations[user.role]}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="mr-1.5 h-4 w-4" />
          {user.email}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-3">
        {canEdit && (
          <Link href={`/users/${user.id}/edit`} passHref>
            <Button variant="outline" size="sm" className="space-x-1">
              <Pencil className="h-4 w-4" />
              <span>Editar</span>
            </Button>
          </Link>
        )}
        
        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="space-x-1">
                <Trash2 className="h-4 w-4" />
                <span>Excluir</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta
                  de usuário de {user.name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserCard;
