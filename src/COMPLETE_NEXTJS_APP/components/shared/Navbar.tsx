'use client';

/**
 * ===========================================
 * NAVBAR - Main Navigation Bar
 * ===========================================
 * 
 * Features:
 * - Cereva branding with logo
 * - Smooth scrolling to sections on landing page
 * - Purple buttons throughout
 * - Shows Dashboard/Upload/Reports when logged in
 * - No Settings option (removed as requested)
 */

import { Menu, X, Brain } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogout?: () => void;
}

export function Navbar({ currentPage, onNavigate, isLoggedIn, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items based on login state
  const navItems = isLoggedIn
    ? [
        { label: 'Dashboard', page: 'dashboard' },
        { label: 'Upload', page: 'upload' },
        { label: 'Reports', page: 'reports' },
      ]
    : [
        { label: 'Home', page: 'landing', scrollTo: 'home' },
        { label: 'Features', page: 'landing', scrollTo: 'features' },
      ];

  // Handle navigation with smooth scrolling for landing page sections
  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.scrollTo && currentPage === 'landing') {
      // Smooth scroll to section on landing page
      const element = document.getElementById(item.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      onNavigate(item.page);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070b18]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO - Cereva with Brain Icon */}
          <button
            onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xl font-semibold">Cereva</span>
          </button>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, idx) => (
              <button
                key={`${item.label}-${idx}`}
                onClick={() => handleNavClick(item)}
                className={`text-sm transition-colors ${
                  currentPage === item.page
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* AUTH BUTTONS - ALL PURPLE */}
            {isLoggedIn ? (
              <Button
                onClick={onLogout}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => onNavigate('login')}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              {navItems.map((item, idx) => (
                <button
                  key={`${item.label}-mobile-${idx}`}
                  onClick={() => handleNavClick(item)}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.page
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {isLoggedIn ? (
                <Button
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white mx-4"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white mx-4"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
