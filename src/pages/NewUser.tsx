
import Layout from '@/components/Layout';
import UserForm from '@/components/UserForm';

const NewUser = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New User</h1>
          <p className="text-muted-foreground">Add a new user to the system.</p>
        </div>
        
        <UserForm />
      </div>
    </Layout>
  );
};

export default NewUser;
