'use client';

/**
 * LOGIN & SIGNUP PAGE - Infinity Branding via Clerk
 * - Clerk Authentication with Google, Email & Password OTP
 * - Styled to match the Infinity Dark Theme
 */

import { Infinity } from 'lucide-react';
import { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

interface LoginPageProps {
  onLogin?: (userName: string, userEmail: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);

  const clerkAppearance = {
    variables: {
      colorPrimary: '#8b9bd7',
      colorBackground: '#111932',
      colorText: '#ffffff',
      colorInputBackground: 'rgba(255, 255, 255, 0.05)',
      colorInputText: '#ffffff',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
      colorTextSecondary: '#9ca3af',
    },
    elements: {
      card: 'bg-[#111932] border border-white/10 shadow-2xl rounded-2xl',
      headerTitle: 'text-white font-semibold',
      headerSubtitle: 'text-gray-400',
      socialButtonsBlockButton: 'bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors',
      socialButtonsBlockButtonText: 'text-white',
      formButtonPrimary: 'bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white border-0 transition-all py-2.5',
      footerActionLink: 'text-[#8b9bd7] hover:text-white transition-colors',
      formFieldLabel: 'text-gray-300',
      formFieldInput: 'bg-white/5 border-white/10 text-white focus:border-[#8b9bd7]',
      dividerLine: 'bg-white/10',
      dividerText: 'text-gray-500',
      identityPreviewText: 'text-white',
      identityPreviewEditButtonIcon: 'text-white',
      footer: 'hidden',
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b18] via-[#111932] to-[#13182a] flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Logo - INFINITY */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#171c92] to-[#13182a] flex items-center justify-center">
              <Infinity className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl text-white font-semibold">Infinity</span>
          </div>
        </div>

        {/* Clerk Sign In / Sign Up Widgets */}
        <div className="w-full flex justify-center">
          {isSignup ? (
            <SignUp 
              appearance={clerkAppearance} 
            />
          ) : (
            <SignIn 
              appearance={clerkAppearance} 
            />
          )}
        </div>

        {/* Custom Toggle below Clerk widgets */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-gray-400 hover:text-[#8b9bd7] transition-colors"
          >
            {isSignup
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
