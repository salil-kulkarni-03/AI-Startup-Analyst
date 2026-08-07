'use client';

/**
 * ===========================================
 * ANALYSIS PAGE - Detailed Startup Analysis
 * ===========================================
 * 
 * Shows comprehensive analysis of a startup including:
 * - Overall scores
 * - Radar chart visualization
 * - Red flags
 * - KPIs
 * - Back arrow navigation
 */

import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Users,
  Target,
  Package,
  Shield,
  FileText,
  BarChart3,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { mockStartups } from '@/lib/mockData';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface AnalysisPageProps {
  startupId?: string;
  onNavigate: (page: string) => void;
}

export function AnalysisPage({ startupId, onNavigate }: AnalysisPageProps) {
  const startup = mockStartups.find((s) => s.id === startupId) || mockStartups[0];

  const radarData = [
    { category: 'Team', value: startup.scores.team },
    { category: 'Market', value: startup.scores.market },
    { category: 'Product', value: startup.scores.product },
    { category: 'Risk', value: 100 - startup.scores.risk },
  ];

  const avgScore =
    (startup.scores.team + startup.scores.market + startup.scores.product + startup.scores.risk) / 4;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b18] via-[#111932] to-[#13182a] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* BACK BUTTON */}
        <Button
          onClick={() => onNavigate('dashboard')}
          variant="ghost"
          className="text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl text-white mb-2">{startup.name}</h1>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 border">
                {startup.category}
              </Badge>
              <span className="text-gray-400">Uploaded {startup.uploadDate}</span>
            </div>
          </div>
          <Button
            onClick={() => onNavigate('reports')}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Overall Score */}
        <Card className="bg-white/5 border-white/10 p-8 mb-8">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Overall Score</p>
            <p className={`text-6xl mb-4 ${getScoreColor(avgScore)}`}>
              {avgScore.toFixed(1)}
            </p>
            <p className="text-gray-400">out of 100</p>
          </div>
        </Card>

        {/* Scores Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Team', score: startup.scores.team, icon: Users },
            { label: 'Market', score: startup.scores.market, icon: Target },
            { label: 'Product', score: startup.scores.product, icon: Package },
            { label: 'Risk', score: startup.scores.risk, icon: Shield },
          ].map((item, idx) => (
            <Card key={idx} className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <item.icon className="w-5 h-5 text-purple-400" />
                <p className="text-gray-400">{item.label}</p>
              </div>
              <p className={`text-3xl mb-2 ${getScoreColor(item.score)}`}>
                {item.score}
              </p>
              <Progress value={item.score} className="h-2" />
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="redflags">Red Flags</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-6">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="category" stroke="#ffffff60" />
                  <Radar
                    dataKey="value"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="redflags">
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-6">Identified Red Flags</h3>
              <div className="space-y-4">
                {startup.redFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">{flag}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="kpis">
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-6">Key Performance Indicators</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {startup.kpis.map((kpi, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">{kpi.label}</p>
                    <p className="text-2xl text-white">{kpi.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
