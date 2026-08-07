'use client';

/**
 * LANDING PAGE - Infinity Branding
 * - Professional styling for benefits
 * - Scroll animations on features
 * - Updated email
 * - Smaller hero subheading
 */

import {
  Infinity as InfinityIcon,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Upload,
  Brain,
  FileCheck,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useEffect, useState } from 'react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);

  // Scroll animation for features
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleFeatures((prev) => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: FileText,
      title: 'Smart Document Analysis',
      description: 'Upload pitch decks, emails, and calls. AI extracts key insights instantly.',
    },
    {
      icon: TrendingUp,
      title: 'Automated Scoring',
      description: 'Get objective scores for Team, Market, Product, and Risk in seconds.',
    },
    {
      icon: AlertTriangle,
      title: 'Red Flag Detection',
      description: 'AI identifies inconsistencies, missing data, and unrealistic claims.',
    },
    {
      icon: BarChart3,
      title: 'KPI Extraction',
      description: 'Automatically extract burn rate, runway, CAC, and other critical metrics.',
    },
    {
      icon: Users,
      title: 'Founder Profiling',
      description: 'Deep analysis of founder experience, network, and credibility.',
    },
    {
      icon: Shield,
      title: 'Scenario Simulation',
      description: 'Model "what-if" scenarios to predict outcomes and risks.',
    },
  ];

  const benefits = [
    '10x faster due diligence',
    'Consistent, objective analysis',
    'Never miss critical red flags',
    'Investor-ready reports in minutes',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b18] via-[#111932] to-[#13182a]">
      
      {/* ============================================= */}
      {/* HERO SECTION */}
      {/* ============================================= */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#070b18] via-[#1a1f3a] to-[#13182a] opacity-90" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          
          {/* Badge - PROFESSIONAL STYLE */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#161b2c]/30 to-blue-900/30 border border-[#171c92]/30 backdrop-blur-sm mb-8">
            <Zap className="w-5 h-5 text-[#8b9bd7]" />
            <span className="text-sm text-gray-200 tracking-wide">AI-Powered Investment Analysis</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl text-white mb-6 tracking-tight leading-tight">
            Your Smartest
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-[#8b9bd7] to-pink-400 bg-clip-text text-transparent">
              AI Startup Analyst
            </span>
          </h1>

          {/* Subheading - SMALLER FONT */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop drowning in pitch decks and unstructured data. Get investor-ready insights, scores, and red flags in minutes — not weeks.
          </p>

          {/* Benefits - PROFESSIONAL LAYOUT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-left px-6 py-4 rounded-xl bg-gradient-to-r from-[#161b2c]/20 to-transparent border border-[#171c92]/20 backdrop-blur-sm group hover:border-[#171c92]/40 transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-[#8b9bd7] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-base text-gray-200 font-light tracking-wide">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div>
            <Button
              onClick={() => onNavigate('login')}
              size="lg"
              className="bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white px-10 py-6 text-lg h-auto shadow-lg shadow-[#111932]/30"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FEATURES SECTION - WITH SCROLL ANIMATIONS */}
      {/* ============================================= */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-400">
              Powerful features designed for modern investors
            </p>
          </div>

          {/* Feature Cards - ANIMATED ON SCROLL */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                data-index={idx}
                onClick={() => onNavigate('login')}
                className={`feature-card bg-gradient-to-br from-[#161b2c]/40 to-[#111932]/40 border-[#171c92]/30 p-6 hover:from-[#161b2c]/50 hover:to-[#111932]/50 cursor-pointer relative overflow-hidden group backdrop-blur-sm transition-all duration-500 ${
                  visibleFeatures.includes(idx)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="relative z-10">
                  {/* Icon - ANIMATED */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-[#171c92] to-[#13182a] group-hover:scale-110 transition-transform"
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl text-white mb-2">{feature.title}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-300">{feature.description}</p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#171c92]/0 to-[#13182a]/0 group-hover:from-[#171c92]/10 group-hover:to-[#13182a]/10 transition-all duration-300" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* PYRAMID GRAPHIC SECTION */}
      {/* ============================================= */}
      <section className="py-16 px-4" style={{ backgroundColor: '#0a0f1f' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            {/* Pyramid Visualization */}
            <div className="flex flex-col items-center gap-3 mb-8">
              {/* Top */}
              <div className="w-32 h-16 bg-gradient-to-br from-[#171c92] to-blue-600 flex items-center justify-center rounded-lg transform hover:scale-105 transition-transform">
                <span className="text-white text-sm font-semibold">Elite Startups</span>
              </div>
              {/* Middle */}
              <div className="w-48 h-20 bg-gradient-to-br from-[#161b2c] to-blue-700 flex items-center justify-center rounded-lg transform hover:scale-105 transition-transform">
                <span className="text-white">Promising Ventures</span>
              </div>
              {/* Bottom */}
              <div className="w-64 h-24 bg-gradient-to-br from-[#13182a] to-blue-800 flex items-center justify-center rounded-lg transform hover:scale-105 transition-transform">
                <span className="text-white text-lg">All Submissions</span>
              </div>
            </div>
            <p className="text-gray-400 text-lg">
              AI-powered filtering helps you find the top 1% of startups instantly
            </p>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* HOW IT WORKS - 3 STEPS */}
      {/* ============================================= */}
      <section className="py-16 px-4" style={{ backgroundColor: '#0d1126' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: 'Upload', desc: 'Drop your files' },
              { icon: Brain, title: 'AI Analyzes', desc: 'Get instant insights' },
              { icon: FileCheck, title: 'Review', desc: 'Make decisions' },
            ].map((step, idx) => (
              <div key={idx} className="text-center group">
                <div 
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-[#171c92] to-[#13182a] group-hover:scale-110 transition-transform"
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* CTA SECTION */}
      {/* ============================================= */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#161b2c]/30 to-blue-900/30 border border-[#171c92]/30 rounded-3xl p-12 backdrop-blur-sm">
            <InfinityIcon className="w-16 h-16 text-[#8b9bd7] mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl text-white mb-4">
              Ready to Transform Your Investment Process?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join forward-thinking investors using AI for better decisions.
            </p>
            <Button
              onClick={() => onNavigate('login')}
              size="lg"
              className="bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white px-8 h-12 shadow-lg shadow-[#111932]/30"
            >
              Start Analyzing Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FOOTER - Updated Email */}
      {/* ============================================= */}
      <footer className="border-t border-white/10 py-12 px-4" style={{ backgroundColor: '#070b18' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* About */}
            <div>
              <h3 className="text-white mb-4 flex items-center gap-2">
                <InfinityIcon className="w-5 h-5 text-[#8b9bd7]" />
                About Infinity
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                AI-powered startup analysis platform helping investors make smarter, faster decisions.
              </p>
              <button 
                onClick={() => onNavigate('login')}
                className="text-[#8b9bd7] hover:text-[#a8b5e8] text-sm transition-colors"
              >
                Learn More →
              </button>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#8b9bd7]" />
                Contact Us
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="tel:8830159065" className="block hover:text-[#8b9bd7] transition-colors">
                  +91 8830159065
                </a>
                <a href="tel:7499527448" className="block hover:text-[#8b9bd7] transition-colors">
                  +91 7499527448
                </a>
                <a href="tel:7249449061" className="block hover:text-[#8b9bd7] transition-colors">
                  +91 7249449061
                </a>
                <a href="tel:9322828634" className="block hover:text-[#8b9bd7] transition-colors">
                  +91 9322828634
                </a>
              </div>
            </div>

            {/* Email & Links */}
            <div>
              <h3 className="text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#8b9bd7]" />
                Get In Touch
              </h3>
              <a 
                href="mailto:infinitysupport@gmail.com"
                className="text-sm text-gray-400 hover:text-[#8b9bd7] transition-colors block mb-4"
              >
                infinitysupport@gmail.com
              </a>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={() => window.open('https://infinity.com', '_blank')}
                  className="text-gray-400 hover:text-[#8b9bd7] transition-colors block"
                >
                  Visit Website →
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            © 2025 Infinity. All rights reserved. | AI-Powered Startup Analysis Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
