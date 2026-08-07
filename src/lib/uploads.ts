/**
 * UPLOAD MANAGEMENT SYSTEM
 * Manages uploaded documents and their analysis status
 */

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  status: 'uploading' | 'analyzing' | 'completed' | 'failed';
  category: string;
  scores?: {
    team: number;
    market: number;
    product: number;
    risk: number;
  };
  summary?: string;
  redFlags?: string[];
  opportunities?: string[];
  kpis?: {
    burnRate: string;
    runway: string;
    cac: string;
    ltv: string;
  };
  founderInfo?: {
    name: string;
    experience: string;
    education: string;
    networkScore: number;
    sentimentScore: number;
  };
}

// Default example startups
const defaultExamples: UploadedDocument[] = [
  {
    id: '1',
    name: 'HealthAI Pro',
    size: 2500000,
    uploadDate: '2025-10-08',
    status: 'completed',
    category: 'Healthcare',
    scores: {
      team: 85,
      market: 78,
      product: 82,
      risk: 65,
    },
    summary: 'AI-powered diagnostic platform that helps doctors identify rare diseases 40% faster using computer vision and medical records analysis. Currently serving 150+ hospitals across 5 countries.',
    redFlags: [
      'High customer acquisition cost relative to early revenue',
      'Regulatory approval pending in 2 key markets',
    ],
    opportunities: [
      'Strong team with 3 successful exits',
      'Growing market ($50B TAM)',
      'Product-market fit validated',
    ],
    kpis: {
      burnRate: '$180K/month',
      runway: '18 months',
      cac: '$450',
      ltv: '$12,500',
    },
    founderInfo: {
      name: 'Dr. Sarah Chen',
      experience: 'Former VP Engineering at MedTech Corp, 15 years in healthcare AI',
      education: 'PhD Computer Science - Stanford, MD - Harvard Medical',
      networkScore: 92,
      sentimentScore: 88,
    },
  },
  {
    id: '2',
    name: 'FinFlow',
    size: 1800000,
    uploadDate: '2025-10-07',
    status: 'completed',
    category: 'Fintech',
    scores: {
      team: 72,
      market: 88,
      product: 80,
      risk: 58,
    },
    summary: 'B2B payment automation platform for SMBs. Integrates with 50+ accounting tools to streamline invoicing, payments, and reconciliation. 2,500+ active customers with 25% MoM growth.',
    redFlags: [
      'Intense competition from established players',
      'Churn rate slightly above industry average (5.2%)',
      'Team lacks enterprise sales experience',
    ],
    opportunities: [
      'Massive addressable market ($120B)',
      'Strong unit economics',
      'Strategic partnerships with major banks',
    ],
    kpis: {
      burnRate: '$220K/month',
      runway: '14 months',
      cac: '$280',
      ltv: '$8,400',
    },
    founderInfo: {
      name: 'Michael Rodriguez',
      experience: 'Ex-Product Manager at Stripe, 8 years in fintech',
      education: 'MBA - Wharton, BS Economics - MIT',
      networkScore: 78,
      sentimentScore: 75,
    },
  },
  {
    id: '3',
    name: 'EcoChain',
    size: 3200000,
    uploadDate: '2025-10-05',
    status: 'completed',
    category: 'SaaS',
    scores: {
      team: 68,
      market: 85,
      product: 70,
      risk: 72,
    },
    summary: 'Supply chain sustainability tracking using blockchain and IoT sensors. Helps enterprises measure and reduce carbon footprint. Pilot programs with 3 Fortune 500 companies.',
    redFlags: [
      'Long sales cycles (9-12 months)',
      'Technology still in beta phase',
      'Limited traction with only 3 pilot customers',
    ],
    opportunities: [
      'ESG regulations driving demand',
      'First-mover advantage in niche',
      'Strong IP portfolio (3 patents pending)',
    ],
    kpis: {
      burnRate: '$150K/month',
      runway: '12 months',
      cac: '$3,200',
      ltv: '$48,000',
    },
    founderInfo: {
      name: 'James Liu',
      experience: 'Sustainability consultant, 6 years experience',
      education: 'MS Environmental Engineering - UC Berkeley',
      networkScore: 64,
      sentimentScore: 82,
    },
  },
];

// Get all uploaded documents
export const getUploadedDocs = (): UploadedDocument[] => {
  if (typeof window === 'undefined') return defaultExamples;
  const docs = localStorage.getItem('infinity_uploads');
  
  // If no uploads yet, initialize with default examples
  if (!docs) {
    localStorage.setItem('infinity_uploads', JSON.stringify(defaultExamples));
    return defaultExamples;
  }
  
  return JSON.parse(docs);
};

// Save documents
export const saveDocs = (docs: UploadedDocument[]) => {
  localStorage.setItem('infinity_uploads', JSON.stringify(docs));
};

// Add new upload
export const addUpload = (file: File, category: string = 'SaaS'): UploadedDocument => {
  const docs = getUploadedDocs();
  
  const newDoc: UploadedDocument = {
    id: Date.now().toString(),
    name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
    size: file.size,
    uploadDate: new Date().toLocaleDateString(),
    status: 'analyzing',
    category: category,
  };

  docs.unshift(newDoc); // Add to beginning
  saveDocs(docs);

  // Simulate analysis completion after 3 seconds
  setTimeout(() => {
    completeAnalysis(newDoc.id);
  }, 3000);

  return newDoc;
};

// Complete analysis (add mock scores)
const completeAnalysis = (id: string) => {
  const docs = getUploadedDocs();
  const docIndex = docs.findIndex(d => d.id === id);
  
  if (docIndex === -1) return;

  const teamScore = Math.floor(Math.random() * 30) + 70;
  const marketScore = Math.floor(Math.random() * 30) + 70;
  const productScore = Math.floor(Math.random() * 30) + 70;
  const riskScore = Math.floor(Math.random() * 30) + 70;

  docs[docIndex] = {
    ...docs[docIndex],
    status: 'completed',
    scores: {
      team: teamScore,
      market: marketScore,
      product: productScore,
      risk: riskScore,
    },
    summary: 'AI-powered startup showing strong market potential with experienced team. The analysis indicates promising growth trajectory with solid fundamentals.',
    redFlags: [
      'Limited runway - requires additional funding within 12 months',
      'Competitive market with several established players',
      'Customer acquisition costs trending upward',
    ],
    opportunities: [
      'Large addressable market with strong growth potential',
      'Experienced founding team with relevant industry background',
      'Strong early traction with key customers',
    ],
    kpis: {
      burnRate: `${Math.floor(Math.random() * 200 + 100)}K/month`,
      runway: `${Math.floor(Math.random() * 12 + 6)} months`,
      cac: `${Math.floor(Math.random() * 1000 + 200)}`,
      ltv: `${Math.floor(Math.random() * 20000 + 5000)}`,
    },
    founderInfo: {
      name: 'Founder Name',
      experience: 'Industry experience with relevant background',
      education: 'Advanced degree from reputable institution',
      networkScore: Math.floor(Math.random() * 30 + 60),
      sentimentScore: Math.floor(Math.random() * 30 + 60),
    },
  };

  saveDocs(docs);
  
  // Trigger storage event for other components to update
  window.dispatchEvent(new Event('storage'));
};

// Delete upload
export const deleteUpload = (id: string) => {
  const docs = getUploadedDocs();
  saveDocs(docs.filter(d => d.id !== id));
};

// Get upload by ID
export const getUploadById = (id: string): UploadedDocument | null => {
  const docs = getUploadedDocs();
  return docs.find(d => d.id === id) || null;
};

// Reset to default examples (useful for demo/testing)
export const resetToDefaults = () => {
  localStorage.setItem('infinity_uploads', JSON.stringify(defaultExamples));
  window.dispatchEvent(new Event('storage'));
};
