import React from 'react';
import { POPULAR_CURATED_FUNDS } from '../data/fundMetadata';
import { Zap, Sparkles, Filter } from 'lucide-react';

interface CuratedFundsBarProps {
  currentSchemeCode: number;
  onSelectFund: (code: number) => void;
}

export const CuratedFundsBar: React.FC<CuratedFundsBarProps> = ({
  currentSchemeCode,
  onSelectFund
}) => {
  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Quick Curated Funds:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {POPULAR_CURATED_FUNDS.map((fund) => {
            const isSelected = fund.schemeCode === currentSchemeCode;
            return (
              <button
                key={fund.schemeCode}
                onClick={() => onSelectFund(fund.schemeCode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 border ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <span className="truncate max-w-[160px] sm:max-w-none">
                  {fund.schemeName.split(' - ')[0]}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {fund.category.replace(' Fund', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
