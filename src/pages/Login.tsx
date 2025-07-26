import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Mail, Lock, Chrome } from 'lucide-react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError("Falha ao fazer login com o Google.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('Usuário não encontrado.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Senha incorreta.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(isRegistering ? 'Falha ao criar conta.' : 'Falha ao fazer login.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            {isRegistering ? 'Criar Conta' : 'Login'}
          </CardTitle>
          <p className="text-gray-600">
            {isRegistering 
              ? 'Crie sua conta para acessar o dashboard' 
              : 'Entre para acessar o dashboard'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
            className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <Chrome className="w-4 h-4 mr-2" />
            Entrar com Google
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              ou
            </span>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Carregando...' : (isRegistering ? 'Criar Conta' : 'Entrar')}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-red-600 hover:underline"
            >
              {isRegistering 
                ? 'Já tem uma conta? Faça login' 
                : 'Não tem uma conta? Registre-se'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

