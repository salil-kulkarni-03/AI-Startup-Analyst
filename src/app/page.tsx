'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { LandingPage } from '../components/LandingPage';
import { getCurrentUser } from '../lib/auth';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleNavigate = (page: string) => {
    router.push(`/${page}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <>
      <Navbar 
        currentPage="landing" 
        onNavigate={handleNavigate} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <LandingPage onNavigate={handleNavigate} />
    </>
  );
}
