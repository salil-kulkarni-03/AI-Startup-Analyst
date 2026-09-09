import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Calculator,
  RotateCcw,
  TrendingUp,
  DollarSign,
  Clock,
  Zap,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ValuationSimulatorProps {
  startupName: string;
  initialKpis: {
    burnRate?: string;
    runway?: string;
    cac?: string;
    ltv?: string;
  };
}

// Helper to parse numeric values from KPI strings (e.g., "$150K/month" -> 150000)
function parseCurrency(str?: string, fallback = 150000): number {
  if (!str) return fallback;
  const cleaned = str.toUpperCase().replace(/[^0-9.KMB]/g, '');
  if (!cleaned) return fallback;
  if (cleaned.endsWith('B')) return parseFloat(cleaned) * 1_000_000_000;
  if (cleaned.endsWith('M')) return parseFloat(cleaned) * 1_000_000;
  if (cleaned.endsWith('K')) return parseFloat(cleaned) * 1_000;
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) || parsed === 0 ? fallback : parsed;
}

function parseMonths(str?: string, fallback = 18): number {
  if (!str) return fallback;
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : fallback;
}

export function ValuationSimulator({ startupName, initialKpis }: ValuationSimulatorProps) {
  // Parse baseline financial metrics from pitch deck KPIs
  const baseMonthlyBurn = useMemo(() => parseCurrency(initialKpis.burnRate, 150000), [initialKpis.burnRate]);
  const baseRunwayMonths = useMemo(() => parseMonths(initialKpis.runway, 18), [initialKpis.runway]);
  const baseCac = useMemo(() => parseCurrency(initialKpis.cac, 400), [initialKpis.cac]);

  const initialCashReserve = baseMonthlyBurn * baseRunwayMonths;
  const initialMonthlyRev = Math.round(baseMonthlyBurn * 0.35); // Initial baseline MRR (~35% of burn)

  // Simulator Sliders State
  const [growthRate, setGrowthRate] = useState<number>(12); // % monthly revenue growth
  const [burnAdj, setBurnAdj] = useState<number>(0); // % change in monthly burn
  const [cacAdj, setCacAdj] = useState<number>(0); // % change in CAC
  const [arrMultiple, setArrMultiple] = useState<number>(12); // ARR multiple (5x - 30x)

  const handleReset = () => {
    setGrowthRate(12);
    setBurnAdj(0);
    setCacAdj(0);
    setArrMultiple(12);
  };

  // Run financial modeling simulation over a 12-month horizon
  const simulationResults = useMemo(() => {
    const simMonthlyBurn = baseMonthlyBurn * (1 + burnAdj / 100);
    const simCac = Math.max(10, baseCac * (1 + cacAdj / 100));

    let currentCashBase = initialCashReserve;
    let currentCashSim = initialCashReserve;
    let currentMrrBase = initialMonthlyRev;
    let currentMrrSim = initialMonthlyRev;

    const chartData = [];
    let simZeroMonth: number | null = null;
    let baseZeroMonth: number | null = null;

    const months = ['Current', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];

    for (let i = 0; i <= 12; i++) {
      if (i > 0) {
        // Baseline model (5% monthly growth)
        currentMrrBase = currentMrrBase * 1.05;
        const netCashFlowBase = currentMrrBase - baseMonthlyBurn;
        currentCashBase = Math.max(0, currentCashBase + netCashFlowBase);

        // Simulated model (custom growthRate % monthly growth)
        currentMrrSim = currentMrrSim * (1 + growthRate / 100);
        const netCashFlowSim = currentMrrSim - simMonthlyBurn;
        currentCashSim = Math.max(0, currentCashSim + netCashFlowSim);
      }

      if (currentCashBase === 0 && baseZeroMonth === null && i > 0) {
        baseZeroMonth = i;
      }
      if (currentCashSim === 0 && simZeroMonth === null && i > 0) {
        simZeroMonth = i;
      }

      chartData.push({
        month: months[i],
        'Simulated Cash ($)': Math.round(currentCashSim),
        'Baseline Cash ($)': Math.round(currentCashBase),
        'Simulated MRR ($)': Math.round(currentMrrSim),
      });
    }

    const sim12mArr = currentMrrSim * 12;
    const base12mArr = currentMrrBase * 12;
    const multipleValuation = sim12mArr * arrMultiple;
    const baseValuation = base12mArr * arrMultiple;

    // Calculate extended runway
    let simRunway = 12;
    if (simZeroMonth !== null) {
      simRunway = simZeroMonth;
    } else {
      // Check if cash stays positive indefinitely (profitable)
      const finalNetBurn = simMonthlyBurn - currentMrrSim;
      if (finalNetBurn <= 0) {
        simRunway = 36; // Profitable / Infinite runway
      } else {
        simRunway = Math.round(currentCashSim / finalNetBurn) + 12;
      }
    }

    // Zero Cash Date string format
    const zeroDate = new Date();
    zeroDate.setMonth(zeroDate.getMonth() + (simRunway > 36 ? 36 : simRunway));
    const zeroDateStr = simRunway >= 36 ? 'Sustainable / Profitable' : zeroDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return {
      chartData,
      sim12mArr,
      base12mArr,
      multipleValuation,
      baseValuation,
      simRunway,
      zeroDateStr,
      simMonthlyBurn,
      simCac,
    };
  }, [baseMonthlyBurn, baseRunwayMonths, baseCac, initialCashReserve, initialMonthlyRev, growthRate, burnAdj, cacAdj, arrMultiple]);

  // Format monetary values
  const formatCurrency = (val: number) => {
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${Math.round(val)}`;
  };

  const valChangePercent = Math.round(
    ((simulationResults.multipleValuation - simulationResults.baseValuation) / simulationResults.baseValuation) * 100
  );

  return (
    <Card className="bg-gradient-to-br from-[#0d1326] via-[#111832] to-[#181d3d] border-purple-500/20 p-6 shadow-2xl rounded-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Valuation & Runway Simulator
            </h2>
            <Badge className="bg-purple-900/60 text-purple-300 border-purple-500/40 border">
              Interactive Scenario Engine
            </Badge>
          </div>
          <p className="text-gray-400 text-sm">
            Simulate "what-if" financial scenarios for <span className="text-purple-300 font-semibold">{startupName}</span> to project DCF valuation and cash runway.
          </p>
        </div>

        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-950/40 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Defaults
        </Button>
      </div>

      {/* Main Grid: Controls vs Metrics */}
      <div className="grid lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column: Interactive Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6 bg-white/[0.03] border border-white/10 p-5 rounded-xl">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            Scenario Input Parameters
          </h3>

          {/* Slider 1: Revenue Growth Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-gray-300 font-medium flex items-center gap-1.5">
                Monthly Revenue Growth Rate (%)
                <span className="text-xs text-gray-400 font-normal">(Base: 5%/mo)</span>
              </label>
              <span className="text-purple-400 font-bold bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-500/30">
                +{growthRate}% / month
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="40"
              step="1"
              value={growthRate}
              onChange={(e) => setGrowthRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
            />
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>-5% (Contraction)</span>
              <span>12% (Standard SaaS)</span>
              <span>40% (Hyper-growth)</span>
            </div>
          </div>

          {/* Slider 2: Burn Rate Adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-gray-300 font-medium flex items-center gap-1.5">
                Monthly Burn Rate Change (%)
                <span className="text-xs text-gray-400 font-normal">
                  (Base: {formatCurrency(baseMonthlyBurn)}/mo)
                </span>
              </label>
              <span className={`font-bold px-2.5 py-0.5 rounded border ${
                burnAdj > 0 
                  ? 'text-red-400 bg-red-950/60 border-red-500/30' 
                  : burnAdj < 0 
                  ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' 
                  : 'text-gray-300 bg-gray-800 border-gray-700'
              }`}>
                {burnAdj > 0 ? `+${burnAdj}%` : `${burnAdj}%`}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="60"
              step="5"
              value={burnAdj}
              onChange={(e) => setBurnAdj(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
            />
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>-40% (Cut Expenses)</span>
              <span>0% (Baseline)</span>
              <span>+60% (Scale Aggressively)</span>
            </div>
          </div>

          {/* Slider 3: CAC Optimization */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-gray-300 font-medium flex items-center gap-1.5">
                CAC Optimization Shift (%)
                <span className="text-xs text-gray-400 font-normal">
                  (Base: {formatCurrency(baseCac)})
                </span>
              </label>
              <span className={`font-bold px-2.5 py-0.5 rounded border ${
                cacAdj < 0 
                  ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' 
                  : cacAdj > 0 
                  ? 'text-amber-400 bg-amber-950/60 border-amber-500/30' 
                  : 'text-gray-300 bg-gray-800 border-gray-700'
              }`}>
                {cacAdj > 0 ? `+${cacAdj}% (Costly)` : `${cacAdj}% (Efficient)`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={cacAdj}
              onChange={(e) => setCacAdj(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
            />
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>-30% (Organic/Viral)</span>
              <span>0% (Baseline)</span>
              <span>+50% (Paid Ad Scale)</span>
            </div>
          </div>

          {/* Slider 4: Exit ARR Multiple */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-gray-300 font-medium">
                ARR Valuation Multiple (x)
              </label>
              <span className="text-blue-400 font-bold bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-500/30">
                {arrMultiple}x ARR
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={arrMultiple}
              onChange={(e) => setArrMultiple(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
            />
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>5x (Conservative)</span>
              <span>12x (SaaS Benchmark)</span>
              <span>25x (AI Premium)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Outputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Card 1: Estimated Valuation */}
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 p-5 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-400 text-sm font-medium flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-purple-400" />
                Simulated Valuation
              </span>
              <Badge className={valChangePercent >= 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}>
                {valChangePercent >= 0 ? `+${valChangePercent}%` : `${valChangePercent}%`} vs Base
              </Badge>
            </div>
            <div className="text-3xl font-extrabold text-white mb-1">
              {formatCurrency(simulationResults.multipleValuation)}
            </div>
            <p className="text-xs text-purple-300">
              Based on {arrMultiple}x multiple of {formatCurrency(simulationResults.sim12mArr)} projected ARR
            </p>
          </div>

          {/* Card 2: Projected 12-Month ARR */}
          <div className="bg-white/[0.03] border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm font-medium flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Projected 12-Month ARR
              </span>
              <span className="text-white font-semibold text-sm">
                {formatCurrency(simulationResults.sim12mArr)}
              </span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-400 h-full transition-all duration-300" 
                style={{ width: `${Math.min(100, Math.max(10, (simulationResults.sim12mArr / (simulationResults.base12mArr * 2)) * 100))}%` }}
              />
            </div>
          </div>

          {/* Card 3: Adjusted Runway */}
          <div className="bg-white/[0.03] border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Simulated Runway
              </span>
              <span className={`font-bold text-base ${simulationResults.simRunway >= 18 ? 'text-emerald-400' : simulationResults.simRunway >= 12 ? 'text-amber-400' : 'text-red-400'}`}>
                {simulationResults.simRunway >= 36 ? '36+ Months' : `${simulationResults.simRunway} Months`}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Cash Zero Estimate: <span className="text-white font-medium">{simulationResults.zeroDateStr}</span>
            </p>
          </div>

          {/* Card 4: VC Insight Note */}
          <div className="bg-purple-950/40 border border-purple-800/40 p-4 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-purple-200 leading-relaxed">
              {growthRate >= 15 && burnAdj <= 0 
                ? '🚀 High efficiency scenario! Strong growth with disciplined burn significantly extends runway and boosts valuation.'
                : burnAdj > 20 && growthRate < 10
                ? '⚠️ Caution: High burn acceleration outpaces revenue growth, reducing runway by several months.'
                : '💡 Tip: Adjust growth rate and ARR exit multiples to evaluate Series A round requirements.'}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Trajectory Chart */}
      <div className="bg-white/[0.02] border border-white/10 p-5 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          12-Month Projected Cash Balance ($) & Trajectory
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simulationResults.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="simCashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="baseCashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis 
                stroke="#9ca3af" 
                tick={{ fontSize: 11 }} 
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Area 
                type="monotone" 
                dataKey="Simulated Cash ($)" 
                stroke="#8b5cf6" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#simCashGrad)" 
              />
              <Area 
                type="monotone" 
                dataKey="Baseline Cash ($)" 
                stroke="#64748b" 
                strokeWidth={1.5} 
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#baseCashGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
