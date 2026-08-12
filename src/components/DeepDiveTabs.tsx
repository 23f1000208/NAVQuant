import React, { useState } from 'react';
import { FundMetrics } from '../types';
import {
  PieChart as PieChartIcon,
  Table as TableIcon,
  Calculator,
  ShieldCheck,
  Percent,
  Layers,
  ArrowUpRight,
  Sparkles,
  UserCheck,
  Briefcase,
  Award,
  GraduationCap,
  Building2,
  Star,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';

interface DeepDiveTabsProps {
  metrics: FundMetrics;
  activeTabOverride?: 'risk' | 'portfolio' | 'historical' | 'sip' | 'manager';
}

type TabType = 'risk' | 'portfolio' | 'historical' | 'sip' | 'manager';

const SECTOR_COLORS = [
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#64748b'
];

export const DeepDiveTabs: React.FC<DeepDiveTabsProps> = ({ metrics, activeTabOverride }) => {
  const [activeTab, setActiveTab] = useState<TabType>('risk');

  React.useEffect(() => {
    if (activeTabOverride) {
      setActiveTab(activeTabOverride);
      if (activeTabOverride === 'manager') {
        setTimeout(() => {
          const el = document.getElementById('deep-dive-tabs');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      }
    }
  }, [activeTabOverride]);

  React.useEffect(() => {
    setExpectedReturnPct(Math.min(Math.max(Math.round(metrics.cagr3Y), 8), 22));
  }, [metrics.schemeCode, metrics.cagr3Y]);
  const [returnSubTab, setReturnSubTab] = useState<'trailing' | 'rolling' | 'sip'>('trailing');
  const [rollingWindow, setRollingWindow] = useState<'1Y' | '3Y'>('3Y');

  // SIP Calculator State
  const [calcMode, setCalcMode] = useState<'sip' | 'lumpsum'>('sip');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(15000);
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(200000);
  const [investmentYears, setInvestmentYears] = useState<number>(10);
  const [expectedReturnPct, setExpectedReturnPct] = useState<number>(
    Math.min(Math.max(Math.round(metrics.cagr3Y), 8), 22)
  );
  const [annualStepUpPct, setAnnualStepUpPct] = useState<number>(10);

  // Calculate SIP Projection
  const sipProjection = React.useMemo(() => {
    const months = investmentYears * 12;
    const monthlyRate = expectedReturnPct / 12 / 100;

    let totalInvested = 0;
    let currentWealth = 0;
    let currentMonthly = monthlyAmount;

    const yearlyData = [];

    if (calcMode === 'sip') {
      for (let yr = 1; yr <= investmentYears; yr++) {
        for (let m = 1; m <= 12; m++) {
          totalInvested += currentMonthly;
          currentWealth = (currentWealth + currentMonthly) * (1 + monthlyRate);
        }

        yearlyData.push({
          year: `Yr ${yr}`,
          invested: Math.round(totalInvested),
          wealth: Math.round(currentWealth),
          returns: Math.round(currentWealth - totalInvested)
        });

        // Step up
        if (annualStepUpPct > 0) {
          currentMonthly = currentMonthly * (1 + annualStepUpPct / 100);
        }
      }
    } else {
      totalInvested = lumpsumAmount;
      for (let yr = 1; yr <= investmentYears; yr++) {
        currentWealth = lumpsumAmount * Math.pow(1 + expectedReturnPct / 100, yr);
        yearlyData.push({
          year: `Yr ${yr}`,
          invested: Math.round(totalInvested),
          wealth: Math.round(currentWealth),
          returns: Math.round(currentWealth - totalInvested)
        });
      }
    }

    return {
      totalInvested: Math.round(totalInvested),
      finalWealth: Math.round(currentWealth),
      wealthGain: Math.round(currentWealth - totalInvested),
      yearlyData
    };
  }, [calcMode, monthlyAmount, lumpsumAmount, investmentYears, expectedReturnPct, annualStepUpPct]);

  return (
    <div id="deep-dive-tabs" className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Navigation Tabs Header */}
      <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-none bg-slate-950/60">
        <button
          onClick={() => setActiveTab('risk')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'risk'
              ? 'border-emerald-400 text-emerald-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          1. Quantitative Risk & Return Matrix
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'portfolio'
              ? 'border-emerald-400 text-emerald-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <PieChartIcon className="h-4 w-4" />
          2. Portfolio Composition & Holdings
        </button>

        <button
          onClick={() => setActiveTab('historical')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'historical'
              ? 'border-emerald-400 text-emerald-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <TableIcon className="h-4 w-4" />
          3. Year-by-Year Historical Breakdown
        </button>

        <button
          onClick={() => setActiveTab('sip')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'sip'
              ? 'border-emerald-400 text-emerald-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Calculator className="h-4 w-4" />
          4. Rolling Returns & SIP Calculator
        </button>

        <button
          onClick={() => setActiveTab('manager')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'manager'
              ? 'border-emerald-400 text-emerald-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          5. Fund Manager & Track Record
        </button>
      </div>

      {/* TAB 1: QUANTITATIVE RISK & RETURN MATRIX */}
      {activeTab === 'risk' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Jensen's Alpha ($\alpha$)</span>
              <p className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
                {metrics.alpha > 0 ? '+' : ''}{metrics.alpha}%
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Outperformance vs CAPM expected benchmark return
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Beta ($\beta$)</span>
              <p className="text-xl font-extrabold text-slate-100 font-mono mt-1">
                {metrics.beta.toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {metrics.beta < 1.0 ? 'Lower volatility than market' : 'Higher market sensitivity'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Sharpe Ratio</span>
              <p className="text-xl font-extrabold text-teal-400 font-mono mt-1">
                {metrics.sharpe.toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Risk-free rate benchmarked at {metrics.riskFreeRate}% p.a.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Sortino Ratio</span>
              <p className="text-xl font-extrabold text-cyan-400 font-mono mt-1">
                {metrics.sortino.toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Downside volatility risk-adjusted ratio
              </p>
            </div>
          </div>

          {/* Extended Metrics Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Risk & Return Indicator</th>
                  <th className="p-3.5 font-mono">Fund Value</th>
                  <th className="p-3.5">Threshold / Ideal Benchmark</th>
                  <th className="p-3.5">Interpretation & Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium">Alpha ($\alpha$)</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">+{metrics.alpha}%</td>
                  <td className="p-3.5 text-slate-400">&gt; 1.0% is Strong Outperformance</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      {metrics.alpha >= 1.0 ? 'Green (Strong Alpha)' : 'Neutral'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium">Beta ($\beta$)</td>
                  <td className="p-3.5 font-mono font-bold text-slate-100">{metrics.beta.toFixed(2)}</td>
                  <td className="p-3.5 text-slate-400">&lt; 1.0 indicates Defensive / Low Volatility</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold">
                      {metrics.beta < 1.0 ? 'Defensive' : 'Market-Aligned'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium">Sharpe Ratio</td>
                  <td className="p-3.5 font-mono font-bold text-teal-400">{metrics.sharpe.toFixed(2)}</td>
                  <td className="p-3.5 text-slate-400">&gt; 0.8 is Excellent Risk-Adjusted Return</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      {metrics.sharpe >= 0.8 ? 'Excellent' : 'Moderate'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium">Sortino Ratio</td>
                  <td className="p-3.5 font-mono font-bold text-cyan-400">{metrics.sortino.toFixed(2)}</td>
                  <td className="p-3.5 text-slate-400">&gt; 1.0 indicates High Downside Efficiency</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                      {metrics.sortino >= 1.0 ? 'High Downside Protection' : 'Standard'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium">Annualized Std Dev ($\sigma$)</td>
                  <td className="p-3.5 font-mono font-bold text-slate-200">{metrics.stdDev.toFixed(1)}%</td>
                  <td className="p-3.5 text-slate-400">12% - 18% typical for Equity Category</td>
                  <td className="p-3.5 text-slate-400">Annualized Volatility of Daily Returns</td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium">Max Drawdown (%)</td>
                  <td className="p-3.5 font-mono font-bold text-rose-400">{metrics.maxDrawdown.toFixed(1)}%</td>
                  <td className="p-3.5 text-slate-400">Peak-to-Trough Maximum Drop</td>
                  <td className="p-3.5 text-rose-300 font-medium">Maximum Historical Correction</td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium">Upside Capture Ratio</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">{metrics.upsideCapture}%</td>
                  <td className="p-3.5 text-slate-400">&gt; 100% captures more bull market gains</td>
                  <td className="p-3.5 text-emerald-300 font-medium">Bull Market Outperformance</td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium">Downside Capture Ratio</td>
                  <td className="p-3.5 font-mono font-bold text-teal-400">{metrics.downsideCapture}%</td>
                  <td className="p-3.5 text-slate-400">&lt; 100% shields portfolio in bear markets</td>
                  <td className="p-3.5 text-teal-300 font-medium">Bear Market Shielding</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PORTFOLIO COMPOSITION & HOLDINGS */}
      {activeTab === 'portfolio' && (
        <div className="p-6 space-y-6">
          {/* Top Valuation Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Portfolio P/E Ratio</span>
              <p className="text-2xl font-extrabold text-slate-100 font-mono mt-1">{metrics.peRatio}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Weighted Price-to-Earnings</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Portfolio P/B Ratio</span>
              <p className="text-2xl font-extrabold text-slate-100 font-mono mt-1">{metrics.pbRatio}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Weighted Price-to-Book</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Top 5 Concentration</span>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">{metrics.top5ConcPct}%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Combined weight of top 5 stocks</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Top 10 Concentration</span>
              <p className="text-2xl font-extrabold text-teal-400 font-mono mt-1">{metrics.top10ConcPct}%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Combined weight of top 10 stocks</p>
            </div>
          </div>

          {/* Sector & Market Cap Allocation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sector Allocation */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-emerald-400" />
                Sector Allocation Breakdown
              </h4>

              <div className="space-y-2.5">
                {metrics.sectorAllocation.map((sec, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{sec.name}</span>
                      <strong className="font-mono text-emerald-400">{sec.percentage}%</strong>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        style={{ width: `${sec.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Cap Breakup */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-teal-400" />
                Market Cap Allocation Breakup
              </h4>

              <div className="space-y-4">
                {metrics.marketCapBreakdown.map((mcap, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{mcap.category}</span>
                      <span className="font-mono font-bold text-teal-400">{mcap.percentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-lg overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-md ${
                          mcap.category === 'Large Cap'
                            ? 'bg-emerald-400'
                            : mcap.category === 'Mid Cap'
                            ? 'bg-cyan-400'
                            : mcap.category === 'Small Cap'
                            ? 'bg-amber-400'
                            : 'bg-slate-500'
                        }`}
                        style={{ width: `${mcap.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top 10 Portfolio Holdings Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-xs text-slate-200 uppercase tracking-wider">
              Top 10 Stock Holdings
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Company / Stock Name</th>
                  <th className="p-3">Sector</th>
                  <th className="p-3 font-mono">Weight (%)</th>
                  <th className="p-3 font-mono">P/E Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {metrics.holdings.map((stock, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-semibold text-slate-100 flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono w-4">#{idx + 1}</span>
                      {stock.name}
                    </td>
                    <td className="p-3 text-slate-400">{stock.sector}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{stock.weightPct}%</td>
                    <td className="p-3 font-mono text-slate-300">{stock.peRatio || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: YEAR-BY-YEAR HISTORICAL BREAKDOWN */}
      {activeTab === 'historical' && (
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Annual Calendar Year Returns & Alpha Generation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison of annual performance vs benchmark ({metrics.benchmarkName}) from 2019 to present
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-mono">Calendar Year</th>
                  <th className="p-3.5 font-mono">Fund Return (%)</th>
                  <th className="p-3.5 font-mono">Benchmark Return (%)</th>
                  <th className="p-3.5 font-mono">Alpha / Excess (%)</th>
                  <th className="p-3.5 font-mono">Max Drawdown in Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {metrics.yearlyPerformance.map((yr) => (
                  <tr key={yr.year} className="hover:bg-slate-800/40 font-mono">
                    <td className="p-3.5 font-bold text-slate-100">{yr.year}</td>
                    <td
                      className={`p-3.5 font-bold ${
                        yr.fundReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {yr.fundReturn >= 0 ? '+' : ''}{yr.fundReturn}%
                    </td>
                    <td
                      className={`p-3.5 font-semibold ${
                        yr.benchmarkReturn >= 0 ? 'text-cyan-400' : 'text-rose-400'
                      }`}
                    >
                      {yr.benchmarkReturn >= 0 ? '+' : ''}{yr.benchmarkReturn}%
                    </td>
                    <td
                      className={`p-3.5 font-bold ${
                        yr.alpha >= 0 ? 'text-emerald-300' : 'text-amber-400'
                      }`}
                    >
                      {yr.alpha >= 0 ? '+' : ''}{yr.alpha}%
                    </td>
                    <td className="p-3.5 text-rose-400 font-medium">
                      {yr.maxDrawdown}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ROLLING & TRAILING RETURNS + SIP CALCULATOR */}
      {activeTab === 'sip' && (
        <div className="p-6 space-y-6">
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setReturnSubTab('trailing')}
              className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                returnSubTab === 'trailing'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Percent className="h-4 w-4" />
              Trailing Returns (1W, 1M, 3M, 6M, YTD & CAGRs)
            </button>

            <button
              onClick={() => setReturnSubTab('rolling')}
              className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                returnSubTab === 'rolling'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Rolling Returns & Time-Series Chart
            </button>

            <button
              onClick={() => setReturnSubTab('sip')}
              className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                returnSubTab === 'sip'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Calculator className="h-4 w-4" />
              SIP & Wealth Simulator
            </button>
          </div>

          {/* SUB-VIEW 1: TRAILING RETURNS CHART & TABLE */}
          {returnSubTab === 'trailing' && (
            <div className="space-y-6">
              {/* Trailing Returns Comparison Bar Chart */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-emerald-400" />
                      Trailing Return Comparison Chart (Fund vs {metrics.benchmarkName})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Comparing weekly, monthly, YTD, and annualized CAGR returns against market benchmark
                    </p>
                  </div>
                </div>

                <div className="h-[280px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { period: '1W', Fund: metrics.trailingReturns?.return1W ?? (metrics.navChange1DPct * 5), Benchmark: metrics.trailingReturns?.bench1W ?? 0 },
                        { period: '1M', Fund: metrics.trailingReturns?.return1M ?? (metrics.cagr1Y / 12), Benchmark: metrics.trailingReturns?.bench1M ?? 0 },
                        { period: '3M', Fund: metrics.trailingReturns?.return3M ?? (metrics.cagr1Y / 4), Benchmark: metrics.trailingReturns?.bench3M ?? 0 },
                        { period: '6M', Fund: metrics.trailingReturns?.return6M ?? (metrics.cagr1Y / 2), Benchmark: metrics.trailingReturns?.bench6M ?? 0 },
                        { period: 'YTD', Fund: metrics.trailingReturns?.returnYTD ?? (metrics.cagr1Y * 0.7), Benchmark: metrics.trailingReturns?.benchYTD ?? 0 },
                        { period: '1Y', Fund: metrics.cagr1Y, Benchmark: metrics.benchmarkCagr1Y },
                        { period: '3Y CAGR', Fund: metrics.cagr3Y, Benchmark: metrics.benchmarkCagr3Y },
                        { period: '5Y CAGR', Fund: metrics.cagr5Y, Benchmark: metrics.benchmarkCagr5Y },
                      ]}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                      <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const alpha = (data.Fund - data.Benchmark).toFixed(2);
                            return (
                              <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-1 font-sans">
                                <p className="font-bold text-slate-200">{data.period} Horizon</p>
                                <p className="text-emerald-400 font-bold">Fund Return: {data.Fund >= 0 ? '+' : ''}{data.Fund}%</p>
                                <p className="text-cyan-400 font-semibold">Benchmark: {data.Benchmark >= 0 ? '+' : ''}{data.Benchmark}%</p>
                                <p className="text-teal-300 font-mono text-[11px] pt-1 border-t border-slate-800">
                                  Outperformance Alpha: {Number(alpha) >= 0 ? '+' : ''}{alpha}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="Fund" name={metrics.schemeName.length > 25 ? metrics.schemeName.slice(0, 25) + '...' : metrics.schemeName} fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Benchmark" name={`Benchmark (${metrics.benchmarkName})`} fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trailing Returns Percentage Breakdown Table */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <TableIcon className="h-4 w-4 text-emerald-400" />
                  Trailing Returns Granular Breakdown (Percentage & Alpha)
                </h4>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Period Horizon</th>
                        <th className="p-3">Fund Return (%)</th>
                        <th className="p-3">Benchmark ({metrics.benchmarkName})</th>
                        <th className="p-3">Excess Alpha (%)</th>
                        <th className="p-3">Annualized Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
                      {[
                        { label: '1-Week (7 Days)', val: metrics.trailingReturns?.return1W ?? (metrics.navChange1DPct * 5), bench: metrics.trailingReturns?.bench1W ?? 0, type: 'Absolute' },
                        { label: '1-Month (30 Days)', val: metrics.trailingReturns?.return1M ?? (metrics.cagr1Y / 12), bench: metrics.trailingReturns?.bench1M ?? 0, type: 'Absolute' },
                        { label: '3-Month (90 Days)', val: metrics.trailingReturns?.return3M ?? (metrics.cagr1Y / 4), bench: metrics.trailingReturns?.bench3M ?? 0, type: 'Absolute' },
                        { label: '6-Month (180 Days)', val: metrics.trailingReturns?.return6M ?? (metrics.cagr1Y / 2), bench: metrics.trailingReturns?.bench6M ?? 0, type: 'Absolute' },
                        { label: 'Year-To-Date (YTD)', val: metrics.trailingReturns?.returnYTD ?? (metrics.cagr1Y * 0.7), bench: metrics.trailingReturns?.benchYTD ?? 0, type: 'Absolute' },
                        { label: '1-Year', val: metrics.cagr1Y, bench: metrics.benchmarkCagr1Y, type: 'CAGR p.a.' },
                        { label: '3-Year', val: metrics.cagr3Y, bench: metrics.benchmarkCagr3Y, type: 'CAGR p.a.' },
                        { label: '5-Year', val: metrics.cagr5Y, bench: metrics.benchmarkCagr5Y, type: 'CAGR p.a.' },
                        { label: 'Since Inception', val: metrics.cagrInception, bench: metrics.benchmarkCagr5Y, type: 'CAGR p.a.' },
                      ].map((row, idx) => {
                        const alpha = row.val - row.bench;
                        return (
                          <tr key={idx} className="hover:bg-slate-800/40">
                            <td className="p-3 font-sans font-bold text-slate-200">{row.label}</td>
                            <td className={`p-3 font-extrabold ${row.val >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {row.val >= 0 ? '+' : ''}{row.val.toFixed(2)}%
                            </td>
                            <td className={`p-3 font-semibold ${row.bench >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                              {row.bench >= 0 ? '+' : ''}{row.bench.toFixed(2)}%
                            </td>
                            <td className={`p-3 font-bold ${alpha >= 0 ? 'text-emerald-300' : 'text-amber-400'}`}>
                              {alpha >= 0 ? '+' : ''}{alpha.toFixed(2)}%
                            </td>
                            <td className="p-3 font-sans text-[11px]">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                                {row.type}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: ROLLING RETURNS DISTRIBUTION & TIME CHART */}
          {returnSubTab === 'rolling' && (
            <div className="space-y-6">
              {/* Rolling Return Time-Series Line Chart */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      Rolling Return Historical Performance Chart
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Shows continuous CAGR returns generated across sliding horizon windows over time
                    </p>
                  </div>

                  {/* Window Selector */}
                  <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 self-start sm:self-auto">
                    <button
                      onClick={() => setRollingWindow('1Y')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        rollingWindow === '1Y'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      1-Year Rolling
                    </button>
                    <button
                      onClick={() => setRollingWindow('3Y')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        rollingWindow === '3Y'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      3-Year Rolling
                    </button>
                  </div>
                </div>

                <div className="h-[300px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={
                        (rollingWindow === '1Y' ? metrics.rolling1Y.series : metrics.rolling3Y.series) || []
                      }
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-1 font-sans">
                                <p className="font-bold text-slate-200">{data.date}</p>
                                <p className="text-emerald-400 font-bold">
                                  {rollingWindow} Fund Rolling CAGR: +{data.rollingReturnPct}%
                                </p>
                                <p className="text-cyan-400 font-semibold">
                                  Benchmark Rolling CAGR: +{data.benchmarkRollingPct}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <ReferenceLine y={0} stroke="#f43f5e" strokeDasharray="3 3" />
                      <Line
                        type="monotone"
                        dataKey="rollingReturnPct"
                        name={`${rollingWindow} Fund Rolling CAGR (%)`}
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="benchmarkRollingPct"
                        name={`Benchmark (${metrics.benchmarkName})`}
                        stroke="#06b6d4"
                        strokeWidth={1.8}
                        strokeDasharray="4 4"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rolling Return Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1Y Rolling */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">1-Year Rolling Horizon Stats</span>
                    <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Mean: {metrics.rolling1Y.mean}% p.a.
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase block">Average CAGR</span>
                      <strong className="text-emerald-400 font-mono text-base">+{metrics.rolling1Y.mean}%</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase block">Median CAGR</span>
                      <strong className="text-teal-400 font-mono text-base">+{metrics.rolling1Y.median}%</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase block">Minimum Return</span>
                      <strong className="text-rose-400 font-mono text-base">{metrics.rolling1Y.min}%</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase block">Maximum Return</span>
                      <strong className="text-emerald-300 font-mono text-base">+{metrics.rolling1Y.max}%</strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Probability &gt;10% CAGR: <strong className="text-emerald-400">{metrics.rolling1Y.probGt10}%</strong></span>
                    <span>Negative Prob: <strong className="text-rose-400">{metrics.rolling1Y.probNegative}%</strong></span>
                  </div>
                </div>

                {/* 3Y Rolling */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">3-Year Rolling Horizon Stats</span>
                    <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Mean: {metrics.rolling3Y.mean}% p.a.
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase block">Average CAGR</span>
                      <strong className="text-emerald-400 font-mono text-base">+{metrics.rolling3Y.mean}%</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase block">Median CAGR</span>
                      <strong className="text-teal-400 font-mono text-base">+{metrics.rolling3Y.median}%</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase block">Minimum Return</span>
                      <strong className="text-rose-400 font-mono text-base">{metrics.rolling3Y.min}%</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase block">Maximum Return</span>
                      <strong className="text-emerald-300 font-mono text-base">+{metrics.rolling3Y.max}%</strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Probability &gt;10% CAGR: <strong className="text-emerald-400">{metrics.rolling3Y.probGt10}%</strong></span>
                    <span>Negative Prob: <strong className="text-rose-400">{metrics.rolling3Y.probNegative}%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: INTERACTIVE SIP CALCULATOR */}
          {returnSubTab === 'sip' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-emerald-400" />
                    Interactive SIP & Wealth Projection Engine
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Simulate future wealth creation using historical 3Y CAGR ({metrics.cagr3Y}%) or custom rate
                  </p>
                </div>

                {/* Mode Toggle */}
                <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 self-start sm:self-auto">
                  <button
                    onClick={() => setCalcMode('sip')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      calcMode === 'sip'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Monthly SIP
                  </button>
                  <button
                    onClick={() => setCalcMode('lumpsum')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      calcMode === 'lumpsum'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    One-time Lumpsum
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Amount Slider */}
                {calcMode === 'sip' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Monthly Investment Amount:</span>
                      <strong className="text-emerald-400 font-mono text-sm">
                        ₹{monthlyAmount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={100000}
                      step={1000}
                      value={monthlyAmount}
                      onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                      className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Lumpsum Investment Amount:</span>
                      <strong className="text-emerald-400 font-mono text-sm">
                        ₹{lumpsumAmount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={2000000}
                      step={10000}
                      value={lumpsumAmount}
                      onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                      className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                {/* Time Duration Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Investment Horizon:</span>
                    <strong className="text-teal-400 font-mono text-sm">
                      {investmentYears} Years
                    </strong>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={investmentYears}
                    onChange={(e) => setInvestmentYears(Number(e.target.value))}
                    className="w-full accent-teal-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Expected Return Rate Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Expected Annual Return (CAGR):</span>
                    <strong className="text-cyan-400 font-mono text-sm">
                      {expectedReturnPct}% p.a.
                    </strong>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={0.5}
                    value={expectedReturnPct}
                    onChange={(e) => setExpectedReturnPct(Number(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Results Summary Box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Amount Invested</span>
                  <p className="text-lg font-extrabold text-slate-200 font-mono mt-0.5">
                    ₹{(sipProjection.totalInvested / 100000).toFixed(2)} Lakhs
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Estimated Wealth Gain</span>
                  <p className="text-lg font-extrabold text-teal-400 font-mono mt-0.5">
                    +₹{(sipProjection.wealthGain / 100000).toFixed(2)} Lakhs
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Future Portfolio Value</span>
                  <p className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
                    ₹{(sipProjection.finalWealth / 100000).toFixed(2)} Lakhs
                  </p>
                </div>
              </div>

              {/* Visual Bar Chart for Wealth Accumulation */}
              <div className="h-[260px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sipProjection.yearlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-1 font-sans">
                              <p className="font-bold text-slate-200">{data.year}</p>
                              <p className="text-slate-400">Total Invested: ₹{(data.invested / 100000).toFixed(2)} Lakhs</p>
                              <p className="text-emerald-400 font-bold">Compounded Value: ₹{(data.wealth / 100000).toFixed(2)} Lakhs</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="invested" name="Invested Capital" fill="#475569" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="wealth" name="Total Wealth" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: FUND MANAGER & TRACK RECORD */}
      {activeTab === 'manager' && metrics.managerProfile && (
        <div className="p-6 space-y-8">
          {/* Manager Hero Profile Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-2xl shadow-xl shrink-0">
                  <UserCheck className="h-9 w-9" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Fund Manager</span>
                    <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {metrics.managerProfile.experienceYears}+ Years Capital Markets Exp
                    </span>
                    <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      Tenure: {metrics.managerProfile.tenureWithFund}
                    </span>
                  </div>

                  <h2 className="text-xl lg:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
                    {metrics.managerProfile.name}
                  </h2>

                  <p className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                    {metrics.managerProfile.designation} — {metrics.amcName}
                  </p>
                </div>
              </div>

              {/* Key Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total AUM Managed</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono mt-0.5 block">
                    ₹{(metrics.managerProfile.totalAumManagedCr / 1000).toFixed(1)}k Cr
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Career Avg Alpha</span>
                  <span className="text-base font-extrabold text-teal-400 font-mono mt-0.5 block">
                    +{metrics.managerProfile.avgAlphaGeneratedPct}% p.a.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Benchmark Beat %</span>
                  <span className="text-base font-extrabold text-cyan-400 font-mono mt-0.5 block">
                    {metrics.managerProfile.benchmarkBeatRatioPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Credentials & Philosophy Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-teal-400" />
                  Educational Credentials & Degrees
                </span>
                <p className="font-semibold text-slate-200 font-mono">
                  {metrics.managerProfile.education}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-emerald-400" />
                  Investment Style & Management Philosophy
                </span>
                <p className="font-semibold text-emerald-300">
                  {metrics.managerProfile.investmentStyle}
                </p>
              </div>
            </div>

            {/* Manager Bio */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Track Record Narrative & Management Strategy
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {metrics.managerProfile.bio}
              </p>
              {metrics.managerProfile.coManagers && metrics.managerProfile.coManagers.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-bold text-slate-300">Co-Fund Managers:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {metrics.managerProfile.coManagers.map((co, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-[11px]">
                        {co}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Track Record Pillars & Highlight Badges Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              Quantitative Track Record Highlights & Risk Pillars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.managerProfile.trackRecordHighlights.map((hl, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{hl.title}</span>
                    {hl.badge && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        {hl.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono tracking-tight">
                    {hl.value}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {hl.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* All Schemes Currently Managed Table & Chart */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <TableIcon className="h-4 w-4 text-emerald-400" />
                  All Mutual Fund Schemes Managed by {metrics.managerProfile.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track record comparison across primary and secondary fund mandates
                </p>
              </div>
            </div>

            {/* Managed Schemes Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Scheme Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">AUM (₹ Cr)</th>
                    <th className="p-3">3Y CAGR (%)</th>
                    <th className="p-3">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
                  {metrics.managerProfile.managedSchemes.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-sans font-bold text-slate-100">{s.schemeName}</td>
                      <td className="p-3 font-sans text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[11px]">
                          {s.category}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-emerald-400 font-semibold text-[11px]">{s.role}</td>
                      <td className="p-3 font-bold text-slate-200">₹{s.aumCr.toLocaleString('en-IN')} Cr</td>
                      <td className="p-3 font-extrabold text-emerald-400">+{s.cagr3Y}%</td>
                      <td className="p-3">
                        <div className="flex items-center text-amber-400 gap-0.5">
                          {Array.from({ length: s.starRating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Performance Comparison Bar Chart across Managed Funds */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                3Y CAGR Performance Comparison Across Managed Mandates vs Benchmark
              </span>

              <div className="h-[240px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics.managerProfile.managedSchemes.map((s) => ({
                      name: s.schemeName.length > 25 ? s.schemeName.slice(0, 25) + '...' : s.schemeName,
                      '3Y CAGR (%)': s.cagr3Y,
                      'Benchmark 3Y (%)': metrics.benchmarkCagr3Y
                    }))}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-1 font-sans">
                              <p className="font-bold text-slate-200">{data.name}</p>
                              <p className="text-emerald-400 font-bold">Scheme 3Y CAGR: +{data['3Y CAGR (%)']}%</p>
                              <p className="text-cyan-400 font-semibold">Benchmark 3Y CAGR: +{data['Benchmark 3Y (%)']}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="3Y CAGR (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Benchmark 3Y (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
