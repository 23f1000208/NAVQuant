import React, { useMemo } from 'react';
import { ParsedNavPoint } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface DrawdownChartProps {
  navHistory: ParsedNavPoint[];
  maxDrawdownPct: number;
}

export const DrawdownChart: React.FC<DrawdownChartProps> = ({ navHistory, maxDrawdownPct }) => {
  // Downsample navHistory for smooth chart performance if large
  const chartData = useMemo(() => {
    if (!navHistory || navHistory.length === 0) return [];

    // Filter last 3 years of daily drawdown
    const latestMs = navHistory[navHistory.length - 1].timestamp;
    const THREE_YEARS_MS = 3 * 365 * 24 * 3600 * 1000;
    const subset = navHistory.filter((p) => latestMs - p.timestamp <= THREE_YEARS_MS);

    // Downsample if more than 500 points
    if (subset.length > 500) {
      return subset.filter((_, idx) => idx % 2 === 0);
    }
    return subset;
  }, [navHistory]);

  const formatXAxis = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[0].substring(2)}`;
    }
    return dateStr;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            Historical Drawdown Curve (% Underwater)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Measures peak-to-trough decline during market pullbacks and recovery cycles
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
          <AlertTriangle className="h-3.5 w-3.5" />
          Max Peak-to-Trough Drawdown: <span className="font-mono text-sm font-extrabold">{maxDrawdownPct.toFixed(1)}%</span>
        </div>
      </div>

      <div className="h-[220px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="drawdownColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
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
              domain={['auto', 0]}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(val) => `${val}%`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-700/90 rounded-xl p-3 shadow-2xl text-xs space-y-1 font-sans">
                      <p className="font-semibold text-slate-300 font-mono">📅 {data.date}</p>
                      <p className="text-rose-400 font-bold font-mono">
                        Decline from Peak: {data.drawdownPct}%
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        NAV: ₹{data.nav}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="drawdownPct"
              name="Drawdown %"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#drawdownColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
