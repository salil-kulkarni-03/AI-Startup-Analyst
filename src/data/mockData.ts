import { Startup } from '../types';

export const mockStartups: Startup[] = [
  {
    id: '1',
    name: 'HealthAI Pro',
    category: 'HealthTech',
    uploadDate: '2025-10-08',
    status: 'analyzed',
    summary: 'AI-powered diagnostic platform that helps doctors identify rare diseases 40% faster using computer vision and medical records analysis. Currently serving 150+ hospitals across 5 countries.',
    scores: {
      team: 85,
      market: 78,
      product: 82,
      risk: 65,
    },
    kpis: {
      burnRate: '$180K/month',
      runway: '18 months',
      cac: '$450',
      ltv: '$12,500',
    },
    redFlags: [
      'High customer acquisition cost relative to early revenue',
      'Regulatory approval pending in 2 key markets',
    ],
    opportunities: [
      'Strong team with 3 successful exits',
      'Growing market ($50B TAM)',
      'Product-market fit validated',
    ],
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
    category: 'FinTech',
    uploadDate: '2025-10-07',
    status: 'analyzed',
    summary: 'B2B payment automation platform for SMBs. Integrates with 50+ accounting tools to streamline invoicing, payments, and reconciliation. 2,500+ active customers with 25% MoM growth.',
    scores: {
      team: 72,
      market: 88,
      product: 80,
      risk: 58,
    },
    kpis: {
      burnRate: '$220K/month',
      runway: '14 months',
      cac: '$280',
      ltv: '$8,400',
    },
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
    category: 'CleanTech',
    uploadDate: '2025-10-05',
    status: 'analyzed',
    summary: 'Supply chain sustainability tracking using blockchain and IoT sensors. Helps enterprises measure and reduce carbon footprint. Pilot programs with 3 Fortune 500 companies.',
    scores: {
      team: 68,
      market: 85,
      product: 70,
      risk: 72,
    },
    kpis: {
      burnRate: '$150K/month',
      runway: '12 months',
      cac: '$3,200',
      ltv: '$48,000',
    },
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
    founderInfo: {
      name: 'James Liu',
      experience: 'Sustainability consultant, 6 years experience',
      education: 'MS Environmental Engineering - UC Berkeley',
      networkScore: 64,
      sentimentScore: 82,
    },
  },
];
