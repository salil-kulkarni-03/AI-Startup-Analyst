import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatbotWidget } from './components/ChatbotWidget';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { UploadPage } from './components/UploadPage';
import { DashboardPage } from './components/DashboardPage';
import { AnalysisPage } from './components/AnalysisPage';
import { ReportPage } from './components/ReportPage';
import { Toaster } from './components/ui/sonner';
import { useUser, useClerk } from '@clerk/clerk-react';

type Page = 'landing' | 'login' | 'upload' | 'dashboard' | 'analysis' | 'reports';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedStartupId, setSelectedStartupId] = useState<string>('1');

  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Sync auth state with Clerk
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        setIsLoggedIn(true);
        setUserName(user.fullName || user.username || user.primaryEmailAddress?.emailAddress.split('@')[0] || 'User');
        setUserEmail(user.primaryEmailAddress?.emailAddress || '');
        if (currentPage === 'landing' || currentPage === 'login') {
          setCurrentPage('dashboard');
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setUserEmail('');
        if (currentPage !== 'landing' && currentPage !== 'login') {
          setCurrentPage('landing');
        }
      }
    }
  }, [isSignedIn, user, isLoaded, currentPage]);

  const handleNavigate = (page: string, startupId?: string) => {
    setCurrentPage(page as Page);
    if (startupId) {
      setSelectedStartupId(startupId);
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (name: string, email: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserEmail(email);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    signOut();
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'upload':
        return <UploadPage onNavigate={handleNavigate} userName={userName} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} userName={userName} />;
      case 'analysis':
        return <AnalysisPage startupId={selectedStartupId} onNavigate={handleNavigate} userName={userName} />;
      case 'reports':
        return <ReportPage onNavigate={handleNavigate} userName={userName} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b18]">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        isLoggedIn={isLoggedIn} 
        userName={userName}
        onLogout={handleLogout}
      />
      {renderPage()}
      {isLoggedIn && <ChatbotWidget selectedStartupId={selectedStartupId} />}
      <Toaster />
    </div>
  );
}
