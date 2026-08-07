import { TrendingUp, TrendingDown, AlertTriangle, Eye } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Startup } from '../types';

interface StartupCardProps {
  startup: Startup;
  onView: (id: string) => void;
}

export function StartupCard({ startup, onView }: StartupCardProps) {
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      HealthTech: 'bg-green-500/20 text-green-300 border-green-500/30',
      FinTech: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      CleanTech: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      SaaS: 'bg-[#171c92]/20 text-[#8b9bd7] border-[#171c92]/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <Card className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl text-white">{startup.name}</h3>
            <Badge className={`${getCategoryColor(startup.category)} border`}>
              {startup.category}
            </Badge>
          </div>
          <p className="text-sm text-gray-400">{startup.uploadDate}</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl ${getScoreColor(avgScore)}`}>
            {avgScore.toFixed(0)}
          </div>
          <p className="text-xs text-gray-400">Overall Score</p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{startup.summary}</p>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Team', value: startup.scores.team },
          { label: 'Market', value: startup.scores.market },
          { label: 'Product', value: startup.scores.product },
          { label: 'Risk', value: startup.scores.risk },
        ].map((score) => (
          <div key={score.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{score.label}</span>
              <span className={`text-xs ${getScoreColor(score.value)}`}>
                {score.value}%
              </span>
            </div>
            <Progress value={score.value} className="h-1.5" />
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-white/5 rounded-lg">
        <div>
          <p className="text-xs text-gray-400">Burn Rate</p>
          <p className="text-sm text-white">{startup.kpis.burnRate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Runway</p>
          <p className="text-sm text-white">{startup.kpis.runway}</p>
        </div>
      </div>

      {/* Alerts */}
      <div className="flex items-center gap-2 mb-4">
        {startup.redFlags.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-red-400">
            <AlertTriangle className="w-3 h-3" />
            {startup.redFlags.length} Red Flags
          </div>
        )}
        {startup.opportunities.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-green-400">
            <TrendingUp className="w-3 h-3" />
            {startup.opportunities.length} Opportunities
          </div>
        )}
      </div>

      <Button
        onClick={() => onView(startup.id)}
        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
      >
        <Eye className="w-4 h-4 mr-2" />
        View Details
      </Button>
    </Card>
  );
}
