'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { AnalysisPage } from '../../../components/AnalysisPage';
import { ChatbotWidget } from '../../../components/ChatbotWidget';
import { getCurrentUser } from '../../../lib/auth';

export default function Analysis() {
  const router = useRouter();
  const params = useParams();
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

  const handleNavigate = (page: string) => {
    router.push(`/${page}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push('/');
  };

  if (!userName) return null;

  return (
    <>
      <Navbar 
        currentPage="analysis" 
        onNavigate={handleNavigate} 
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
      />
      <AnalysisPage 
        startupId={params.id as string} 
        onNavigate={handleNavigate} 
        userName={userName} 
      />
      <ChatbotWidget />
    </>
  );
}
