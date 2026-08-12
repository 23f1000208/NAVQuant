export interface NavPoint {
  date: string; // DD-MM-YYYY
  nav: string | number;
}

export interface FundSearchResult {
  schemeCode: number;
  schemeName: string;
}

export interface RawMfResponse {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: NavPoint[];
  status: string;
}

export interface ParsedNavPoint {
  date: string; // YYYY-MM-DD for charts
  timestamp: number;
  nav: number;
  benchmarkNav: number;
  drawdownPct: number;
}

export interface SectorAllocation {
  name: string;
  percentage: number;
}

export interface MarketCapBreakdown {
  category: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Cash & Debt';
  percentage: number;
}

export interface HoldingItem {
  name: string;
  sector: string;
  weightPct: number;
  peRatio?: number;
}

export interface YearlyPerformance {
  year: number;
  fundReturn: number;
  benchmarkReturn: number;
  alpha: number;
  maxDrawdown: number;
}

export interface RollingReturnPoint {
  date: string;
  rollingReturnPct: number;
  benchmarkRollingPct: number;
}

export interface RollingReturnStats {
  periodYears: number;
  mean: number;
  min: number;
  max: number;
  median: number;
  probGt10: number; // % of rolling periods with > 10% CAGR
  probNegative: number; // % of rolling periods with negative CAGR
  series?: RollingReturnPoint[];
}

export interface TrailingReturns {
  return1W: number;
  return1M: number;
  return3M: number;
  return6M: number;
  returnYTD: number;
  cagr1Y: number;
  cagr3Y: number;
  cagr5Y: number;
  cagrInception: number;
  // Benchmark Trailing
  bench1W: number;
  bench1M: number;
  bench3M: number;
  bench6M: number;
  benchYTD: number;
  bench1Y: number;
  bench3Y: number;
  bench5Y: number;
}

export interface ManagedSchemeItem {
  schemeName: string;
  category: string;
  aumCr: number;
  cagr3Y: number;
  starRating: number;
  role: string; // e.g. "Lead Fund Manager"
}

export interface FundManagerHighlight {
  title: string;
  value: string;
  detail: string;
  badge?: string;
}

export interface FundManagerProfile {
  name: string;
  designation: string;
  experienceYears: number;
  tenureWithFund: string;
  education: string;
  totalAumManagedCr: number;
  investmentStyle: string;
  bio: string;
  avgAlphaGeneratedPct: number; // e.g. 3.8%
  benchmarkBeatRatioPct: number; // e.g. 84%
  photoUrl?: string;
  coManagers?: string[];
  managedSchemes: ManagedSchemeItem[];
  trackRecordHighlights: FundManagerHighlight[];
}

export interface FundMetrics {
  // A. Profile & Identifiers
  schemeCode: number;
  schemeName: string;
  amcName: string;
  category: string;
  fundType: string;
  fundManagers: string[];
  managerProfile?: FundManagerProfile;
  benchmarkName: string;

  // B. Operational Parameters
  latestNav: number;
  latestNavDate: string;
  navChange1D: number;
  navChange1DPct: number;
  aumCr: number;
  expenseRatio: number;
  exitLoad: string;
  turnoverRatio: number;

  // C. Performance Metrics
  cagr1Y: number;
  cagr3Y: number;
  cagr5Y: number;
  cagrInception: number;
  benchmarkCagr1Y: number;
  benchmarkCagr3Y: number;
  benchmarkCagr5Y: number;
  trailingReturns?: TrailingReturns;

  // D. Quantitative Risk Analytics
  alpha: number;
  beta: number;
  sharpe: number;
  sortino: number;
  stdDev: number; // Annualized
  maxDrawdown: number; // Negative percentage e.g. -14.2%
  upsideCapture: number; // e.g. 108%
  downsideCapture: number; // e.g. 85%
  riskFreeRate: number; // 6.5%

  // Rolling Returns
  rolling1Y: RollingReturnStats;
  rolling3Y: RollingReturnStats;

  // E. Valuation & Portfolio
  peRatio: number;
  pbRatio: number;
  top5ConcPct: number;
  top10ConcPct: number;
  sectorAllocation: SectorAllocation[];
  marketCapBreakdown: MarketCapBreakdown[];
  holdings: HoldingItem[];

  // Historical Year by Year
  yearlyPerformance: YearlyPerformance[];

  // Processed NAV series for charts
  navHistory: ParsedNavPoint[];

  // Rating
  starRating: number; // 1 to 5 stars
}

export interface AdvisoryNote {
  overallRating: 'Strong Buy / Top Pick' | 'Consistent Performer' | 'Moderate / Hold' | 'High Risk / Caution';
  suitabilityTag: string; // e.g., "Long-term Wealth Creation (5+ Years)"
  summary: string;
  strengths: string[];
  risks: string[];
  verdict: string;
  recommendedAllocation: string; // e.g. "15-20% of Equity Portfolio"
}

export interface InvestorProfileInput {
  goal: string; // e.g. "Wealth Creation", "Retirement Planning", "Child Education", "Short-Term Growth"
  horizon: string; // e.g. "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive' | 'Very Aggressive';
  investmentMode: 'Monthly SIP' | 'Lumpsum' | 'Step-Up SIP';
  budgetAmount: number; // e.g. 15000 / month or lumpsum
}

export interface RecommendedFundItem {
  schemeCode: number;
  schemeName: string;
  amcName: string;
  cagr3Y: number;
  alpha: number;
  sharpe: number;
  expenseRatio: number;
  riskTag: string;
  rationale: string;
  suggestedWeightPct: number;
  starRating?: number;
}

export interface ConsultantRecommendation {
  investorProfileSummary: string;
  suggestedAllocation: {
    largeCapPct: number;
    midCapPct: number;
    flexiCapPct: number;
    smallCapPct: number;
  };
  categories: {
    largeCap: RecommendedFundItem[];
    midCap: RecommendedFundItem[];
    flexiCap: RecommendedFundItem[];
    smallCap: RecommendedFundItem[];
  };
  keyAdvice: string[];
}

export interface FundComparisonItem {
  metrics: FundMetrics;
  color: string;
}

export interface UserFeedbackInput {
  rating: number; // 1 to 5 stars
  category: 'General' | 'Feature Request' | 'Bug Report' | 'Quant Model Accuracy' | 'User Interface';
  name?: string;
  email?: string;
  comments: string;
}

export interface UserFeedbackItem extends UserFeedbackInput {
  id: string;
  timestamp: string;
}

export interface VisitorStats {
  totalVisits: number;
  activeToday: number;
}

