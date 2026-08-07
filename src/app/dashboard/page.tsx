'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/Navbar';
import { DashboardPage } from '../../components/DashboardPage';
import { ChatbotWidget } from '../../components/ChatbotWidget';
import { getCurrentUser } from '../../lib/auth';

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    } else {
      setUserName(user.name);
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleNavigate = (page: string, startupId?: string) => {
    if (startupId) {
      router.push(`/analysis/${startupId}`);
    } else {
      router.push(`/${page}`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push('/');
  };

  if (!userName) return null;

  return (
    <>
      <Navbar 
        currentPage="dashboard" 
        onNavigate={handleNavigate} 
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
      />
      <DashboardPage onNavigate={handleNavigate} userName={userName} />
      <ChatbotWidget />
    </>
  );
}
