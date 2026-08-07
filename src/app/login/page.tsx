'use client';

import { useRouter } from 'next/navigation';
import { LoginPage } from '../../components/LoginPage';

export default function Login() {
  const router = useRouter();

  const handleLogin = (name: string, email: string) => {
    router.push('/dashboard');
  };

  return <LoginPage onLogin={handleLogin} />;
}
