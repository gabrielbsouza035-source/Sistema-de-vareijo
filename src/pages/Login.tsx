import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Mail, Lock, Eye, EyeOff, Chrome, User, ArrowLeft, UserPlus, KeyRound } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthPage({ onLogin }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de autenticação
    setTimeout(() => {
      setLoading(false);
      if (mode !== 'forgot') onLogin();
    }, 2000);
  };

  const renderHeader = () => {
    switch (mode) {
      case 'register':
        return {
          icon: <UserPlus className="w-8 h-8 text-violet-400" />,
          title: "Criar Conta",
          desc: "Comece a gerenciar seu varejo hoje"
        };
      case 'forgot':
        return {
          icon: <KeyRound className="w-8 h-8 text-violet-400" />,
          title: "Recuperar Senha",
          desc: "Enviaremos um link para o seu e-mail"
        };
      default:
        return {
          icon: <LogIn className="w-8 h-8 text-violet-400" />,
          title: "Bem-vindo",
          desc: "Acesse sua conta para continuar"
        };
    }
  };

  const header = renderHeader();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden p-4">
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-[400px] z-10 animate-slide-up">
        {/* Logo/Icon e Títulos */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-violet-600/20 mb-4 border border-violet-500/30">
            {header.icon}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{header.title}</h1>
          <p className="text-white/50 mt-2 text-sm">{header.desc}</p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Campo Nome (Apenas no Registro) */}
            {mode === 'register' && (
              <div className="space-y-2 animate-in fade-in duration-500">
                <Label htmlFor="name" className="text-white/70 ml-1">Nome Completo</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-violet-400 transition-colors" />
                  <Input 
                    id="name"
                    placeholder="Seu nome"
                    className="bg-white/5 border-white/10 pl-10 h-12 text-white placeholder:text-white/20 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-xl"
                    required
                  />
                </div>
              </div>
            )}

            {/* Campo Email (Sempre visível) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70 ml-1">E-mail</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-violet-400 transition-colors" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-white/5 border-white/10 pl-10 h-12 text-white placeholder:text-white/20 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Campo Senha (Escondido na Recuperação) */}
            {mode !== 'forgot' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="text-white/70">Senha</Label>
                  {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Esqueceu?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-violet-400 transition-colors" />
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 pl-10 pr-10 h-12 text-white placeholder:text-white/20 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-xl"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-600/20 transition-all active:scale-[0.98]"
            >
              {loading ? "Processando..." : mode === 'login' ? "Entrar na Conta" : mode === 'register' ? "Criar Conta" : "Enviar Link"}
            </Button>
          </form>

          {/* Botão Voltar (Para Registro e Esqueci Senha) */}
          {mode !== 'login' && (
            <button 
              onClick={() => setMode('login')}
              className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para o login
            </button>
          )}

          {mode === 'login' && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#121212] px-2 text-white/30 tracking-widest">Ou continue com</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-11 transition-all">
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer Toggle */}
        <p className="text-center mt-8 text-white/40 text-sm">
          {mode === 'register' ? 'Já tem uma conta?' : 'Não tem uma conta?'} {' '}
          <button 
            onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
            className="text-violet-400 font-semibold hover:underline"
          >
            {mode === 'register' ? 'Entrar agora' : 'Criar agora'}
          </button>
        </p>
      </div>
    </div>
  );
}