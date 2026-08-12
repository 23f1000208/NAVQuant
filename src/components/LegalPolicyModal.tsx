import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, AlertTriangle, Mail, Building2, UserCheck, CheckCircle2 } from 'lucide-react';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy'
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-100">
                Legal & Advertising Compliance Center
              </h2>
              <p className="text-xs text-slate-400">
                NAVQuant PRO • Google Ads & Financial Services Disclosures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-6 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition ${
              activeTab === 'privacy'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/40 border-b-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            Privacy Policy
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition ${
              activeTab === 'terms'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/40 border-b-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Terms of Service
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition ${
              activeTab === 'disclaimer'
                ? 'bg-slate-900 text-amber-400 border-amber-500/40 border-b-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Financial Disclaimer
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed flex-1 font-sans">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Google Ads Policy Compliant:</strong> NAVQuant PRO strictly respects user privacy. We do not sell, rent, or trade any personal information to third-party ad networks or data brokers.
                </p>
              </div>

              <h3 className="text-sm font-bold text-slate-100">1. Data Collection & Privacy Standards</h3>
              <p>
                NAVQuant PRO operates primarily as a client-side quantitative research dashboard. We do not collect or store personal financial credentials, bank account numbers, PAN details, or broker passwords.
              </p>

              <h3 className="text-sm font-bold text-slate-100">2. Analytics & Cookies</h3>
              <p>
                We may use standard, non-personally identifiable browser cookies or local storage solely to save your local UI preferences (such as selected comparison mutual funds or custom SIP calculation parameters).
              </p>

              <h3 className="text-sm font-bold text-slate-100">3. Contact & Publisher Details</h3>
              <p className="flex items-center gap-2 text-slate-200 font-semibold">
                <Mail className="h-4 w-4 text-emerald-400" />
                Publisher Email: <a href="mailto:santoshkumardatascientist@gmail.com" className="text-emerald-400 underline">santoshkumardatascientist@gmail.com</a>
              </p>
              <p className="flex items-center gap-2 text-slate-200 font-semibold">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                Software Owner: Santosh Kumar (Data Scientist & IIT Madras Researcher)
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-100">1. Educational & Informational Tool</h3>
              <p>
                By accessing NAVQuant PRO, you agree that this platform is strictly an analytical, mathematical, and data-visualization software intended for educational and research purposes.
              </p>

              <h3 className="text-sm font-bold text-slate-100">2. No Guarantee of Accuracy</h3>
              <p>
                NAV quantitative calculations (CAGR, Sharpe Ratio, Sortino Ratio, Jensen's Alpha) are derived dynamically from public historical NAV feeds provided via MFapi.in. Past performance calculations are for illustrative purposes and do not guarantee future returns.
              </p>

              <h3 className="text-sm font-bold text-slate-100">3. Intellectual Property</h3>
              <p>
                All quantitative algorithms, visual interface design, and custom risk model engines are owned by Santosh Kumar (Lead Architect & Owner).
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-200 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  SEBI / Financial Services Regulatory Disclosure
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  <strong>NAVQuant PRO is NOT a SEBI-registered Investment Advisor (RIA) or Portfolio Management Service (PMS).</strong> The analytics, ratings, quantitative metrics, and AI advisory summaries generated by this platform do NOT constitute personalized investment advice, stock tips, or mutual fund buy/sell recommendations.
                </p>
              </div>

              <h3 className="text-sm font-bold text-slate-100">Mutual Fund Market Risk Warning</h3>
              <p>
                Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Historical returns are not indicative of future performance. Users are strongly advised to consult a SEBI-registered financial planner or advisor before making actual financial decisions.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-400">
            Last Updated: August 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
