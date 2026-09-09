'use client';

/**
 * UPLOAD PAGE - Multiple Upload Options
 * - Upload Documents
 * - Upload Pitch Decks
 * - Upload Founder Call Recordings or Schedule Call
 */

import { ArrowLeft, Upload, FileText, X, Mic, Phone, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { addUpload, getUploadedDocs, saveDocs, UploadedDocument } from '../lib/uploads';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { LiveAnalysisTerminal, TerminalLog } from './LiveAnalysisTerminal';

interface UploadPageProps {
  onNavigate: (page: string) => void;
  userName: string;
}

export function UploadPage({ onNavigate, userName }: UploadPageProps) {
  const [uploadType, setUploadType] = useState<'document' | 'pitch' | 'call'>('document');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [category, setCategory] = useState('SaaS');
  const [uploading, setUploading] = useState(false);
  const [recentUploads, setRecentUploads] = useState<UploadedDocument[]>([]);

  // Real-time Streaming State
  const [isStreaming, setIsStreaming] = useState(false);
  const [terminalProgress, setTerminalProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState('');

  // Load recent uploads
  useEffect(() => {
    loadRecentUploads();
    
    const handleStorageChange = () => {
      loadRecentUploads();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadRecentUploads = () => {
    const uploads = getUploadedDocs();
    setRecentUploads(uploads.slice(0, 5));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (files.length === 0 && uploadType !== 'call') {
      toast.error('Please upload at least one file');
      return;
    }

    if (uploadType === 'call' && files.length === 0) {
      toast.info('Schedule Call', {
        description: 'Calling feature coming soon! Upload a recording for now.',
      });
      return;
    }

    setUploading(true);
    setIsStreaming(true);
    setTerminalError(null);
    setTerminalLogs([]);

    const addLog = (msg: string, stage: number, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
      const now = new Date().toLocaleTimeString();
      setTerminalLogs(prev => [...prev, { timestamp: now, stage, message: msg, type }]);
    };

    try {
      for (const file of files) {
        setCurrentFileName(file.name);
        setTerminalProgress(10);
        setCurrentStage(1);
        addLog(`Initiating streaming analysis for ${file.name}...`, 1, 'info');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', uploadType === 'pitch' ? 'Pitch Deck' : uploadType === 'call' ? 'Founder Call' : category);

        const response = await fetch('/api/analyze-stream', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok || !response.body) {
          throw new Error(`Server connection failed with status ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || ''; // Keep incomplete trailing line in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const rawJson = trimmed.replace('data: ', '');
              try {
                const event = JSON.parse(rawJson);

                if (event.error) {
                  setTerminalError(event.error);
                  addLog(`ERROR: ${event.error}`, 0, 'error');
                  toast.error('Analysis Failed', { description: event.error });
                  setUploading(false);
                  return;
                }

                if (event.stage !== undefined) {
                  setCurrentStage(event.stage);
                }
                if (event.progress !== undefined) {
                  setTerminalProgress(event.progress);
                }

                if (event.message) {
                  const logType = event.step === 'complete' ? 'success' : 'info';
                  addLog(event.message, event.stage || 1, logType);
                }

                if (event.step === 'complete' && event.result) {
                  const docs = getUploadedDocs();
                  docs.unshift(event.result);
                  saveDocs(docs);
                  window.dispatchEvent(new Event('storage'));
                }
              } catch (parseErr) {
                console.warn('SSE Parse warning:', parseErr);
              }
            }
          }
        }
      }

      setTerminalProgress(100);
      setCurrentStage(4);
      addLog('Pipeline Execution Finalized! Saving results and navigating...', 4, 'success');

      toast.success(`${files.length} file(s) analyzed successfully!`, {
        description: 'AI evaluation stream complete. Loading dashboard...',
      });

      setFiles([]);

      setTimeout(() => {
        setIsStreaming(false);
        setUploading(false);
        onNavigate('dashboard');
      }, 1500);

    } catch (err: any) {
      console.error('Error during SSE streaming analysis:', err);
      setTerminalError(err.message || 'Streaming failed');
      addLog(`FATAL ERROR: ${err.message}`, 0, 'error');
      toast.error('AI Streaming Failed', {
        description: err.message || 'Failed to complete SSE analysis pipeline.',
      });
      setUploading(false);
    }
  };

  const uploadOptions = [
    {
      type: 'document' as const,
      icon: FileText,
      title: 'Upload Documents',
      description: 'Financials, business plans, market analysis',
      color: 'from-blue-500 to-blue-600',
    },
    {
      type: 'pitch' as const,
      icon: Upload,
      title: 'Upload Pitch Decks',
      description: 'Investor presentations, pitch slides',
      color: 'from-[#171c92] to-[#161b2c]',
    },
    {
      type: 'call' as const,
      icon: Mic,
      title: 'Founder Calls',
      description: 'Upload recordings or schedule a call',
      color: 'from-green-500 to-green-600',
    },
  ];

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

        <h1 className="text-4xl text-white mb-2">Upload Startup Data</h1>
        <p className="text-gray-400 mb-8">
          Choose what you want to upload for AI analysis
        </p>

        {/* UPLOAD TYPE SELECTOR */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {uploadOptions.map((option) => (
            <Card
              key={option.type}
              onClick={() => setUploadType(option.type)}
              className={`p-6 cursor-pointer transition-all border-2 ${
                uploadType === option.type
                  ? 'bg-white/10 border-[#171c92]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mb-4`}>
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg text-white mb-1">{option.title}</h3>
              <p className="text-sm text-gray-400">{option.description}</p>
              {uploadType === option.type && (
                <Badge className="mt-3 bg-[#171c92]/20 text-[#8b9bd7] border-[#171c92]/30">
                  Selected
                </Badge>
              )}
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* UPLOAD SECTION */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Category Selector - only for documents */}
            {uploadType === 'document' && (
              <Card className="bg-white/5 border-white/10 p-4">
                <Label className="text-gray-300 mb-2 block">Startup Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111932] border-white/10">
                    <SelectItem value="SaaS" className="text-white">SaaS</SelectItem>
                    <SelectItem value="Fintech" className="text-white">Fintech</SelectItem>
                    <SelectItem value="Healthcare" className="text-white">Healthcare</SelectItem>
                    <SelectItem value="E-commerce" className="text-white">E-commerce</SelectItem>
                  </SelectContent>
                </Select>
              </Card>
            )}

            {/* Upload Area */}
            <Card
              className={`bg-white/5 border-2 border-dashed p-12 text-center transition-colors ${
                isDragging ? 'border-[#171c92] bg-[#161b2c]/20' : 'border-white/20'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">
                {uploadType === 'pitch' 
                  ? 'Drop pitch deck here' 
                  : uploadType === 'call' 
                  ? 'Drop call recording here'
                  : 'Drop files here'}
              </h3>
              <p className="text-gray-400 mb-6">or click to browse</p>
              
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                accept={uploadType === 'call' ? '.mp3,.wav,.m4a,.mp4' : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'}
              />
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="bg-gradient-to-r from-[#171c92] to-[#13182a] hover:from-[#161b2c] hover:to-[#111932] text-white cursor-pointer"
                >
                  Choose Files
                </Button>
              </label>

              <p className="text-sm text-gray-500 mt-4">
                {uploadType === 'call' 
                  ? 'Supported: MP3, WAV, M4A, MP4 (Max 100MB each)' 
                  : 'Supported: PDF, DOC, XLS, PPT, TXT (Max 50MB each)'}
              </p>
            </Card>

            {/* Schedule Call Option - for call type */}
            {uploadType === 'call' && (
              <Card className="bg-gradient-to-br from-green-900/40 to-green-950/40 border-green-700/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-white mb-2">Schedule Live Call</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Or schedule a live call with the founder for AI real-time analysis
                    </p>
                    <Button
                      variant="outline"
                      className="border-green-500/50 text-green-300 hover:bg-green-900/20"
                      onClick={() => toast.info('Coming Soon', { description: 'Live call scheduling feature is under development.' })}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Schedule Call (Coming Soon)
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Selected Files */}
            {files.length > 0 && (
              <Card className="bg-white/5 border-white/10 p-6">
                <h3 className="text-lg text-white mb-4">Selected Files ({files.length})</h3>
                <div className="space-y-3">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#8b9bd7]" />
                        <div>
                          <p className="text-white text-sm">{file.name}</p>
                          <p className="text-gray-400 text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(idx)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={uploading}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold shadow-lg shadow-purple-950/50"
                >
                  {uploading ? 'Streaming AI Pipeline...' : 'Start AI Analysis'}
                </Button>
              </Card>
            )}

            {/* LIVE SSE STREAMING TERMINAL CONSOLE */}
            {isStreaming && (
              <div className="mt-6">
                <LiveAnalysisTerminal
                  fileName={currentFileName || 'document.pdf'}
                  progress={terminalProgress}
                  currentStage={currentStage}
                  logs={terminalLogs}
                  error={terminalError}
                />
              </div>
            )}
          </div>

          {/* RECENT UPLOADS SIDEBAR */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-lg text-white mb-4">Recent Uploads</h3>
              {recentUploads.length === 0 ? (
                <p className="text-gray-400 text-sm">No uploads yet</p>
              ) : (
                <div className="space-y-3">
                  {recentUploads.map((upload) => (
                    <button
                      key={upload.id}
                      onClick={() => onNavigate('dashboard')}
                      className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <p className="text-white text-sm mb-1 truncate">{upload.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            upload.status === 'completed' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30 text-xs' 
                              : upload.status === 'analyzing'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs'
                              : 'bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs'
                          }
                        >
                          {upload.status}
                        </Badge>
                        <span className="text-gray-500 text-xs">{upload.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Upload Tips */}
            <Card className="bg-gradient-to-br from-[#161b2c]/40 to-[#111932]/40 border-[#171c92]/30 p-6">
              <h3 className="text-lg text-white mb-3">Tips for Better Analysis</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#8b9bd7] mt-1">•</span>
                  <span>Include financial statements and projections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8b9bd7] mt-1">•</span>
                  <span>Upload complete pitch decks (10-20 slides)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8b9bd7] mt-1">•</span>
                  <span>Founder call recordings provide deeper insights</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
