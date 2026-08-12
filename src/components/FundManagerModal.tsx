import React from 'react';
import { FundMetrics } from '../types';
import {
  X,
  UserCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  Table as TableIcon,
  Star,
  TrendingUp,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface FundManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: FundMetrics;
}

export const FundManagerModal: React.FC<FundManagerModalProps> = ({
  isOpen,
  onClose,
  metrics
}) => {
  if (!isOpen || !metrics.managerProfile) return null;

  const mgr = metrics.managerProfile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-slate-950 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                {mgr.name} — Full Track Record
              </h2>
              <p className="text-xs text-slate-400">
                Lead Fund Manager • {metrics.amcName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            title="Close Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Manager Hero Overview */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-2xl shadow-xl shrink-0">
                  <UserCheck className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation</span>
                    <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {mgr.experienceYears}+ Yrs Industry Experience
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-100 mt-0.5">{mgr.name}</h3>
                  <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                    <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                    {mgr.designation}
                  </p>
                </div>
              </div>

              {/* Quick Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Total AUM</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5 block">
                    ₹{(mgr.totalAumManagedCr / 1000).toFixed(1)}k Cr
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Career Alpha</span>
                  <span className="text-sm font-extrabold text-teal-400 font-mono mt-0.5 block">
                    +{mgr.avgAlphaGeneratedPct}% p.a.
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Beat Index %</span>
                  <span className="text-sm font-extrabold text-cyan-400 font-mono mt-0.5 block">
                    {mgr.benchmarkBeatRatioPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Credentials & Philosophy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-teal-400" />
                  Education & Credentials
                </span>
                <p className="font-semibold text-slate-200 font-mono">{mgr.education}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                  Investment Style & Mandate
                </span>
                <p className="font-semibold text-emerald-300">{mgr.investmentStyle}</p>
              </div>
            </div>

            {/* Bio Narrative */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Track Record Bio & Strategy
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">{mgr.bio}</p>
            </div>
          </div>

          {/* Track Record Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              Quantitative Track Record Pillars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {mgr.trackRecordHighlights.map((hl, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{hl.title}</span>
                    {hl.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        {hl.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono">{hl.value}</div>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{hl.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Managed Schemes Table */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <TableIcon className="h-4 w-4 text-emerald-400" />
              All Schemes Managed by {mgr.name}
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[9px] tracking-wider">
                  <tr>
                    <th className="p-2.5">Scheme Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">AUM (₹ Cr)</th>
                    <th className="p-2.5">3Y CAGR (%)</th>
                    <th className="p-2.5">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
                  {mgr.managedSchemes.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-2.5 font-sans font-bold text-slate-100">{s.schemeName}</td>
                      <td className="p-2.5 font-sans text-slate-300">{s.category}</td>
                      <td className="p-2.5 font-sans text-emerald-400 font-semibold text-[11px]">{s.role}</td>
                      <td className="p-2.5 font-bold">₹{s.aumCr.toLocaleString('en-IN')} Cr</td>
                      <td className="p-2.5 font-extrabold text-emerald-400">+{s.cagr3Y}%</td>
                      <td className="p-2.5">
                        <div className="flex items-center text-amber-400 gap-0.5">
                          {Array.from({ length: s.starRating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400" />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Performance Bar Chart */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                3Y CAGR Comparison Across Managed Funds
              </span>

              <div className="h-[200px] w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mgr.managedSchemes.map((s) => ({
                      name: s.schemeName.length > 22 ? s.schemeName.slice(0, 22) + '...' : s.schemeName,
                      '3Y CAGR (%)': s.cagr3Y,
                      'Benchmark 3Y (%)': metrics.benchmarkCagr3Y
                    }))}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 shadow-2xl text-xs space-y-1 font-sans">
                              <p className="font-bold text-slate-200">{data.name}</p>
                              <p className="text-emerald-400 font-bold">Scheme 3Y CAGR: +{data['3Y CAGR (%)']}%</p>
                              <p className="text-cyan-400 font-semibold">Benchmark 3Y CAGR: +{data['Benchmark 3Y (%)']}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="3Y CAGR (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Benchmark 3Y (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-400">
            Source: AMC Quantitative Disclosures & Market Filings
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
