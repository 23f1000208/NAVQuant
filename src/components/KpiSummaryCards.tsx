import React from 'react';
import { FundMetrics } from '../types';
import { TrendingUp, TrendingDown, ShieldCheck, Award, Info, AlertTriangle, Scale, UserCheck, Briefcase, GraduationCap } from 'lucide-react';

interface KpiSummaryCardsProps {
  metrics: FundMetrics;
  onSelectManagerTab?: () => void;
}

export const KpiSummaryCards: React.FC<KpiSummaryCardsProps> = ({ metrics, onSelectManagerTab }) => {
  const is1DPositive = metrics.navChange1D >= 0;
  const isAlphaStrong = metrics.alpha >= 1.0;
  const isSharpeExcellent = metrics.sharpe >= 0.8;
  const isBetaLow = metrics.beta < 1.0;
  const mgr = metrics.managerProfile;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* CARD 1: LATEST NAV */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            Latest NAV
            <span className="text-[10px] text-slate-500 font-mono">({metrics.latestNavDate})</span>
          </span>
          <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Scale className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              ₹{metrics.latestNav.toFixed(2)}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  is1DPositive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {is1DPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {is1DPositive ? '+' : ''}
                {metrics.navChange1D.toFixed(2)} ({is1DPositive ? '+' : ''}
                {metrics.navChange1DPct.toFixed(2)}%)
              </span>
              <span className="text-[11px] text-slate-500">1D</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>AUM: <strong className="text-slate-200">₹{(metrics.aumCr / 1000).toFixed(1)}k Cr</strong></span>
          <span>Expense: <strong className="text-slate-200">{metrics.expenseRatio}%</strong></span>
        </div>
      </div>

      {/* CARD 2: 3-YEAR CAGR */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            3-Year CAGR
          </span>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            +{metrics.cagr3Y.toFixed(2)}% <span className="text-xs text-slate-400 font-normal">p.a.</span>
          </div>
          <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
            vs Benchmark ({metrics.benchmarkName}):{' '}
            <strong className="text-slate-300 font-mono">+{metrics.benchmarkCagr3Y.toFixed(2)}%</strong>
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">1Y CAGR: <strong className="text-slate-200">+{metrics.cagr1Y}%</strong></span>
          <span className="text-slate-400">5Y CAGR: <strong className="text-slate-200">+{metrics.cagr5Y}%</strong></span>
        </div>
      </div>

      {/* CARD 3: JENSEN'S ALPHA */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            Alpha ($\alpha$)
          </span>
          <div
            className={`h-8 w-8 rounded-lg border flex items-center justify-center ${
              isAlphaStrong
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}
          >
            <Award className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl lg:text-3xl font-extrabold font-mono tracking-tight ${
                metrics.alpha >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {metrics.alpha > 0 ? '+' : ''}
              {metrics.alpha.toFixed(2)}%
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                isAlphaStrong
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : metrics.alpha >= 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isAlphaStrong ? 'Strong Alpha' : metrics.alpha >= 0 ? 'Positive' : 'Underperforming'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 line-clamp-1">
            Excess return over CAPM benchmark
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Beta ($\beta$): <strong className="text-slate-200">{metrics.beta.toFixed(2)}</strong></span>
          <span
            className={`font-semibold ${
              isBetaLow ? 'text-emerald-400' : 'text-slate-300'
            }`}
          >
            {isBetaLow ? 'Low Volatility' : 'Market Sensitivity'}
          </span>
        </div>
      </div>

      {/* CARD 4: SHARPE RATIO */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Sharpe Ratio
          </span>
          <div
            className={`h-8 w-8 rounded-lg border flex items-center justify-center ${
              isSharpeExcellent
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              {metrics.sharpe.toFixed(2)}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                isSharpeExcellent
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              }`}
            >
              {isSharpeExcellent ? 'Excellent Risk-Reward' : 'Moderate'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 line-clamp-1">
            Sortino Ratio: <strong className="text-slate-200 font-mono">{metrics.sortino.toFixed(2)}</strong>
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Std Dev: <strong className="text-slate-200">{metrics.stdDev.toFixed(1)}%</strong></span>
          <span>Max DD: <strong className="text-rose-400">{metrics.maxDrawdown.toFixed(1)}%</strong></span>
        </div>
      </div>

      {/* FUND MANAGER QUICK SUMMARY RIBBON */}
      {mgr && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-slate-900/90 rounded-2xl p-4 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg shadow-inner">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Fund Manager</span>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {mgr.experienceYears}+ Yrs Industry Exp
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2 mt-0.5">
                {mgr.name}
                <span className="text-xs font-semibold text-slate-400 font-normal">({mgr.designation})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-3 font-mono">
                <span>Tenure: <strong className="text-slate-200">{mgr.tenureWithFund}</strong></span>
                <span>•</span>
                <span>Total AUM Managed: <strong className="text-teal-400">₹{(mgr.totalAumManagedCr / 1000).toFixed(1)}k Cr</strong></span>
                <span>•</span>
                <span>Style: <strong className="text-emerald-300 font-sans">{mgr.investmentStyle}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Career Alpha Record</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">+{mgr.avgAlphaGeneratedPct}% p.a.</span>
            </div>
            {onSelectManagerTab && (
              <button
                onClick={onSelectManagerTab}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg flex items-center gap-1.5 whitespace-nowrap"
              >
                Full Track Record
                <Briefcase className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* TRAILING RETURNS QUICK PERCENTAGES RIBBON */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Trailing Return Performance Matrix (Weekly, Monthly, YTD & Multi-Year CAGRs)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            vs Benchmark: {metrics.benchmarkName}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
          {[
            { label: '1-Week', val: metrics.trailingReturns?.return1W ?? metrics.navChange1DPct * 5, bench: metrics.trailingReturns?.bench1W ?? 0 },
            { label: '1-Month', val: metrics.trailingReturns?.return1M ?? (metrics.cagr1Y / 12), bench: metrics.trailingReturns?.bench1M ?? 0 },
            { label: '3-Month', val: metrics.trailingReturns?.return3M ?? (metrics.cagr1Y / 4), bench: metrics.trailingReturns?.bench3M ?? 0 },
            { label: '6-Month', val: metrics.trailingReturns?.return6M ?? (metrics.cagr1Y / 2), bench: metrics.trailingReturns?.bench6M ?? 0 },
            { label: 'YTD', val: metrics.trailingReturns?.returnYTD ?? (metrics.cagr1Y * 0.7), bench: metrics.trailingReturns?.benchYTD ?? 0 },
            { label: '1-Year', val: metrics.cagr1Y, bench: metrics.benchmarkCagr1Y },
            { label: '3-Year', val: metrics.cagr3Y, bench: metrics.benchmarkCagr3Y, isCagr: true },
            { label: '5-Year', val: metrics.cagr5Y, bench: metrics.benchmarkCagr5Y, isCagr: true }
          ].map((item, idx) => {
            const isPos = item.val >= 0;
            const diff = item.val - item.bench;
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
                  <span>{item.label}</span>
                  {item.isCagr && <span className="text-[9px] text-slate-500 font-mono">p.a.</span>}
                </div>

                <div className="mt-1">
                  <div
                    className={`text-sm lg:text-base font-extrabold font-mono tracking-tight ${
                      isPos ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPos ? '+' : ''}{item.val.toFixed(2)}%
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5 font-mono">
                    <span>Bench: {item.bench >= 0 ? '+' : ''}{item.bench.toFixed(1)}%</span>
                    <span className={diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
