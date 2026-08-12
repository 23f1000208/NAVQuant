import React, { useState } from 'react';
import { StarRating } from './StarRating';
import {
  Sparkles,
  Bot,
  Target,
  Clock,
  ShieldAlert,
  TrendingUp,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  PlusCircle,
  BarChart3,
  Layers,
  Award,
  Zap,
  RotateCcw,
  X
} from 'lucide-react';
import { InvestorProfileInput, ConsultantRecommendation, RecommendedFundItem } from '../types';

interface AgenticConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFundForAnalysis: (schemeCode: number) => void;
  onAddFundToComparison: (schemeCode: number) => void;
}

export const AgenticConsultantModal: React.FC<AgenticConsultantModalProps> = ({
  isOpen,
  onClose,
  onSelectFundForAnalysis,
  onAddFundToComparison
}) => {
  // Form State
  const [profile, setProfile] = useState<InvestorProfileInput>({
    goal: 'Wealth Creation & Capital Compounding',
    horizon: '5-10 Years',
    riskTolerance: 'Aggressive',
    investmentMode: 'Monthly SIP',
    budgetAmount: 15000
  });

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<ConsultantRecommendation | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'largeCap' | 'midCap' | 'flexiCap' | 'smallCap'>('all');
  const [addedCodes, setAddedCodes] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agentic-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      if (!res.ok) {
        throw new Error('Failed to generate agentic consultation');
      }

      const data: ConsultantRecommendation = await res.json();
      setRecommendation(data);
    } catch (err) {
      console.error('Agentic consultant error:', err);
      alert('Unable to generate AI recommendations right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompareClick = (schemeCode: number) => {
    onAddFundToComparison(schemeCode);
    setAddedCodes((prev) => new Set(prev).add(schemeCode));
  };

  const handleAnalyzeClick = (schemeCode: number) => {
    onSelectFundForAnalysis(schemeCode);
    onClose();
  };

  const CATEGORY_NAMES = {
    largeCap: 'Large Cap (Top 5)',
    midCap: 'Mid Cap (Top 5)',
    flexiCap: 'Flexi Cap (Top 5)',
    smallCap: 'Small Cap (Top 5)'
  };

  const renderFundCard = (fund: RecommendedFundItem, categoryLabel: string) => {
    const isAdded = addedCodes.has(fund.schemeCode);

    return (
      <div
        key={fund.schemeCode}
        className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-teal-950/20"
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-teal-400 bg-teal-950/80 border border-teal-800/50 px-2 py-0.5 rounded-full inline-block mb-1">
                {categoryLabel}
              </span>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-teal-300 transition-colors line-clamp-2">
                {fund.schemeName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-400">{fund.amcName}</p>
                <StarRating rating={fund.starRating || (fund.sharpe >= 1.2 ? 5 : fund.sharpe >= 0.9 ? 4 : 3)} size="sm" showScore />
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700 whitespace-nowrap">
              {fund.riskTag}
            </span>
          </div>

          <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 my-3 leading-relaxed">
            "{fund.rationale}"
          </p>

          <div className="grid grid-cols-4 gap-1 py-2 border-y border-slate-800/80 mb-3 text-center">
            <div>
              <p className="text-[10px] text-slate-500 uppercase">3Y CAGR</p>
              <p className="text-xs font-bold text-emerald-400">+{fund.cagr3Y}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Alpha</p>
              <p className="text-xs font-bold text-teal-400">+{fund.alpha}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Sharpe</p>
              <p className="text-xs font-bold text-indigo-300">{fund.sharpe}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Expense</p>
              <p className="text-xs font-bold text-amber-300">{fund.expenseRatio}%</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => handleAnalyzeClick(fund.schemeCode)}
            className="flex-1 text-xs font-semibold py-1.5 px-3 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analyze
          </button>
          <button
            onClick={() => handleCompareClick(fund.schemeCode)}
            disabled={isAdded}
            className={`text-xs font-semibold py-1.5 px-3 rounded-lg border flex items-center gap-1 transition-colors ${
              isAdded
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" /> Compare
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  Agentic AI Investment Consultant
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/50 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  Gemini 3.6 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalized portfolio allocation & top 5 mutual fund recommendations across Large, Mid, Flexi, & Small Cap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Investor Input Panel */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-400" />
                Investor Profile & Risk Objectives
              </h3>
              {recommendation && (
                <button
                  onClick={() => setRecommendation(null)}
                  className="text-xs text-teal-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Form
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Goal */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Primary Investment Goal
                </label>
                <select
                  value={profile.goal}
                  onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="Wealth Creation & Capital Compounding">Wealth Creation & Growth</option>
                  <option value="Retirement & Corpus Building">Retirement Corpus Building</option>
                  <option value="Children Education & Future Fund">Children Education Fund</option>
                  <option value="Home Purchase / Medium Goal">Home Purchase / Major Goal</option>
                  <option value="Capital Preservation & Inflation Hedge">Capital Preservation & Tax</option>
                </select>
              </div>

              {/* Time Horizon */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Time Horizon
                </label>
                <select
                  value={profile.horizon}
                  onChange={(e) => setProfile({ ...profile, horizon: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="1-3 Years">1 - 3 Years (Short Term)</option>
                  <option value="3-5 Years">3 - 5 Years (Medium Term)</option>
                  <option value="5-10 Years">5 - 10 Years (Long Term)</option>
                  <option value="10+ Years">10+ Years (Ultra Long Term)</option>
                </select>
              </div>

              {/* Risk Tolerance */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Risk Appetite
                </label>
                <select
                  value={profile.riskTolerance}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      riskTolerance: e.target.value as InvestorProfileInput['riskTolerance']
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="Conservative">Conservative (Low Volatility)</option>
                  <option value="Moderate">Moderate (Balanced Risk)</option>
                  <option value="Aggressive">Aggressive (High Alpha)</option>
                  <option value="Very Aggressive">Very Aggressive (Max CAGR)</option>
                </select>
              </div>

              {/* Mode & Budget */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Mode & Monthly / Lumpsum Amount
                </label>
                <div className="flex gap-2">
                  <select
                    value={profile.investmentMode}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        investmentMode: e.target.value as InvestorProfileInput['investmentMode']
                      })
                    }
                    className="w-2/5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Monthly SIP">SIP</option>
                    <option value="Lumpsum">Lumpsum</option>
                    <option value="Step-Up SIP">Step-Up</option>
                  </select>
                  <input
                    type="number"
                    value={profile.budgetAmount}
                    onChange={(e) =>
                      setProfile({ ...profile, budgetAmount: Math.max(1000, Number(e.target.value)) })
                    }
                    placeholder="Amount (₹)"
                    className="w-3/5 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets for Budget */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] text-slate-500 font-medium">Quick Amount:</span>
              {[5000, 10000, 15000, 25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setProfile({ ...profile, budgetAmount: amt })}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                    profile.budgetAmount === amt
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-teal-950/30 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Agentic AI Processing Portfolio & Quantitative Models...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Top 5 Mutual Funds Recommendation Strategy
                </>
              )}
            </button>
          </div>

          {/* Results Output Section */}
          {recommendation && (
            <div className="space-y-6 animate-fadeIn">
              {/* Asset Allocation Bar & Investor Profile Summary */}
              <div className="bg-slate-950 border border-teal-500/30 rounded-xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Award className="w-5 h-5 text-teal-400" />
                      Recommended Portfolio Strategy
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {recommendation.investorProfileSummary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 bg-teal-950 text-teal-300 border border-teal-700/50 rounded-lg font-mono">
                      Target: ₹{Number(profile.budgetAmount).toLocaleString('en-IN')} / {profile.investmentMode}
                    </span>
                  </div>
                </div>

                {/* Target Asset Allocation Bar */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-300">
                      Target Category Allocation Split
                    </span>
                    <span className="text-xs font-mono text-slate-400">100% Equity Allocation</span>
                  </div>
                  <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                    <div
                      style={{ width: `${recommendation.suggestedAllocation.largeCapPct}%` }}
                      className="bg-sky-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-slate-950"
                      title={`Large Cap: ${recommendation.suggestedAllocation.largeCapPct}%`}
                    >
                      {recommendation.suggestedAllocation.largeCapPct >= 10 && `${recommendation.suggestedAllocation.largeCapPct}%`}
                    </div>
                    <div
                      style={{ width: `${recommendation.suggestedAllocation.flexiCapPct}%` }}
                      className="bg-teal-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-slate-950"
                      title={`Flexi Cap: ${recommendation.suggestedAllocation.flexiCapPct}%`}
                    >
                      {recommendation.suggestedAllocation.flexiCapPct >= 10 && `${recommendation.suggestedAllocation.flexiCapPct}%`}
                    </div>
                    <div
                      style={{ width: `${recommendation.suggestedAllocation.midCapPct}%` }}
                      className="bg-indigo-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-slate-100"
                      title={`Mid Cap: ${recommendation.suggestedAllocation.midCapPct}%`}
                    >
                      {recommendation.suggestedAllocation.midCapPct >= 10 && `${recommendation.suggestedAllocation.midCapPct}%`}
                    </div>
                    <div
                      style={{ width: `${recommendation.suggestedAllocation.smallCapPct}%` }}
                      className="bg-amber-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-slate-950"
                      title={`Small Cap: ${recommendation.suggestedAllocation.smallCapPct}%`}
                    >
                      {recommendation.suggestedAllocation.smallCapPct >= 10 && `${recommendation.suggestedAllocation.smallCapPct}%`}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2 text-slate-400 flex-wrap gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                      Large Cap ({recommendation.suggestedAllocation.largeCapPct}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
                      Flexi Cap ({recommendation.suggestedAllocation.flexiCapPct}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                      Mid Cap ({recommendation.suggestedAllocation.midCapPct}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      Small Cap ({recommendation.suggestedAllocation.smallCapPct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'all'
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-950/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  All Categories (Top 20 Funds)
                </button>
                <button
                  onClick={() => setActiveTab('largeCap')}
                  className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'largeCap'
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  🏢 Large Cap (Top 5)
                </button>
                <button
                  onClick={() => setActiveTab('midCap')}
                  className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'midCap'
                      ? 'bg-indigo-500 text-slate-100'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  🚀 Mid Cap (Top 5)
                </button>
                <button
                  onClick={() => setActiveTab('flexiCap')}
                  className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'flexiCap'
                      ? 'bg-teal-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  🌐 Flexi Cap (Top 5)
                </button>
                <button
                  onClick={() => setActiveTab('smallCap')}
                  className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'smallCap'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  ⚡ Small Cap (Top 5)
                </button>
              </div>

              {/* Fund Listings Grid */}
              <div className="space-y-6">
                {(activeTab === 'all' || activeTab === 'largeCap') && (
                  <div>
                    <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Top 5 Large Cap Funds (Anchor Portfolio Stability)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendation.categories.largeCap.map((fund) =>
                        renderFundCard(fund, 'Large Cap')
                      )}
                    </div>
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'midCap') && (
                  <div>
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      Top 5 Mid Cap Funds (High-Growth Industry Leaders)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendation.categories.midCap.map((fund) =>
                        renderFundCard(fund, 'Mid Cap')
                      )}
                    </div>
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'flexiCap') && (
                  <div>
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      Top 5 Flexi Cap Funds (Dynamic Multi-Cap Opportunistic Allocation)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendation.categories.flexiCap.map((fund) =>
                        renderFundCard(fund, 'Flexi Cap')
                      )}
                    </div>
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'smallCap') && (
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Top 5 Small Cap Funds (Maximum Long-Term Alpha Generation)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendation.categories.smallCap.map((fund) =>
                        renderFundCard(fund, 'Small Cap')
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Key Advisor Actionable Guidance */}
              {recommendation.keyAdvice && recommendation.keyAdvice.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-teal-400" />
                    Agentic AI Implementation Guidance
                  </h4>
                  <ul className="space-y-2">
                    {recommendation.keyAdvice.map((adv, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Click "Analyze" on any recommended fund to examine deep rolling returns and NAV drawdown analytics.
          </p>
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close Consultant
          </button>
        </div>
      </div>
    </div>
  );
};
