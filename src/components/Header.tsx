import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Layers, RefreshCw, X, ArrowUpRight, ShieldCheck, Award, Bot, Sparkles, MessageSquare, GraduationCap, UserCheck } from 'lucide-react';
import { FundSearchResult } from '../types';
import { VisitorCounter } from './VisitorCounter';

interface HeaderProps {
  currentSchemeName: string;
  onSelectFund: (schemeCode: number) => void;
  comparisonCount: number;
  onOpenComparison: () => void;
  onOpenConsultant: () => void;
  onOpenFeedback: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentSchemeName,
  onSelectFund,
  comparisonCount,
  onOpenComparison,
  onOpenConsultant,
  onOpenFeedback,
  isLoading
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FundSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce API Search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/mf/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-slate-100 flex items-center gap-1.5">
                  NAVQuant <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PRO 3.0</span>
                </h1>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xs text-slate-400">Mutual Fund Analytics</p>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] font-semibold text-emerald-400/90 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <GraduationCap className="h-3 w-3 text-teal-400" />
                  Owner: <strong className="text-slate-100">Santosh Kumar</strong> (Data Scientist, IIT Madras)
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Comparison Trigger */}
          <button
            onClick={onOpenComparison}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 hover:bg-slate-700 transition"
          >
            <Layers className="h-3.5 w-3.5 text-teal-400" />
            Compare
            {comparisonCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">
                {comparisonCount}
              </span>
            )}
          </button>
        </div>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-full md:max-w-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setIsOpen(true)}
              placeholder="Search scheme name (e.g., Parag Parikh, HDFC Flexi Cap, SBI Small Cap)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 text-sm text-slate-100 placeholder-slate-500 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 shadow-inner transition"
            />
            {query ? (
              <button
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            ) : isSearching ? (
              <RefreshCw className="absolute right-3.5 h-4 w-4 text-emerald-400 animate-spin" />
            ) : null}
          </div>

          {/* Autocomplete Search Dropdown */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50 divide-y divide-slate-800">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
                  Querying MFapi.in database...
                </div>
              ) : results.length > 0 ? (
                results.map((item) => (
                  <button
                    key={item.schemeCode}
                    onClick={() => {
                      onSelectFund(item.schemeCode);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-800/80 transition flex items-center justify-between group"
                  >
                    <div className="pr-3">
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition line-clamp-1">
                        {item.schemeName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">Scheme Code: {item.schemeCode}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No mutual funds found matching "{query}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls & Compare Trigger */}
        <div className="hidden lg:flex items-center gap-3">
          <VisitorCounter />

          <button
            onClick={onOpenConsultant}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30 text-teal-200 text-xs font-bold border border-teal-500/40 shadow-lg shadow-teal-950/30 transition active:scale-[0.98]"
          >
            <Bot className="h-4 w-4 text-teal-400" />
            <span>AI Consultant</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
          </button>

          <button
            onClick={onOpenComparison}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 shadow-sm transition active:scale-[0.98]"
          >
            <Layers className="h-4 w-4 text-teal-400" />
            <span>Compare</span>
            {comparisonCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold shadow">
                {comparisonCount}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">(5)</span>
            )}
          </button>

          <button
            onClick={onOpenFeedback}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold border border-slate-700/80 transition active:scale-[0.98]"
            title="Investor Feedback & Reviews"
          >
            <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
            <span>Feedback</span>
          </button>

          {isLoading && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-pulse">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
