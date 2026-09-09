import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2, Zap, BarChart2, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { getUploadedDocs, getUploadById, UploadedDocument } from '../lib/uploads';

interface ChatbotWidgetProps {
  selectedStartupId?: string;
}

export function ChatbotWidget({ selectedStartupId }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [activeStartupId, setActiveStartupId] = useState<string>(selectedStartupId || '1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your Cereva RAG Analyst Assistant. Ask me anything about your uploaded pitch decks, financials, or founder credentials!",
    },
  ]);

  // Sync uploaded docs & active startup context
  useEffect(() => {
    const docs = getUploadedDocs();
    setUploadedDocs(docs);
    if (selectedStartupId && docs.some(d => d.id === selectedStartupId)) {
      setActiveStartupId(selectedStartupId);
    } else if (docs.length > 0 && !activeStartupId) {
      setActiveStartupId(docs[0].id);
    }
  }, [selectedStartupId]);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const activeStartup = uploadedDocs.find(d => d.id === activeStartupId) || getUploadById(activeStartupId) || uploadedDocs[0];

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || message;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, content: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customQuery) setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          startupContext: activeStartup,
          history: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI reply');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      console.error('Error querying chat API:', err);
      // Fallback context-aware message if network/server unavailable
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Analysis for **${activeStartup?.name || 'Startup'}**: ${activeStartup?.summary || 'No detailed data available.'} Key metrics: Burn rate is ${activeStartup?.kpis?.burnRate || 'N/A'}, Runway is ${activeStartup?.kpis?.runway || 'N/A'}.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Red Flags', query: 'What are the main red flags and risks for this startup?', icon: Zap },
    { label: 'Runway & CAC', query: 'What is their monthly burn rate, cash runway, and CAC?', icon: BarChart2 },
    { label: 'Founder Background', query: 'Tell me about the founder background and sentiment score.', icon: GraduationCap },
  ];

  return (
    <>
      {/* Floating Chat Window */}
      {isOpen && (
        <div 
          style={{ backgroundColor: '#070b18' }}
          className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-[#070b18] border border-purple-500/40 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden text-white"
        >
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#111732] to-[#181d3d] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  Cereva RAG Assistant
                  <Badge className="bg-purple-900/60 text-purple-300 border-purple-500/40 text-[10px] py-0 px-1.5">
                    Llama 3.1
                  </Badge>
                </h4>
                {/* Scope selector */}
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <span>Scope:</span>
                  <select
                    value={activeStartupId}
                    onChange={(e) => setActiveStartupId(e.target.value)}
                    className="bg-purple-950/40 border border-purple-500/30 rounded px-1.5 py-0.5 text-purple-200 text-[11px] focus:outline-none"
                  >
                    {uploadedDocs.map(doc => (
                      <option key={doc.id} value={doc.id} className="bg-[#111732] text-white">
                        {doc.name} ({doc.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Pills Bar */}
          <div className="px-3 py-2 bg-white/[0.02] border-b border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt.query)}
                disabled={isLoading}
                className="whitespace-nowrap flex items-center gap-1 text-[11px] bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 px-2.5 py-1 rounded-full transition-all flex-shrink-0 disabled:opacity-50"
              >
                <prompt.icon className="w-3 h-3 text-purple-400" />
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div style={{ backgroundColor: '#070b18' }} className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-sm bg-[#070b18]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-purple-300" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-tr-none shadow-md'
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-blue-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/30 w-max">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                Querying pitch deck RAG context...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-white/10 bg-[#080b16]">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask about ${activeStartup?.name || 'startup'}...`}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-xs h-9"
              />
              <Button
                onClick={() => handleSend()}
                disabled={isLoading || !message.trim()}
                size="icon"
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white h-9 w-9 flex-shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-2xl flex items-center justify-center transition-all hover:scale-110 border border-purple-400/40 z-50 group"
      >
        <MessageCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#070b18] animate-pulse" />
      </button>
    </>
  );
}
