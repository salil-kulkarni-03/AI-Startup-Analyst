'use client';

/**
 * ===========================================
 * STARTUP CARD - Reusable Card Component
 * ===========================================
 * 
 * Displays startup information in a card format
 * Used in Dashboard grid
 */

import { TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface Startup {
  id: string;
  name: string;
  category: string;
  uploadDate: string;
  scores: {
    team: number;
    market: number;
    product: number;
    risk: number;
  };
  redFlags: string[];
  kpis: Array<{ label: string; value: string }>;
}

interface StartupCardProps {
  startup: Startup;
  onClick: () => void;
}

export function StartupCard({ startup, onClick }: StartupCardProps) {
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
    <Card
      onClick={onClick}
      className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl text-white mb-2">{startup.name}</h3>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 border">
            {startup.category}
          </Badge>
        </div>
        <div className={`text-3xl ${getScoreColor(avgScore)}`}>
          {avgScore.toFixed(0)}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {['Team', 'Market', 'Product', 'Risk'].map((label, idx) => {
          const scoreKey = label.toLowerCase() as keyof typeof startup.scores;
          const score = startup.scores[scoreKey];
          return (
            <div key={idx}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">{label}</span>
                <span className={getScoreColor(score)}>{score}</span>
              </div>
              <Progress value={score} className="h-1" />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{startup.uploadDate}</span>
        </div>
        {startup.redFlags.length > 0 && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>{startup.redFlags.length}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
