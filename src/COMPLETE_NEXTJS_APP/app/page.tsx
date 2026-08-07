'use client';

/**
 * ===========================================
 * MAIN APP - CEREVA AI ANALYST PLATFORM
 * ===========================================
 * 
 * This is the main entry point of the application.
 * It handles routing between different pages.
 * 
 * PAGES:
 * - Landing: Home page with features
 * - Login: User authentication
 * - Dashboard: Main user dashboard with profile
 * - Upload: File upload interface
 * - Analysis: Detailed startup analysis
 * - Reports: Report generation
 * 
 * FOR BACKEND DEVELOPERS:
 * - Search for "TODO:" to find integration points
 * - Add authentication logic in handleLogin function
 * - Connect to Supabase/Firebase for user management
 */

import { useState } from 'react';
import { LandingPage } from '@/components/pages/LandingPage';
import { LoginPage } from '@/components/pages/LoginPage';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { UploadPage } from '@/components/pages/UploadPage';
import { AnalysisPage } from '@/components/pages/AnalysisPage';
import { ReportPage } from '@/components/pages/ReportPage';
import { Navbar } from '@/components/shared/Navbar';
import { ChatbotWidget } from '@/components/shared/ChatbotWidget';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  // Current page state - controls which page is shown
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Login state - tracks if user is authenticated
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Navigation function - used by all components to change pages
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login handler
  // TODO: Add your authentication logic here (Supabase/Firebase)
  const handleLogin = () => {
    // Example: await supabase.auth.signIn({ email, password })
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  // Logout handler
  // TODO: Add your logout logic here
  const handleLogout = () => {
    // Example: await supabase.auth.signOut()
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  // Render the current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      
      case 'upload':
        return <UploadPage onNavigate={handleNavigate} />;
      
      case 'analysis':
        return <AnalysisPage onNavigate={handleNavigate} />;
      
      case 'reports':
        return <ReportPage onNavigate={handleNavigate} />;
      
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b18]">
      {/* Navigation Bar - shown on all pages */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Content - changes based on current page */}
      <main>{renderPage()}</main>

      {/* Chatbot - only shown when user is logged in */}
      {isLoggedIn && <ChatbotWidget />}

      {/* Toast Notifications - for success/error messages */}
      <Toaster />
    </div>
  );
}
