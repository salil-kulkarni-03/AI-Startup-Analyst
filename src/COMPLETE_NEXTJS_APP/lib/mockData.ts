/**
 * ===========================================
 * MOCK DATA - Sample Startup Data
 * ===========================================
 * 
 * This is dummy data for demonstration.
 * 
 * TODO FOR BACKEND DEVELOPERS:
 * Replace this entire file with real API calls to your database.
 * 
 * Example:
 * export async function getStartups() {
 *   const { data } = await supabase.from('startups').select('*');
 *   return data;
 * }
 */

export const mockStartups = [
  {
    id: '1',
    name: 'TechFlow AI',
    category: 'SaaS',
    uploadDate: '2025-01-05',
    scores: {
      team: 85,
      market: 78,
      product: 92,
      risk: 75,
    },
    redFlags: [
      'Limited runway (6 months)',
      'No clear monetization strategy',
    ],
    kpis: [
      { label: 'Monthly Recurring Revenue', value: '$45,000' },
      { label: 'Customer Acquisition Cost', value: '$250' },
      { label: 'Burn Rate', value: '$30,000/month' },
      { label: 'Customer Count', value: '180' },
    ],
  },
  {
    id: '2',
    name: 'HealthHub',
    category: 'Healthcare',
    uploadDate: '2025-01-03',
    scores: {
      team: 72,
      market: 88,
      product: 65,
      risk: 68,
    },
    redFlags: [
      'Regulatory compliance unclear',
      'Strong competition from established players',
      'Founders have limited healthcare experience',
    ],
    kpis: [
      { label: 'Monthly Recurring Revenue', value: '$28,000' },
      { label: 'Customer Acquisition Cost', value: '$180' },
      { label: 'Burn Rate', value: '$25,000/month' },
      { label: 'Customer Count', value: '120' },
    ],
  },
  {
    id: '3',
    name: 'FinanceIQ',
    category: 'Fintech',
    uploadDate: '2024-12-28',
    scores: {
      team: 90,
      market: 82,
      product: 88,
      risk: 85,
    },
    redFlags: [
      'Banking partnerships not yet secured',
    ],
    kpis: [
      { label: 'Monthly Recurring Revenue', value: '$65,000' },
      { label: 'Customer Acquisition Cost', value: '$120' },
      { label: 'Burn Rate', value: '$40,000/month' },
      { label: 'Customer Count', value: '450' },
    ],
  },
  {
    id: '4',
    name: 'EduLearn Pro',
    category: 'EdTech',
    uploadDate: '2024-12-20',
    scores: {
      team: 68,
      market: 75,
      product: 70,
      risk: 62,
    },
    redFlags: [
      'Market is highly saturated',
      'Low customer retention rate',
      'Unclear differentiation from competitors',
    ],
    kpis: [
      { label: 'Monthly Recurring Revenue', value: '$18,000' },
      { label: 'Customer Acquisition Cost', value: '$95' },
      { label: 'Burn Rate', value: '$22,000/month' },
      { label: 'Customer Count', value: '200' },
    ],
  },
  {
    id: '5',
    name: 'CloudSync',
    category: 'SaaS',
    uploadDate: '2024-12-15',
    scores: {
      team: 80,
      market: 85,
      product: 78,
      risk: 80,
    },
    redFlags: [
      'Dependency on single cloud provider',
    ],
    kpis: [
      { label: 'Monthly Recurring Revenue', value: '$52,000' },
      { label: 'Customer Acquisition Cost', value: '$200' },
      { label: 'Burn Rate', value: '$35,000/month' },
      { label: 'Customer Count', value: '320' },
    ],
  },
  {
    id: '6',
    name: 'GreenEnergy Co',
    category: 'CleanTech',
    uploadDate: '2024-12-10',
    scores: {
      team: 75,
      market: 90,
      product: 68,
      risk: 70,
    },
    redFlags: [
      'High capital requirements',
      'Long sales cycles',
    ],
    kpis: [
      { label: 'Monthly Recurring Revenue', value: '$35,000' },
      { label: 'Customer Acquisition Cost', value: '$500' },
      { label: 'Burn Rate', value: '$45,000/month' },
      { label: 'Customer Count', value: '70' },
    ],
  },
];
