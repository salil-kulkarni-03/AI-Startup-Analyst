'use client';

/**
 * DASHBOARD PAGE - Shows Uploaded Documents
 * - Displays user uploads from localStorage
 * - Real-time updates when new docs uploaded
 * - Profile + Logout in navbar
 */

import { Plus, TrendingUp, AlertTriangle, BarChart3, Filter, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState, useEffect } from 'react';
import { getUploadedDocs, UploadedDocument } from '../lib/uploads';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface DashboardPageProps {
  onNavigate: (page: string, startupId?: string) => void;
  userName: string;
}

export function DashboardPage({ onNavigate, userName }: DashboardPageProps) {
  const [filter, setFilter] = useState('all');
  const [uploads, setUploads] = useState<UploadedDocument[]>([]);

  // Load uploads on mount and listen for changes
  useEffect(() => {
    loadUploads();

    // Listen for storage changes (when new uploads added)
    const handleStorageChange = () => {
      loadUploads();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadUploads = () => {
    const docs = getUploadedDocs();
    setUploads(docs);
  };

  const filteredUploads = uploads.filter((u) => {
    if (filter === 'all') return true;
    return u.category === filter;
  });

  const stats = [
    {
      label: 'Total Analyzed',
      value: uploads.filter(u => u.status === 'completed').length,
      icon: BarChart3,
      color: 'from-[#171c92] to-[#161b2c]',
    },
    {
      label: 'In Progress',
      value: uploads.filter(u => u.status === 'analyzing').length,
      icon: Loader2,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Red Flags Found',
      value: uploads.reduce((acc, u) => acc + (u.redFlags?.length || 0), 0),
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
    },
  ];



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'analyzing': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getAverageScore = (scores?: { team: number; market: number; product: number; risk: number }) => {
    if (!scores) return 0;
    return Math.round((scores.team + scores.market + scores.product + scores.risk) / 4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b18] via-[#111932] to-[#13182a] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          
          <div>
            <h1 className="text-4xl text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {userName}!</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Upload Button */}
            <Button
              onClick={() => onNavigate('upload')}
              className="bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* STATS CARDS */}
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

        {/* FILTERS */}
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

        {/* UPLOADED DOCUMENTS GRID */}
        {filteredUploads.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUploads.map((upload) => (
              <Card
                key={upload.id}
                onClick={() => upload.status === 'completed' && onNavigate('analysis', upload.id)}
                className={`bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-all ${
                  upload.status === 'completed' ? 'cursor-pointer hover:scale-105' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg text-white mb-2">{upload.name}</h3>
                    <Badge className={`${getStatusColor(upload.status)} border`}>
                      {upload.status === 'analyzing' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      {upload.status}
                    </Badge>
                  </div>
                  <Badge className="bg-[#171c92]/20 text-[#8b9bd7] border-[#171c92]/30 border">
                    {upload.category}
                  </Badge>
                </div>

                {upload.status === 'analyzing' && (
                  <div className="mb-4">
                    <Progress value={66} className="h-2" />
                    <p className="text-xs text-gray-400 mt-2">Analyzing startup data...</p>
                  </div>
                )}

                {upload.scores && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Overall Score</span>
                      <span className="text-2xl text-white font-semibold">
                        {getAverageScore(upload.scores)}
                      </span>
                    </div>
                    <Progress value={getAverageScore(upload.scores)} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Uploaded {upload.uploadDate}</span>
                  {upload.status === 'completed' && (
                    <span className="text-[#8b9bd7]">View Details →</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 border-white/10 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No documents uploaded yet</h3>
            <p className="text-gray-400 mb-6">
              Upload your first startup document to get AI-powered insights
            </p>
            <Button
              onClick={() => onNavigate('upload')}
              className="bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
