import React, { useState, useEffect } from 'react';
import { FundMetrics, FundSearchResult } from '../types';
import { X, Layers, Plus, Trash2, Trophy, ArrowUpRight, Search, RefreshCw, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { StarRating } from './StarRating';

interface FundComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFund: FundMetrics;
  comparisonList: FundMetrics[];
  onAddFundToComparison: (code: number) => void;
  onRemoveFundFromComparison: (code: number) => void;
}

export const FundComparisonModal: React.FC<FundComparisonModalProps> = ({
  isOpen,
  onClose,
  currentFund,
  comparisonList,
  onAddFundToComparison,
  onRemoveFundFromComparison
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FundSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search for modal search input
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/mf/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error('Modal search query failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Combine current fund with additional comparison funds (up to 5)
  const allComparedFunds: FundMetrics[] = React.useMemo(() => {
    if (!currentFund) return [];
    const map = new Map<number, FundMetrics>();
    map.set(currentFund.schemeCode, currentFund);
    comparisonList.forEach((f) => map.set(f.schemeCode, f));
    return Array.from(map.values()).slice(0, 5);
  }, [currentFund, comparisonList]);

  if (!isOpen) return null;

  // Chart comparison dataset
  const chartData = [
    {
      metric: '3Y CAGR (%)',
      ...allComparedFunds.reduce((acc, f) => ({ ...acc, [f.schemeName.split(' - ')[0]]: f.cagr3Y }), {})
    },
    {
      metric: 'Alpha (%)',
      ...allComparedFunds.reduce((acc, f) => ({ ...acc, [f.schemeName.split(' - ')[0]]: f.alpha }), {})
    },
    {
      metric: 'Sharpe Ratio',
      ...allComparedFunds.reduce((acc, f) => ({ ...acc, [f.schemeName.split(' - ')[0]]: f.sharpe }), {})
    },
    {
      metric: 'Sortino Ratio',
      ...allComparedFunds.reduce((acc, f) => ({ ...acc, [f.schemeName.split(' - ')[0]]: f.sortino }), {})
    }
  ];

  const FUND_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b', '#ec4899'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-6xl my-auto overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Multi-Fund Head-to-Head Comparison
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30">
                  {allComparedFunds.length} / 5 Funds
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Compare quantitative risk metrics, returns, alpha, expense ratio, and portfolio concentration side-by-side
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Add Fund Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 relative z-20">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fund to add to comparison (e.g. HDFC Flexi Cap, Axis Bluechip)..."
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {isSearching && (
              <RefreshCw className="absolute right-3.5 top-3 h-4 w-4 text-emerald-400 animate-spin" />
            )}

            {/* Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-800">
                {searchResults.map((item) => (
                  <button
                    key={item.schemeCode}
                    onClick={() => {
                      onAddFundToComparison(item.schemeCode);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-800 text-xs flex items-center justify-between group"
                  >
                    <span className="text-slate-200 group-hover:text-emerald-400 font-medium line-clamp-1">
                      {item.schemeName}
                    </span>
                    <Plus className="h-4 w-4 text-emerald-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Comparison Bar Chart */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              Risk-Adjusted Performance Comparison Chart
            </h3>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                  <XAxis dataKey="metric" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  {allComparedFunds.map((f, idx) => (
                    <Bar
                      key={f.schemeCode}
                      dataKey={f.schemeName.split(' - ')[0]}
                      fill={FUND_COLORS[idx % FUND_COLORS.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="rounded-2xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4 w-48">Quantitative Attribute</th>
                  {allComparedFunds.map((f, idx) => (
                    <th key={f.schemeCode} className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-100 line-clamp-1" style={{ color: FUND_COLORS[idx % FUND_COLORS.length] }}>
                          {f.schemeName.split(' - ')[0]}
                        </span>
                        {f.schemeCode !== currentFund.schemeCode && (
                          <button
                            onClick={() => onRemoveFundFromComparison(f.schemeCode)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                            title="Remove from comparison"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono normal-case block">
                        {f.category}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
                {/* Quant Rating */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-amber-400 font-bold flex items-center gap-1.5">
                    Quant Rating
                  </td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4">
                      <StarRating rating={f.starRating || 5} size="sm" showScore />
                    </td>
                  ))}
                </tr>

                {/* Fund Manager & Experience */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">Lead Fund Manager</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4 font-sans font-bold text-slate-200">
                      <div>{f.managerProfile?.name || f.fundManagers[0]}</div>
                      {f.managerProfile && (
                        <div className="text-[10px] text-emerald-400 font-mono font-normal mt-0.5">
                          {f.managerProfile.experienceYears} Yrs Exp • Tenure: {f.managerProfile.tenureWithFund}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Latest NAV */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">Latest NAV (₹)</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4 font-bold">
                      ₹{f.latestNav}
                    </td>
                  ))}
                </tr>

                {/* 1Y CAGR */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">1-Year CAGR (%)</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4 font-bold text-emerald-400">
                      +{f.cagr1Y}%
                    </td>
                  ))}
                </tr>

                {/* 3Y CAGR */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">3-Year CAGR (%)</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4 font-extrabold text-emerald-300">
                      +{f.cagr3Y}%
                    </td>
                  ))}
                </tr>

                {/* Alpha */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">Jensen's Alpha ($\alpha$)</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className={`p-4 font-bold ${f.alpha >= 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      +{f.alpha}%
                    </td>
                  ))}
                </tr>

                {/* Beta */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">Beta ($\beta$)</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4">
                      {f.beta.toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Sharpe */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">Sharpe Ratio</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4 font-bold text-teal-400">
                      {f.sharpe.toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Sortino */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">Sortino Ratio</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4 font-bold text-cyan-400">
                      {f.sortino.toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Max Drawdown */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">Max Drawdown (%)</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4 font-bold text-rose-400">
                      {f.maxDrawdown}%
                    </td>
                  ))}
                </tr>

                {/* Expense Ratio */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">Expense Ratio (%)</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4 font-semibold text-slate-300">
                      {f.expenseRatio}%
                    </td>
                  ))}
                </tr>

                {/* Total AUM */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">Total AUM (₹ Cr)</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4 font-semibold text-slate-300">
                      ₹{f.aumCr.toLocaleString('en-IN')} Cr
                    </td>
                  ))}
                </tr>

                {/* Top 10 Concentration */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-sans font-medium text-slate-400">Top 10 Holdings %</td>
                  {allComparedFunds.map((f) => (
                    <td key={f.schemeCode} className="p-4 font-semibold text-slate-300">
                      {f.top10ConcPct}%
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
