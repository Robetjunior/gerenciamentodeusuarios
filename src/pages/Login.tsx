
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!credentials.email) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email é inválido';
      isValid = false;
    }

    if (!credentials.password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is in AuthContext
    }
  };

  const demoLogin = async (role: 'admin' | 'manager' | 'user') => {
    const demoCredentials: LoginCredentials = {
      email: `${role}@example.com`,
      password: `${role}123`,
    };
    
    try {
      await login(demoCredentials);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is in AuthContext
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <Shield className="mr-2 h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Sistema de Controle de Acesso</h1>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Digite suas credenciais para acessar sua conta</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    className="pl-10"
                    value={credentials.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
              
              <div className="w-full text-center text-sm">
                <p className="mb-2 text-muted-foreground">Contas de demonstração (clique para testar):</p>
                <div className="flex justify-center space-x-2">
                  <Button type="button" variant="outline" size="sm" className="text-admin" onClick={() => demoLogin('admin')}>
                    Administrador
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="text-manager" onClick={() => demoLogin('manager')}>
                    Gerente
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="text-user" onClick={() => demoLogin('user')}>
                    Usuário
                  </Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
