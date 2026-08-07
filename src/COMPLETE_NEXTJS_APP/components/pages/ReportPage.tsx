'use client';

/**
 * ===========================================
 * REPORT PAGE - Generate Analysis Reports
 * ===========================================
 * 
 * Features:
 * - Custom report generation
 * - Export options
 * - Back arrow navigation
 * - Purple buttons
 */

import { ArrowLeft, FileText, Download, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface ReportPageProps {
  onNavigate: (page: string) => void;
}

export function ReportPage({ onNavigate }: ReportPageProps) {
  const [sections, setSections] = useState({
    scores: true,
    redflags: true,
    kpis: true,
    founder: false,
    market: false,
  });

  const handleGenerate = () => {
    // TODO: Generate PDF report
    toast.success('Report generated successfully!', {
      description: 'Your report is ready to download.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b18] via-[#111932] to-[#13182a] pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* BACK BUTTON */}
        <Button
          onClick={() => onNavigate('dashboard')}
          variant="ghost"
          className="text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl text-white mb-2">Generate Report</h1>
        <p className="text-gray-400 mb-8">
          Customize and export your startup analysis report
        </p>

        <Card className="bg-white/5 border-white/10 p-8">
          <h3 className="text-xl text-white mb-6">Report Sections</h3>
          
          <div className="space-y-4 mb-8">
            {[
              { id: 'scores', label: 'Scoring Analysis' },
              { id: 'redflags', label: 'Red Flags' },
              { id: 'kpis', label: 'Key Performance Indicators' },
              { id: 'founder', label: 'Founder Background' },
              { id: 'market', label: 'Market Analysis' },
            ].map((section) => (
              <div key={section.id} className="flex items-center gap-3">
                <Checkbox
                  id={section.id}
                  checked={sections[section.id as keyof typeof sections]}
                  onCheckedChange={(checked) =>
                    setSections({ ...sections, [section.id]: checked })
                  }
                />
                <Label htmlFor={section.id} className="text-gray-300 cursor-pointer">
                  {section.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={handleGenerate}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              className="border-purple-600/50 text-purple-400 hover:bg-purple-900/20"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Report
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
