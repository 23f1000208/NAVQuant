import React, { useState, useEffect } from 'react';
import { FundMetrics } from './types';
import { Header } from './components/Header';
import { CuratedFundsBar } from './components/CuratedFundsBar';
import { KpiSummaryCards } from './components/KpiSummaryCards';
import { NavChart } from './components/NavChart';
import { DrawdownChart } from './components/DrawdownChart';
import { DeepDiveTabs } from './components/DeepDiveTabs';
import { AdvisoryNoteCard } from './components/AdvisoryNoteCard';
import { FundComparisonModal } from './components/FundComparisonModal';
import { AgenticConsultantModal } from './components/AgenticConsultantModal';
import { FeedbackModal } from './components/FeedbackModal';
import { FundManagerModal } from './components/FundManagerModal';
import { LegalPolicyModal } from './components/LegalPolicyModal';
import { StarRating } from './components/StarRating';
import { VisitorCounter } from './components/VisitorCounter';
import {
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Building2,
  Users,
  Award,
  Layers,
  Scale,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Star,
  GraduationCap,
  UserCheck
} from 'lucide-react';

const DEFAULT_SCHEME_CODE = 122639; // Parag Parikh Flexi Cap Fund

export default function App() {
  const [currentFund, setCurrentFund] = useState<FundMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fund Comparison State
  const [comparisonList, setComparisonList] = useState<FundMetrics[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'disclaimer'>('privacy');
  const [activeTabOverride, setActiveTabOverride] = useState<'risk' | 'portfolio' | 'historical' | 'sip' | 'manager' | undefined>(undefined);

  const handleSelectManagerTab = () => {
    setActiveTabOverride('manager');
    setIsManagerModalOpen(true);
    setTimeout(() => {
      const el = document.getElementById('deep-dive-tabs');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Fetch fund details by scheme code
  const loadFundDetails = async (schemeCode: number) => {
    setIsLoading(true);
    setError(null);
    setActiveTabOverride(undefined);
    try {
      const res = await fetch(`/api/mf/${schemeCode}`);
      if (!res.ok) {
        throw new Error('Failed to fetch mutual fund quantitative analytics');
      }
      const data: FundMetrics = await res.json();
      setCurrentFund(data);
    } catch (err: any) {
      console.error('Error loading fund:', err);
      setError(err?.message || 'Failed to load fund details');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a fund to comparison list
  const handleAddFundToComparison = async (schemeCode: number) => {
    if (comparisonList.some((f) => f.schemeCode === schemeCode)) return;
    if (comparisonList.length >= 4) {
      alert('You can compare up to 5 funds simultaneously.');
      return;
    }

    try {
      const res = await fetch(`/api/mf/${schemeCode}`);
      if (res.ok) {
        const data: FundMetrics = await res.json();
        setComparisonList((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error('Failed to add fund to comparison:', err);
    }
  };

  // Remove fund from comparison
  const handleRemoveFundFromComparison = (schemeCode: number) => {
    setComparisonList((prev) => prev.filter((f) => f.schemeCode !== schemeCode));
  };

  // Initial load
  useEffect(() => {
    loadFundDetails(DEFAULT_SCHEME_CODE);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Header with Global Search */}
      <Header
        currentSchemeName={currentFund?.schemeName || ''}
        onSelectFund={loadFundDetails}
        comparisonCount={comparisonList.length + (currentFund ? 1 : 0)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenConsultant={() => setIsConsultantOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        isLoading={isLoading}
      />

      {/* 2. Curated Funds Bar */}
      <CuratedFundsBar
        currentSchemeCode={currentFund?.schemeCode || DEFAULT_SCHEME_CODE}
        onSelectFund={loadFundDetails}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadFundDetails(DEFAULT_SCHEME_CODE)}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold"
            >
              Retry Default
            </button>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && !currentFund ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
            <p className="text-sm font-semibold">
              Fetching daily NAV history & computing quantitative metrics...
            </p>
          </div>
        ) : currentFund ? (
          <>
            {/* Fund Hero / Profile Banner */}
            <section className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-extrabold border border-emerald-500/20 uppercase tracking-wider">
                      {currentFund.category}
                    </span>
                    <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <span className="text-[10px] text-amber-400/80 font-mono uppercase">Quant Rating:</span>
                      <StarRating rating={currentFund.starRating || 5} size="sm" showScore />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                      Code: {currentFund.schemeCode}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-sans border border-slate-700">
                      {currentFund.fundType}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
                    {currentFund.schemeName}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      AMC: <strong className="text-slate-200">{currentFund.amcName}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      Managers:{' '}
                      <strong className="text-slate-200">
                        {currentFund.fundManagers.join(', ')}
                      </strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-slate-500" />
                      Benchmark: <strong className="text-slate-200">{currentFund.benchmarkName}</strong>
                    </span>
                  </div>
                </div>

                {/* Quick Action & Operational Parameters */}
                <div className="flex flex-wrap items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
                  <div className="text-right pr-3 border-r border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total AUM</span>
                    <span className="text-sm font-extrabold text-slate-100 font-mono">
                      ₹{currentFund.aumCr.toLocaleString('en-IN')} Cr
                    </span>
                  </div>

                  <div className="text-right pr-3 border-r border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Expense Ratio</span>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      {currentFund.expenseRatio}%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Exit Load</span>
                    <span className="text-xs font-semibold text-slate-300 max-w-[140px] truncate block">
                      {currentFund.exitLoad}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Top KPI Summary Cards */}
            <KpiSummaryCards
              metrics={currentFund}
              onSelectManagerTab={handleSelectManagerTab}
            />

            {/* Performance Visuals Section: NAV History + Drawdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NavChart
                  navHistory={currentFund.navHistory}
                  schemeName={currentFund.schemeName}
                  benchmarkName={currentFund.benchmarkName}
                />
              </div>

              <div className="lg:col-span-1">
                <DrawdownChart
                  navHistory={currentFund.navHistory}
                  maxDrawdownPct={currentFund.maxDrawdown}
                />
              </div>
            </div>

            {/* AI Advisory Note & Investment Verdict */}
            <AdvisoryNoteCard metrics={currentFund} />

            {/* Deep-Dive Tabs Panel */}
            <DeepDiveTabs
              metrics={currentFund}
              activeTabOverride={activeTabOverride}
            />
          </>
        ) : null}
      </main>

      {/* Multi-Fund Comparison Modal */}
      {currentFund && (
        <FundComparisonModal
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          currentFund={currentFund}
          comparisonList={comparisonList}
          onAddFundToComparison={handleAddFundToComparison}
          onRemoveFundFromComparison={handleRemoveFundFromComparison}
        />
      )}

      {/* Agentic AI Investment Consultant Modal */}
      <AgenticConsultantModal
        isOpen={isConsultantOpen}
        onClose={() => setIsConsultantOpen(false)}
        onSelectFundForAnalysis={loadFundDetails}
        onAddFundToComparison={handleAddFundToComparison}
      />

      {/* Lead Fund Manager Full Track Record Modal */}
      {currentFund && (
        <FundManagerModal
          isOpen={isManagerModalOpen}
          onClose={() => setIsManagerModalOpen(false)}
          metrics={currentFund}
        />
      )}

      {/* User Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Legal Policy & Google Ads Compliance Modal */}
      <LegalPolicyModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        defaultTab={legalModalTab}
      />

      {/* Floating Action Button for Feedback */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-3 rounded-full shadow-2xl font-bold text-xs flex items-center gap-2 border border-amber-300 transition-all hover:scale-105 active:scale-95 group"
      >
        <MessageSquare className="w-4 h-4 text-slate-950 fill-slate-950" />
        <span className="hidden sm:inline">Feedback & Rating</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-950"></span>
        </span>
      </button>

      {/* Footer Disclaimer & Software Owner Credit */}
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-12 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Software Owner Card */}
          <div className="max-w-2xl mx-auto bg-slate-900/90 rounded-2xl p-4 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-base shadow-inner shrink-0">
                <GraduationCap className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Software Owner & Lead Architect
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-100 mt-0.5">Santosh Kumar</h4>
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <UserCheck className="h-3.5 w-3.5 text-teal-400" />
                  Data Scientist • Alumnus/Researcher at <strong className="text-slate-200">IIT Madras</strong>
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4 w-full sm:w-auto">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Platform Edition</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">NAVQuant PRO v3.0</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <p className="font-semibold text-slate-300">
              NAVQuant PRO — Quantitative Mutual Fund Analytics & AI Advisory Engine
            </p>
            <VisitorCounter />
          </div>

          {/* Mandatory Google Ads Policy & Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold pt-1">
            <button
              onClick={() => {
                setLegalModalTab('privacy');
                setIsLegalModalOpen(true);
              }}
              className="text-slate-400 hover:text-emerald-400 underline decoration-slate-700 underline-offset-4 transition"
            >
              Privacy Policy
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                setLegalModalTab('terms');
                setIsLegalModalOpen(true);
              }}
              className="text-slate-400 hover:text-emerald-400 underline decoration-slate-700 underline-offset-4 transition"
            >
              Terms of Service
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                setLegalModalTab('disclaimer');
                setIsLegalModalOpen(true);
              }}
              className="text-amber-400/90 hover:text-amber-300 underline decoration-amber-500/30 underline-offset-4 transition flex items-center gap-1"
            >
              Financial Services Disclaimer
            </button>
            <span className="text-slate-700">•</span>
            <a
              href="mailto:santoshkumardatascientist@gmail.com"
              className="text-slate-400 hover:text-emerald-400 underline decoration-slate-700 underline-offset-4 transition"
            >
              Publisher Contact
            </a>
          </div>

          <p className="max-w-3xl mx-auto leading-relaxed text-[11px] text-slate-600">
            Disclaimer: NAVQuant PRO is an independent quantitative research platform developed by Santosh Kumar (Data Scientist). All NAV historical data is retrieved in real-time from the public MFapi.in API. Quantitative metrics (CAGR, Jensen's Alpha, Beta, Sharpe Ratio, Sortino Ratio, Drawdown) are dynamically computed on the fly ($R_f = 6.5\%$). Mutual Fund investments are subject to market risks. NAVQuant PRO is NOT a SEBI-registered advisor and does not provide investment recommendations.
          </p>
        </div>
      </footer>
    </div>
  );
}
