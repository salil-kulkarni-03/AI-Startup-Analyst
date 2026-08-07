'use client';

/**
 * NAVBAR - Infinity Branding via Clerk
 * - UserButton when logged in (handles Profile and Sign Out)
 * - Dark theme styling
 * - Smooth scrolling
 */

import { Infinity, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
}

export function Navbar({ currentPage, onNavigate, isLoggedIn, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = (page: string, scrollTo?: string) => {
    if (scrollTo && currentPage === 'landing') {
      // Smooth scroll to section
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(page);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070b18]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - INFINITY */}
          <button
            onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#171c92] to-[#13182a] flex items-center justify-center">
              <Infinity className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xl font-semibold">Infinity</span>
          </button>

          {/* Desktop Navigation - CENTERED */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.page, item.scrollTo)}
                className={`text-sm transition-colors ${
                  currentPage === item.page
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side - Clerk UserButton or login trigger */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-9 h-9 border border-white/20 hover:border-white/40 transition-colors',
                  }
                }}
              />
            ) : (
              <Button
                onClick={() => onNavigate('login')}
                className="bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-white/10 bg-[#070b18] px-4">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.page, item.scrollTo)}
                className={`text-left px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.page
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            {isLoggedIn ? (
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <span className="text-sm text-gray-400">Account Control</span>
                <UserButton 
                  afterSignOutUrl="/" 
                  showName 
                  appearance={{
                    elements: {
                      userButtonOuterIdentifier: 'text-white font-medium',
                    }
                  }}
                />
              </div>
            ) : (
              <Button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
