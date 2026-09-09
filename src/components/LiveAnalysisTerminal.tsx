import React, { useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Terminal, CheckCircle2, Loader2, Clock, AlertTriangle, Cpu, Sparkles } from 'lucide-react';

export interface TerminalLog {
  timestamp: string;
  stage: number;
  message: string;
  type?: 'info' | 'success' | 'warn' | 'error';
}

interface LiveAnalysisTerminalProps {
  fileName: string;
  progress: number;
  currentStage: number; // 1 to 4
  logs: TerminalLog[];
  error?: string | null;
}

export function LiveAnalysisTerminal({
  fileName,
  progress,
  currentStage,
  logs,
  error,
}: LiveAnalysisTerminalProps) {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll log window to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const stages = [
    { id: 1, label: 'Text & Speech Extraction', sub: 'PDF Parse / Groq Whisper' },
    { id: 2, label: 'Llama 3.1 Context Initializer', sub: 'Groq 8B Instant Pipeline' },
    { id: 3, label: 'Real-Time Token Stream', sub: 'SWOT & Financial Parsing' },
    { id: 4, label: 'KPI & Score Synthesis', sub: 'Investment Memo Finalized' },
  ];

  return (
    <Card className="bg-[#0b0f19] border-purple-500/30 p-6 rounded-2xl shadow-2xl overflow-hidden relative border">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Top Window Bar */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-xs text-gray-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            cereva-ai-stream-engine // {fileName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {error ? (
            <Badge className="bg-red-950/80 text-red-300 border-red-500/40 border font-mono text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              FAILED
            </Badge>
          ) : progress >= 100 ? (
            <Badge className="bg-emerald-950/80 text-emerald-300 border-emerald-500/40 border font-mono text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              COMPLETE
            </Badge>
          ) : (
            <Badge className="bg-purple-950/80 text-purple-300 border-purple-500/40 border font-mono text-xs animate-pulse">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              STREAMING ({progress}%)
            </Badge>
          )}
        </div>
      </div>

      {/* Stage Stepper Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stages.map((stage) => {
          const isDone = currentStage > stage.id || progress >= 100;
          const isCurrent = currentStage === stage.id && progress < 100 && !error;

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : isCurrent
                  ? 'bg-purple-950/50 border-purple-500/60 text-purple-200 shadow-lg shadow-purple-950/50'
                  : 'bg-white/[0.02] border-white/10 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                )}
                <span className="font-semibold text-xs truncate">
                  0{stage.id}. {stage.label}
                </span>
              </div>
              <p className="text-[10px] opacity-75 truncate">{stage.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Animated Overall Progress Bar */}
      <div className="mb-6 space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-gray-400 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            Groq Llama 3.1 Inference Pipeline
          </span>
          <span className="text-purple-300 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-white/10 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Terminal Log Output Window */}
      <div
        ref={logContainerRef}
        className="bg-[#05070e] border border-white/10 rounded-xl p-4 font-mono text-xs h-56 overflow-y-auto space-y-2 text-gray-300 scrollbar-thin scrollbar-thumb-purple-900/50"
      >
        <div className="text-purple-400/70 border-b border-white/5 pb-2 mb-2 flex items-center justify-between text-[11px]">
          <span>[SYSTEM LOG OUTPUT]</span>
          <span>SSE PROTOCOL: ACTIVE</span>
        </div>

        {logs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-2 leading-relaxed">
            <span className="text-gray-500 select-none">[{log.timestamp}]</span>
            <span
              className={
                log.type === 'error'
                  ? 'text-red-400 font-bold'
                  : log.type === 'success'
                  ? 'text-emerald-400'
                  : log.type === 'warn'
                  ? 'text-amber-400'
                  : 'text-gray-300'
              }
            >
              {log.message}
            </span>
          </div>
        ))}

        {error && (
          <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded text-red-300 font-sans text-xs mt-2">
            ⚠️ <strong>Analysis Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Powered by Groq High-Performance Llama 3.1 & Whisper API
        </span>
        <span className="font-mono text-[11px] text-purple-300">0ms Latency Stream</span>
      </div>
    </Card>
  );
}
