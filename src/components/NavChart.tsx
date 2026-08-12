import React, { useState, useMemo } from 'react';
import { ParsedNavPoint } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, Layers, SlidersHorizontal, Calendar } from 'lucide-react';

interface NavChartProps {
  navHistory: ParsedNavPoint[];
  schemeName: string;
  benchmarkName: string;
}

type TimeRange = '1M' | '6M' | '1Y' | '3Y' | '5Y' | 'MAX';

export const NavChart: React.FC<NavChartProps> = ({
  navHistory,
  schemeName,
  benchmarkName
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('3Y');
  const [isRebased, setIsRebased] = useState(true);

  // Filter series based on selected time range
  const filteredData = useMemo(() => {
    if (!navHistory || navHistory.length === 0) return [];

    const latest = navHistory[navHistory.length - 1];
    const latestMs = latest.timestamp;
    const ONE_DAY_MS = 24 * 3600 * 1000;

    let daysBack = 365 * 3;
    if (timeRange === '1M') daysBack = 30;
    else if (timeRange === '6M') daysBack = 180;
    else if (timeRange === '1Y') daysBack = 365;
    else if (timeRange === '3Y') daysBack = 365 * 3;
    else if (timeRange === '5Y') daysBack = 365 * 5;
    else if (timeRange === 'MAX') daysBack = 365 * 20;

    const targetStartMs = latestMs - daysBack * ONE_DAY_MS;
    const subset = navHistory.filter((p) => p.timestamp >= targetStartMs);

    if (subset.length === 0) return navHistory;

    // Base point for rebased mode (Base = 100)
    const baseFundNav = subset[0].nav;
    const baseBenchNav = subset[0].benchmarkNav;

    return subset.map((p) => {
      const fundRebased = baseFundNav > 0 ? (p.nav / baseFundNav) * 100 : 100;
      const benchRebased = baseBenchNav > 0 ? (p.benchmarkNav / baseBenchNav) * 100 : 100;
      return {
        ...p,
        fundRebased: Number(fundRebased.toFixed(2)),
        benchRebased: Number(benchRebased.toFixed(2)),
        fundGainPct: Number((((p.nav - baseFundNav) / baseFundNav) * 100).toFixed(2)),
        benchGainPct: Number((((p.benchmarkNav - baseBenchNav) / baseBenchNav) * 100).toFixed(2))
      };
    });
  }, [navHistory, timeRange]);

  // Gains over selected timeframe
  const periodStats = useMemo(() => {
    if (filteredData.length < 2) return { fundReturn: 0, benchReturn: 0 };
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];

    const fRet = ((last.nav - first.nav) / first.nav) * 100;
    const bRet = ((last.benchmarkNav - first.benchmarkNav) / first.benchmarkNav) * 100;
    return {
      fundReturn: Number(fRet.toFixed(2)),
      benchReturn: Number(bRet.toFixed(2)),
      alphaDelta: Number((fRet - bRet).toFixed(2))
    };
  }, [filteredData]);

  // Formatting X Axis
  const formatXAxis = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-'); // YYYY-MM-DD
    if (parts.length === 3) {
      if (timeRange === '1M' || timeRange === '6M') {
        return `${parts[2]}/${parts[1]}`;
      }
      return `${parts[1]}/${parts[0].substring(2)}`;
    }
    return dateStr;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Historical NAV vs Benchmark Growth
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {timeRange} Horizon
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare growth trajectory of <strong className="text-slate-200">{schemeName.split(' - ')[0]}</strong> against {benchmarkName}
          </p>
        </div>

        {/* Controls: Rebased Toggle & Time Horizon Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rebased mode toggle */}
          <button
            onClick={() => setIsRebased(!isRebased)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              isRebased
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Rebases start point to 100 for true percentage growth comparison"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {isRebased ? 'Rebased Index (Base=100)' : 'Absolute NAV (₹)'}
          </button>

          {/* Time range buttons */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            {(['1M', '6M', '1Y', '3Y', '5Y', 'MAX'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition ${
                  timeRange === range
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Period Return Badge Summary */}
      <div className="my-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span className="text-slate-400">Fund Period Return:</span>
            <strong className="text-emerald-400 font-mono text-sm font-bold">
              +{periodStats.fundReturn}%
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 inline-block"></span>
            <span className="text-slate-400">Benchmark Return:</span>
            <strong className="text-cyan-400 font-mono text-sm font-bold">
              +{periodStats.benchReturn}%
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-medium">
          Outperformance Delta: <strong className="font-mono">+{periodStats.alphaDelta}%</strong>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[340px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fundColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="benchColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              domain={['auto', 'auto']}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(val) => (isRebased ? `${val}` : `₹${val}`)}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950/95 border border-slate-700/90 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 font-sans min-w-[200px]">
                      <p className="font-semibold text-slate-300 font-mono border-b border-slate-800 pb-1">
                        📅 {data.date}
                      </p>
                      <div className="flex items-center justify-between gap-3 text-emerald-400">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                          Fund NAV:
                        </span>
                        <strong className="font-mono">₹{data.nav}</strong>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-cyan-400">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                          Benchmark Index:
                        </span>
                        <strong className="font-mono">₹{data.benchmarkNav}</strong>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Period Return:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          +{data.fundGainPct}%
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey={isRebased ? 'fundRebased' : 'nav'}
              name="Fund NAV"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#fundColor)"
            />
            <Area
              type="monotone"
              dataKey={isRebased ? 'benchRebased' : 'benchmarkNav'}
              name="Benchmark TRI"
              stroke="#06b6d4"
              strokeWidth={1.8}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#benchColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
