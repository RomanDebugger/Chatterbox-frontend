'use client';
import { useState,} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import FloatingBackground from '../components/FloatingBackground';
import Logo from '../components/Logo';
import AuthToggle from '../components/auth/AuthToggle';
import AuthForm from '../components/auth/AuthForm';

export default function AuthPage() {
  const [activeForm, setActiveForm] = useState('login');
  const [form, setForm] = useState({
  username: '',
  password: '',
  confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const GRADIENTS = {
  primary: 'from-amber-400 to-rose-400', 
  secondary: 'from-sky-400 to-indigo-400'
  };
  
  const handleFormChange = (formType) => {
  setForm({
    username: '',
    password: '',
    confirmPassword: formType === 'signup' ? '' : undefined
  });
  setError('');
};
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (activeForm === 'signup' && form.password !== form.confirmPassword) {
        setError('Passwords must match');
        return;
      }
      const result = activeForm === 'login'
        ? await login(form)
        : await signup(form);

      if (result.success) {
        router.push('/chat');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-700 overflow-hidden relative">
      <FloatingBackground className="absolute inset-0 z-0" />
      <div className="relative bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 w-full max-w-md mx-4 shadow-xl">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-100 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div className="text-center mb-8">
      <Logo className="w-16 h-16 mx-auto mb-4" />
      <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${GRADIENTS.primary} bg-clip-text text-transparent`}>
        Chatterbox
      </h1>
      <p className="text-slate-300 font-mono">"Chat or are we cooked? 💀"</p>
      <p className="text-slate-400 text-sm mt-1 font-mono">no emails, just vibes</p>
    </div>
        <AuthToggle
          activeForm={activeForm}
          setActiveForm={setActiveForm}
          onFormChange={handleFormChange}
        />
        <AuthForm
          activeForm={activeForm}
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
        <div className="mt-6 text-center">
      <p className="text-slate-500 text-xs font-mono">
        {activeForm === 'login' 
          ? '"forgot password? skill issue much?"'
          : '"we don\'t track you (much)"'}
      </p>
    </div>
      </div>
    </div>
  );
}
