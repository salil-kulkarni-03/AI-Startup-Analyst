'use client';

/**
 * ===========================================
 * LANDING PAGE - Home & Marketing Page
 * ===========================================
 * 
 * Features:
 * - Hero section with centered text
 * - 6 clickable feature cards (darker purple)
 * - Pyramid graphic before "How It Works"
 * - Short "How It Works" section
 * - Footer with contact information
 * - Smooth scrolling to sections
 */

import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Shield,
  Zap,
  Brain,
  Upload,
  FileCheck,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  // 6 feature cards - all navigate to login
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
      {/* HERO SECTION - Centered Text */}
      {/* ============================================= */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#070b18] via-[#1a1f3a] to-[#13182a] opacity-90" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">AI-Powered Investment Analysis</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl text-white mb-6 tracking-tight leading-tight">
            Your Smartest
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Startup Analyst
            </span>
          </h1>

          {/* Subheading - FIXED: Single line for "in minutes" */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop drowning in pitch decks and unstructured data. Get investor-ready insights, scores, and red flags in minutes — not weeks.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-left bg-white/5 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-200">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button - PURPLE */}
          <div>
            <Button
              onClick={() => onNavigate('login')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-10 py-6 text-lg h-auto"
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
      {/* FEATURES SECTION - Darker Purple Boxes */}
      {/* ============================================= */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-400">
              Powerful features designed for modern investors
            </p>
          </div>

          {/* Feature Cards - DARKER PURPLE BACKGROUND */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                onClick={() => onNavigate('login')}
                className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 border-purple-700/30 p-6 hover:from-purple-800/50 hover:to-purple-900/50 transition-all hover:scale-105 cursor-pointer relative overflow-hidden group backdrop-blur-sm"
              >
                <div className="relative z-10">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-purple-500 to-purple-700"
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl text-white mb-2">{feature.title}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-300">{feature.description}</p>
                </div>
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
              <div className="w-32 h-16 bg-gradient-to-br from-purple-600 to-blue-600 clip-path-triangle flex items-center justify-center rounded-lg">
                <span className="text-white text-sm font-semibold">Elite Startups</span>
              </div>
              {/* Middle */}
              <div className="w-48 h-20 bg-gradient-to-br from-purple-700 to-blue-700 flex items-center justify-center rounded-lg">
                <span className="text-white">Promising Ventures</span>
              </div>
              {/* Bottom */}
              <div className="w-64 h-24 bg-gradient-to-br from-purple-800 to-blue-800 flex items-center justify-center rounded-lg">
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
      {/* HOW IT WORKS - SHORTER VERSION */}
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
              <div key={idx} className="text-center">
                <div 
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-purple-600 to-purple-800"
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
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/30 rounded-3xl p-12 backdrop-blur-sm">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl text-white mb-4">
              Ready to Transform Your Investment Process?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join forward-thinking investors using AI for better decisions.
            </p>
            <Button
              onClick={() => onNavigate('login')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-8 h-12"
            >
              Start Analyzing Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FOOTER - Simple with Contact Info */}
      {/* ============================================= */}
      <footer className="border-t border-white/10 py-12 px-4" style={{ backgroundColor: '#070b18' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* About */}
            <div>
              <h3 className="text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                About Cereva
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                AI-powered startup analysis platform helping investors make smarter, faster decisions.
              </p>
              <button 
                onClick={() => onNavigate('login')}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                Learn More →
              </button>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-400" />
                Contact Us
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="tel:8830159065" className="block hover:text-purple-400 transition-colors">
                  +91 8830159065
                </a>
                <a href="tel:7499527448" className="block hover:text-purple-400 transition-colors">
                  +91 7499527448
                </a>
                <a href="tel:7249449061" className="block hover:text-purple-400 transition-colors">
                  +91 7249449061
                </a>
                <a href="tel:9322828634" className="block hover:text-purple-400 transition-colors">
                  +91 9322828634
                </a>
              </div>
            </div>

            {/* Email & Links */}
            <div>
              <h3 className="text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-400" />
                Get In Touch
              </h3>
              <a 
                href="mailto:cerevastartupsupport@gmail.com"
                className="text-sm text-gray-400 hover:text-purple-400 transition-colors block mb-4"
              >
                cerevastartupsupport@gmail.com
              </a>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={() => window.open('https://cereva.com', '_blank')}
                  className="text-gray-400 hover:text-purple-400 transition-colors block"
                >
                  Visit Website →
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            © 2025 Cereva. All rights reserved. | AI-Powered Startup Analysis Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
