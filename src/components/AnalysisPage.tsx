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
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { getUploadById } from '../lib/uploads';
import { ValuationSimulator } from './ValuationSimulator';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface AnalysisPageProps {
  startupId: string;
  onNavigate: (page: string) => void;
  userName: string;
}

export function AnalysisPage({ startupId, onNavigate, userName }: AnalysisPageProps) {
  const uploadedDoc = getUploadById(startupId);
  
  // If document not found or not completed, redirect to dashboard
  if (!uploadedDoc || uploadedDoc.status !== 'completed') {
    onNavigate('dashboard');
    return null;
  }
  
  // Map uploaded document to startup format
  const startup = {
    id: uploadedDoc.id,
    name: uploadedDoc.name,
    category: uploadedDoc.category,
    uploadDate: uploadedDoc.uploadDate,
    status: uploadedDoc.status,
    summary: uploadedDoc.summary || 'No summary available',
    scores: uploadedDoc.scores || { team: 0, market: 0, product: 0, risk: 0 },
    redFlags: uploadedDoc.redFlags || [],
    opportunities: uploadedDoc.opportunities || [],
    kpis: uploadedDoc.kpis || {
      burnRate: 'N/A',
      runway: 'N/A',
      cac: 'N/A',
      ltv: 'N/A',
    },
    founderInfo: uploadedDoc.founderInfo || {
      name: 'Not available',
      experience: 'Not available',
      education: 'Not available',
      networkScore: 0,
      sentimentScore: 0,
    },
  };

  const radarData = [
    { category: 'Team', value: startup.scores.team },
    { category: 'Market', value: startup.scores.market },
    { category: 'Product', value: startup.scores.product },
    { category: 'Risk', value: 100 - startup.scores.risk },
  ];

  const avgScore =
    (startup.scores.team +
      startup.scores.market +
      startup.scores.product +
      startup.scores.risk) /
    4;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b18] via-[#111932] to-[#13182a] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER with Back */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => onNavigate('dashboard')}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl text-white mb-2">{startup.name}</h1>
              <div className="flex items-center gap-3">
                <Badge className="bg-[#171c92]/20 text-[#8b9bd7] border-[#171c92]/30 border">
                  {startup.category}
                </Badge>
                <span className="text-gray-400">Uploaded {startup.uploadDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => onNavigate('reports')}
                className="bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Score */}
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-4">Overall Assessment</h3>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className={`text-6xl mb-2 ${getScoreColor(avgScore)}`}>
                    {avgScore.toFixed(0)}
                  </div>
                  <p className="text-gray-400">Overall Score</p>
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#9ca3af' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                      <Radar
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            {/* Detailed Scores */}
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                {[
                  { icon: Users, label: 'Team', value: startup.scores.team, color: 'text-blue-400' },
                  { icon: Target, label: 'Market', value: startup.scores.market, color: 'text-[#8b9bd7]' },
                  { icon: Package, label: 'Product', value: startup.scores.product, color: 'text-pink-400' },
                  { icon: Shield, label: 'Risk', value: startup.scores.risk, color: 'text-orange-400' },
                ].map((score) => (
                  <div key={score.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <score.icon className={`w-5 h-5 ${score.color}`} />
                        <span className="text-white">{score.label}</span>
                      </div>
                      <span className={`${getScoreColor(score.value)}`}>
                        {score.value}%
                      </span>
                    </div>
                    <Progress value={score.value} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Summary & Insights Tabs */}
            <Card className="bg-white/5 border-white/10 p-6">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="bg-white/5 border-white/10 mb-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="redflags">Red Flags</TabsTrigger>
                  <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                  <TabsTrigger value="founder">Founder Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                  <div>
                    <h4 className="text-white mb-2">AI Summary</h4>
                    <p className="text-gray-300">{startup.summary}</p>
                  </div>
                </TabsContent>

                <TabsContent value="redflags" className="space-y-3">
                  {startup.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm">{flag}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="opportunities" className="space-y-3">
                  {startup.opportunities.map((opp, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                    >
                      <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm">{opp}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="founder" className="space-y-4">
                  <div>
                    <h4 className="text-white mb-1">{startup.founderInfo.name}</h4>
                    <p className="text-gray-400 text-sm mb-3">{startup.founderInfo.education}</p>
                    <p className="text-gray-300 text-sm mb-4">{startup.founderInfo.experience}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Network Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={startup.founderInfo.networkScore} className="h-2" />
                          <span className="text-white text-sm">
                            {startup.founderInfo.networkScore}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Sentiment Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={startup.founderInfo.sentimentScore} className="h-2" />
                          <span className="text-white text-sm">
                            {startup.founderInfo.sentimentScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - KPIs & Metrics */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl text-white">Key Metrics</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Burn Rate', value: startup.kpis.burnRate },
                  { label: 'Runway', value: startup.kpis.runway },
                  { label: 'CAC', value: startup.kpis.cac },
                  { label: 'LTV', value: startup.kpis.ltv },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <span className="text-gray-400">{kpi.label}</span>
                    <span className="text-white">{kpi.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => onNavigate('reports')}
                  className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Full Report
                </Button>
                <Button 
                  onClick={() => {
                    const el = document.getElementById('valuation-simulator');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Run Scenario Analysis
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Valuation & Runway Simulator Section */}
        <div id="valuation-simulator" className="mt-8 pt-4">
          <ValuationSimulator startupName={startup.name} initialKpis={startup.kpis} />
        </div>
      </div>
    </div>
  );
}
