
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a página de edição para o usuário atual
    if (user?.id) {
      navigate(`/users/${user.id}/edit`);
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="flex h-40 items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    </Layout>
  );
};

export default Profile;
