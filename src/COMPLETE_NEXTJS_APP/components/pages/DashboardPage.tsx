'use client';

/**
 * ===========================================
 * DASHBOARD PAGE - Main User Dashboard
 * ===========================================
 * 
 * Features:
 * - Profile button in top-left corner
 * - Stats overview
 * - Startup cards grid
 * - Filter by category
 * - Back arrow to navigate
 * 
 * TODO: Connect to your backend
 * - Fetch real startup data from database
 * - Load user profile information
 * - Add real-time updates
 */

import { Plus, TrendingUp, AlertTriangle, BarChart3, Filter, User, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { StartupCard } from '../shared/StartupCard';
import { mockStartups } from '@/lib/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface DashboardPageProps {
  onNavigate: (page: string, startupId?: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [filter, setFilter] = useState('all');
  
  // Profile state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileCompany, setProfileCompany] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  // Stats data
  const stats = [
    {
      label: 'Total Analyzed',
      value: mockStartups.length,
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'High Potential',
      value: mockStartups.filter((s) => {
        const avg = (s.scores.team + s.scores.market + s.scores.product + s.scores.risk) / 4;
        return avg >= 75;
      }).length,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Red Flags',
      value: mockStartups.reduce((acc, s) => acc + s.redFlags.length, 0),
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
    },
  ];

  // Filter startups
  const filteredStartups = mockStartups.filter((s) => {
    if (filter === 'all') return true;
    return s.category === filter;
  });

  // Handle profile save
  // TODO: Add API call to save profile to database
  const handleSaveProfile = () => {
    // Example: await fetch('/api/profile', { method: 'PUT', body: JSON.stringify({ name, email, company }) })
    toast.success('Profile updated successfully!', {
      description: 'Your changes have been saved.',
    });
    setProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b18] via-[#111932] to-[#13182a] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* ============================================= */}
        {/* HEADER with Profile Button */}
        {/* ============================================= */}
        <div className="flex items-start justify-between mb-8">
          
          {/* Left Side - Profile Button & Title */}
          <div className="flex items-center gap-4">
            {/* PROFILE BUTTON - Top Left Corner */}
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-purple-600/50 hover:bg-purple-900/20 hover:border-purple-500"
                >
                  <User className="w-5 h-5 text-purple-400" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111932] border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">My Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-gray-300">Company</Label>
                    <Input
                      id="company"
                      value={profileCompany}
                      onChange={(e) => setProfileCompany(e.target.value)}
                      placeholder="Your company name"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                  >
                    Update Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div>
              <h1 className="text-4xl text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Track and analyze your startup pipeline</p>
            </div>
          </div>

          {/* Right Side - Upload Button */}
          <Button
            onClick={() => onNavigate('upload')}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {/* ============================================= */}
        {/* STATS CARDS */}
        {/* ============================================= */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-4xl text-white">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ============================================= */}
        {/* FILTERS */}
        {/* ============================================= */}
        <div className="flex items-center gap-4 mb-6">
          <Filter className="w-5 h-5 text-gray-400" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-[#111932] border-white/10">
              <SelectItem value="all" className="text-white">All Startups</SelectItem>
              <SelectItem value="SaaS" className="text-white">SaaS</SelectItem>
              <SelectItem value="Fintech" className="text-white">Fintech</SelectItem>
              <SelectItem value="Healthcare" className="text-white">Healthcare</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ============================================= */}
        {/* STARTUP CARDS GRID */}
        {/* ============================================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <StartupCard
              key={startup.id}
              startup={startup}
              onClick={() => onNavigate('analysis', startup.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredStartups.length === 0 && (
          <div className="text-center py-16">
            <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No startups found with this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
