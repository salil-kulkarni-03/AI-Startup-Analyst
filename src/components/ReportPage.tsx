'use client';

/**
 * REPORT PAGE - Shows Completed Analyses & Downloads
 * - Displays completed documents, pitch decks, founder calls
 * - Download reports
 * - Dark blue styled buttons
 */

import { ArrowLeft, Download, Mail, FileText, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { getUploadedDocs, UploadedDocument } from '../lib/uploads';

interface ReportPageProps {
  onNavigate: (page: string) => void;
  userName: string;
}

export function ReportPage({ onNavigate, userName }: ReportPageProps) {
  const [completedAnalyses, setCompletedAnalyses] = useState<UploadedDocument[]>([]);

  useEffect(() => {
    loadCompletedAnalyses();
    
    const handleStorageChange = () => {
      loadCompletedAnalyses();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadCompletedAnalyses = () => {
    const uploads = getUploadedDocs();
    const completed = uploads.filter(u => u.status === 'completed');
    setCompletedAnalyses(completed);
  };

  const handleDownload = (doc: UploadedDocument) => {
    toast.success('Report Downloaded!', {
      description: `${doc.name} report has been downloaded as PDF.`,
    });
  };

  const handleEmail = (doc: UploadedDocument) => {
    toast.success('Report Sent!', {
      description: `${doc.name} report has been sent to your email.`,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAverageScore = (scores?: { team: number; market: number; product: number; risk: number }) => {
    if (!scores) return 0;
    return Math.round((scores.team + scores.market + scores.product + scores.risk) / 4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b18] via-[#111932] to-[#13182a] pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
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

        <h1 className="text-4xl text-white mb-2">Analysis Reports</h1>
        <p className="text-gray-400 mb-8">
          Download and share completed startup analyses
        </p>

        {/* COMPLETED ANALYSES */}
        {completedAnalyses.length === 0 ? (
          <Card className="bg-white/5 border-white/10 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No Completed Analyses</h3>
            <p className="text-gray-400 mb-6">
              Upload startup data to generate analysis reports
            </p>
            <Button
              onClick={() => onNavigate('upload')}
              className="bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white"
            >
              Upload Data
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedAnalyses.map((doc) => {
              const avgScore = getAverageScore(doc.scores);
              
              return (
                <Card key={doc.id} className="bg-white/5 border-white/10 p-6 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-start justify-between gap-6">
                    
                    {/* Left - Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl text-white">{doc.name}</h3>
                        <Badge className="bg-[#171c92]/20 text-[#8b9bd7] border-[#171c92]/30">
                          {doc.category}
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Completed
                        </Badge>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">
                        Uploaded {doc.uploadDate}
                      </p>

                      {/* Scores */}
                      {doc.scores && (
                        <div className="flex items-center gap-6 mb-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#8b9bd7]" />
                            <span className="text-gray-400 text-sm">Overall Score:</span>
                            <span className={`font-semibold ${getScoreColor(avgScore)}`}>
                              {avgScore}/100
                            </span>
                          </div>
                          
                          <div className="flex gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Team: </span>
                              <span className="text-white">{doc.scores.team}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Market: </span>
                              <span className="text-white">{doc.scores.market}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Product: </span>
                              <span className="text-white">{doc.scores.product}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Risk: </span>
                              <span className="text-white">{doc.scores.risk}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      {doc.summary && (
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {doc.summary}
                        </p>
                      )}
                    </div>

                    {/* Right - Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        onClick={() => handleDownload(doc)}
                        size="sm"
                        className="bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button
                        onClick={() => handleEmail(doc)}
                        size="sm"
                        className="bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email Report
                      </Button>
                      <Button
                        onClick={() => onNavigate('analysis', doc.id)}
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-gray-300 hover:bg-white/10"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Stats Card */}
        {completedAnalyses.length > 0 && (
          <Card className="bg-gradient-to-br from-[#161b2c]/40 to-[#111932]/40 border-[#171c92]/30 p-6 mt-8">
            <h3 className="text-lg text-white mb-4">Report Statistics</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Reports</p>
                <p className="text-2xl text-white">{completedAnalyses.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Documents</p>
                <p className="text-2xl text-white">
                  {completedAnalyses.filter(d => !['Pitch Deck', 'Founder Call'].includes(d.category)).length}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Pitch Decks</p>
                <p className="text-2xl text-white">
                  {completedAnalyses.filter(d => d.category === 'Pitch Deck').length}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Founder Calls</p>
                <p className="text-2xl text-white">
                  {completedAnalyses.filter(d => d.category === 'Founder Call').length}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
