import React, { useState, useEffect } from 'react';
import { FundMetrics, AdvisoryNote } from '../types';
import { Sparkles, CheckCircle2, AlertCircle, Award, Target, RefreshCw, Compass } from 'lucide-react';

interface AdvisoryNoteCardProps {
  metrics: FundMetrics;
}

export const AdvisoryNoteCard: React.FC<AdvisoryNoteCardProps> = ({ metrics }) => {
  const [advisory, setAdvisory] = useState<AdvisoryNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvisoryNote = async () => {
    setLoading(true);
    setError(null);
    try {
      // Omit heavy navHistory array from the POST body payload
      const { navHistory, ...lightMetrics } = metrics;
      const res = await fetch('/api/advisory-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fundMetrics: lightMetrics })
      });

      if (!res.ok) {
        throw new Error('Failed to generate advisory analysis');
      }

      const data: AdvisoryNote = await res.json();
      setAdvisory(data);
    } catch (err: any) {
      console.error('Advisory Note Error:', err);
      setError(err?.message || 'Could not load AI advisory note');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (metrics) {
      fetchAdvisoryNote();
    }
  }, [metrics.schemeCode]);

  const getRatingBadgeStyle = (rating: AdvisoryNote['overallRating']) => {
    switch (rating) {
      case 'Strong Buy / Top Pick':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10';
      case 'Consistent Performer':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-teal-500/10';
      case 'Moderate / Hold':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 rounded-2xl p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/90 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              AI Quantitative Advisory & Investment Verdict
            </h3>
            <p className="text-xs text-slate-400">
              Automated plain-English analysis powered by Gemini 3.6 Flash & Quantitative Engine
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdvisoryNote}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : 'Regenerate Note'}
        </button>
      </div>

      {/* Content Body */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
          <RefreshCw className="h-7 w-7 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold text-slate-300">
            Evaluating Alpha (+{metrics.alpha}%), Beta ({metrics.beta}), Sharpe ({metrics.sharpe}) & Drawdown...
          </p>
          <p className="text-xs text-slate-500">Synthesizing quantitative metrics into actionable investment advice</p>
        </div>
      ) : advisory ? (
        <div className="mt-5 space-y-5 relative z-10">
          {/* Top Rating & Suitability Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Overall Advisory Rating:
              </span>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-lg border shadow-sm flex items-center gap-1.5 ${getRatingBadgeStyle(
                  advisory.overallRating
                )}`}
              >
                <Award className="h-4 w-4" />
                {advisory.overallRating}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Compass className="h-4 w-4 text-emerald-400" />
              <span>Horizon: <strong className="text-emerald-300">{advisory.suitabilityTag}</strong></span>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {advisory.summary}
            </p>
          </div>

          {/* Strengths & Risks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Key Investment Strengths
              </h4>
              <ul className="space-y-2">
                {advisory.strengths.map((s, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks & Considerations */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2.5">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                Risks & Considerations
              </h4>
              <ul className="space-y-2">
                {advisory.risks.map((r, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Verdict & Recommended Portfolio Weight */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Target className="h-3.5 w-3.5" />
                Actionable Investment Verdict
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {advisory.verdict}
              </p>
            </div>

            <div className="shrink-0 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Suggested Core Allocation
              </span>
              <span className="text-xs font-extrabold text-emerald-300 font-mono">
                {advisory.recommendedAllocation}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          Click "Regenerate Note" to synthesize quantitative advisory analysis.
        </div>
      )}
    </div>
  );
};
