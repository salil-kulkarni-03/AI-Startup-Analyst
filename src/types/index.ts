export interface Startup {
  id: string;
  name: string;
  category: string;
  uploadDate: string;
  status: 'analyzed' | 'processing' | 'pending';
  summary: string;
  scores: {
    team: number;
    market: number;
    product: number;
    risk: number;
  };
  kpis: {
    burnRate: string;
    runway: string;
    cac: string;
    ltv: string;
  };
  redFlags: string[];
  opportunities: string[];
  founderInfo: {
    name: string;
    experience: string;
    education: string;
    networkScore: number;
    sentimentScore: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'admin';
}
