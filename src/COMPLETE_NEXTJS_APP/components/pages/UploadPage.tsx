'use client';

/**
 * ===========================================
 * UPLOAD PAGE - File Upload Interface
 * ===========================================
 * 
 * Features:
 * - Drag & drop file upload
 * - Multiple file types supported
 * - Back arrow navigation
 * - Purple buttons
 * 
 * TODO: Add file upload logic
 * - Connect to cloud storage (S3, Supabase Storage)
 * - Trigger AI analysis after upload
 * - Show upload progress
 */

import { ArrowLeft, Upload, FileText, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useState } from 'react';
import { toast } from 'sonner';

interface UploadPageProps {
  onNavigate: (page: string) => void;
}

export function UploadPage({ onNavigate }: UploadPageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleAnalyze = () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    // TODO: Upload files to server and trigger AI analysis
    // Example: await uploadFiles(files); await analyzeStartup(files);
    toast.success('Analysis started!', {
      description: 'Your files are being processed.',
    });
    
    setTimeout(() => {
      onNavigate('analysis');
    }, 1500);
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

        {/* Header */}
        <h1 className="text-4xl text-white mb-2">Upload Startup Data</h1>
        <p className="text-gray-400 mb-8">
          Upload pitch decks, financials, or any documents for AI analysis
        </p>

        {/* Upload Area */}
        <Card
          className={`bg-white/5 border-2 border-dashed p-12 text-center transition-colors ${
            isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-white/20'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Drop files here</h3>
          <p className="text-gray-400 mb-6">or click to browse</p>
          
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          />
          <label htmlFor="file-upload">
            <Button
              as="span"
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white cursor-pointer"
            >
              Choose Files
            </Button>
          </label>

          <p className="text-sm text-gray-500 mt-4">
            Supported: PDF, DOC, XLS, PPT, TXT (Max 50MB each)
          </p>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card className="bg-white/5 border-white/10 p-6 mt-6">
            <h3 className="text-lg text-white mb-4">Selected Files ({files.length})</h3>
            <div className="space-y-3">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-400" />
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
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
            >
              Start AI Analysis
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
