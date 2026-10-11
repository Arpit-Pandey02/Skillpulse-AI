import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  GitCompare,
  Star,
  CheckCircle,
  HelpCircle,
  Filter,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  Search,
} from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardNavbar } from '../components/layout/DashboardNavbar';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { careerService } from '../services/careerService';
import type {
  CareerProfile,
  CareerRecommendation,
  UserCareerStatus,
  CareerFeedbackEntry,
} from '../types/career';

export const CareerDiscoveryPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Data states
  const [userStatus, setUserStatus] = useState<UserCareerStatus | null>(null);
  const [catalog, setCatalog] = useState<CareerProfile[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [savedCareerIds, setSavedCareerIds] = useState<string[]>([]);
  const [careerFeedback, setCareerFeedback] = useState<Record<string, CareerFeedbackEntry>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<'recommendations' | 'all' | 'shortlisted' | 'exploring'>('recommendations');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [searchQuery, setSearchQuery] = useState('');

  // Career Detail Modal state
  const [selectedCareer, setSelectedCareer] = useState<CareerProfile | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'evidence' | 'exploration'>('overview');

  // Side-by-Side Comparison state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareList, setCompareList] = useState<CareerProfile[]>([]);

  // Suggest Custom Role Modal state
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDomain, setCustomDomain] = useState('Technology & Software');
  const [customNotes, setCustomNotes] = useState('');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Load initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, catalogRes] = await Promise.all([
        careerService.getUserStatus(),
        careerService.getCatalog(),
      ]);

      if (statusRes) {
        setUserStatus(statusRes);
        setRecommendations(statusRes.recommendations || []);
        setSavedCareerIds(statusRes.savedCareerIds || []);
        setCareerFeedback(statusRes.careerFeedback || {});
      }

      if (catalogRes) {
        setCatalog(catalogRes.data);
        setDomains(['All Domains', ...catalogRes.domains]);
      }

      // If URL has compare parameter, initialize comparison list
      const compareQuery = searchParams.get('careers');
      if (searchParams.get('mode') === 'compare' && compareQuery) {
        const ids = compareQuery.split(',');
        const toCompare = catalogRes.data.filter((c) => ids.includes(c.careerId));
        if (toCompare.length >= 2) {
          setCompareList(toCompare);
          setIsCompareModalOpen(true);
        }
      }
    } catch (err) {
      console.error('Failed to load discovery data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  // Handle saving feedback (shortlist, exploring, not_suitable)
  const handleUpdateFeedback = async (careerId: string, status: CareerFeedbackEntry['status']) => {
    try {
      const res = await careerService.updateFeedback(careerId, status);
      if (res.success) {
        setSavedCareerIds(res.savedCareerIds);
        setCareerFeedback((prev) => ({
          ...prev,
          [careerId]: { status, updatedAt: new Date().toISOString() },
        }));
        showToast(
          status === 'shortlisted'
            ? 'Added to your Shortlist ⭐'
            : status === 'exploring'
            ? 'Marked as Exploring 🔍'
            : 'Marked as Not Suitable 🚫'
        );
      }
    } catch (err) {
      console.error('Failed to update feedback:', err);
    }
  };

  // Handle final career selection
  const handleSelectCareer = async (careerId: string, title: string) => {
    try {
      const res = await careerService.selectCareer(careerId);
      if (res.success) {
        showToast(`🎉 "${title}" selected as your primary target career role!`);
        if (userStatus) {
          setUserStatus({
            ...userStatus,
            careerStatus: 'decided',
            selectedCareerId: careerId,
            targetRole: title,
          });
        }
        if (selectedCareer) {
          setSelectedCareer(null);
        }
        if (isCompareModalOpen) {
          setIsCompareModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Failed to select career:', err);
    }
  };

  // Submit custom unlisted role
  const handleSuggestCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    setIsSubmittingCustom(true);
    try {
      const res = await careerService.suggestCustomRole(customTitle.trim(), customDomain, customNotes);
      if (res.success) {
        setIsSuggestModalOpen(false);
        setCustomTitle('');
        setCustomNotes('');
        showToast(`Custom role "${customTitle}" recorded successfully!`);
        await loadData();
      }
    } catch (err) {
      console.error('Failed to suggest custom role:', err);
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  // Trigger quick side-by-side comparison
  const openCompareModal = (careersToCompare?: CareerProfile[]) => {
    if (careersToCompare && careersToCompare.length >= 2) {
      setCompareList(careersToCompare);
    } else {
      // Pick shortlisted or top 2
      const shortlisted = catalog.filter((c) => savedCareerIds.includes(c.careerId));
      if (shortlisted.length >= 2) {
        setCompareList(shortlisted.slice(0, 3));
      } else if (catalog.length >= 2) {
        setCompareList(catalog.slice(0, 2));
      }
    }
    setIsCompareModalOpen(true);
  };

  const showToast = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4000);
  };

  // Filter recommendations or catalog according to tab, domain, and query
  const getFilteredItems = () => {
    let items: Array<{ career: CareerProfile; recommendation?: CareerRecommendation }> = [];

    // If searching, search across full catalog (or tab-specific sub-selection if shortlisted/exploring)
    if (searchQuery.trim()) {
      if (activeTab === 'shortlisted') {
        items = catalog
          .filter((c) => savedCareerIds.includes(c.careerId))
          .map((career) => ({
            career,
            recommendation: recommendations.find((r) => r.career.careerId === career.careerId),
          }));
      } else if (activeTab === 'exploring') {
        items = catalog
          .filter((c) => careerFeedback[c.careerId]?.status === 'exploring')
          .map((career) => ({
            career,
            recommendation: recommendations.find((r) => r.career.careerId === career.careerId),
          }));
      } else {
        // Across recommendations or all roles, search the full catalog
        items = catalog.map((career) => {
          const rec = recommendations.find((r) => r.career.careerId === career.careerId);
          return { career, recommendation: rec };
        });
      }
    } else if (activeTab === 'recommendations') {
      items = recommendations.map((rec) => ({
        career: rec.career,
        recommendation: rec,
      }));
    } else {
      items = catalog.map((career) => {
        const rec = recommendations.find((r) => r.career.careerId === career.careerId);
        return { career, recommendation: rec };
      });
    }

    // Filter by tab status when not searching
    if (!searchQuery.trim()) {
      if (activeTab === 'shortlisted') {
        items = items.filter((item) => savedCareerIds.includes(item.career.careerId));
      } else if (activeTab === 'exploring') {
        items = items.filter(
          (item) => careerFeedback[item.career.careerId]?.status === 'exploring'
        );
      }
    }

    // Filter by domain
    if (selectedDomain && selectedDomain !== 'All Domains' && selectedDomain !== 'All') {
      items = items.filter((item) =>
        item.career.domain.toLowerCase().includes(selectedDomain.toLowerCase())
      );
    }

    // Filter by search query across complete text corpus
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter((item) => {
        const c = item.career;
        const textCorpus = [
          c.title,
          c.domain,
          c.summary,
          c.description || '',
          ...(c.keyActivities || []),
          ...(c.workStyleTags || []),
          ...(c.environmentTags || []),
          ...(c.transferableSubjects || []),
          ...(c.priorityTags || []),
        ]
          .join(' ')
          .toLowerCase();

        return textCorpus.includes(q);
      });
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardNavbar
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewState="normal"
          onViewStateChange={() => {}}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Toast Notification */}
          {actionSuccessMessage && (
            <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
          )}

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  Career Discovery Hub
                </span>

                <Badge variant={userStatus?.geminiActive ? "indigo" : "slate"} size="sm">
                  {userStatus?.geminiActive
                    ? `Engine: Gemini (${userStatus.modelUsed || 'gemini-3.8-flash'}) + Rule-Based`
                    : 'Engine: Transparent Rule-Based (Offline)'}
                </Badge>

                {userStatus?.careerStatus === 'decided' ? (
                  <Badge variant="emerald" size="sm" hasDot>
                    Target Role: {userStatus.targetRole || 'Decided'}
                  </Badge>
                ) : userStatus?.careerStatus === 'comparing' ? (
                  <Badge variant="violet" size="sm" hasDot>
                    Status: Comparing Roles
                  </Badge>
                ) : (
                  <Badge variant="amber" size="sm" hasDot>
                    Status: Undecided / Exploring
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Explore Multi-Domain Career Pathways
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Discover roles across technology, healthcare, business, science, and policy. Match scores are calculated using transparent, deterministic alignment against your stated interests and skills.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link to="/onboarding">
                <Button variant="secondary" size="sm" leftIcon={<Compass className="w-4 h-4" />}>
                  Retake Questionnaire
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="sm"
                leftIcon={<GitCompare className="w-4 h-4" />}
                onClick={() => openCompareModal()}
                disabled={catalog.length < 2}
              >
                Side-by-Side Compare
              </Button>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                onClick={() => setIsSuggestModalOpen(true)}
              >
                Suggest Custom Role
              </Button>
            </div>
          </div>

          {/* Optional Gemini AI Synthesis Card */}
          {userStatus?.aiInsights && (
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                      Personalized Career Synthesis
                      <Badge variant="indigo" size="sm">
                        AI Active: {userStatus.modelUsed || 'gemini-3.8-flash'}
                      </Badge>
                    </h2>
                    <p className="text-xs text-indigo-200/80">
                      Personalized qualitative guidance generated from your stated subjects, work styles, and priorities.
                    </p>
                  </div>
                </div>
                {userStatus.aiInsights.generatedAt && (
                  <span className="text-[11px] text-slate-400">
                    Generated: {new Date(userStatus.aiInsights.generatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Synthesis Narrative */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {userStatus.aiInsights.overallSynthesis}
              </div>

              {/* Actionable Next Steps & Blind Spots Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Recommended Steps */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
                  <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Recommended First Steps This Semester
                  </h3>
                  <ul className="space-y-2">
                    {userStatus.aiInsights.recommendedFirstSteps?.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-snug">
                        <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center justify-center mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Potential Blind Spots */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
                  <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Considerations & Trade-Offs
                  </h3>
                  <ul className="space-y-2">
                    {userStatus.aiInsights.potentialBlindSpots?.map((spot: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-snug">
                        <span className="shrink-0 w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center mt-0.5">
                          !
                        </span>
                        <span>{spot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Transparency Notice */}
              <div className="text-[11px] text-slate-400 border-t border-white/10 pt-3 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>
                  Deterministic match percentages, employment outlooks, and official salaries below are strictly preserved as non-generative, verified ground truth.
                </span>
              </div>
            </div>
          )}

          {/* Guidance Disclaimer Banner */}
          <div className="bg-gradient-to-r from-indigo-50/70 to-slate-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>Exploratory Guidance Transparency:</strong> Recommendation percentages are derived from transparent rule-based overlap between your questionnaire responses and verified occupational attributes. They do not constitute formal psychometric evaluations. All salary and market data carry geographical scopes and official government citations.
            </div>
          </div>

          {/* Filter Bar & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveTab('recommendations')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition shrink-0 ${
                  activeTab === 'recommendations'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Top Matched Careers ({recommendations.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition shrink-0 ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Multi-Domain Roles ({catalog.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('shortlisted')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition shrink-0 ${
                  activeTab === 'shortlisted'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Shortlisted ({savedCareerIds.length}) ⭐
              </button>
            </div>

            {/* Search & Domain Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* In-page Career Search Input */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search title, domain, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold p-1 rounded-full"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Domain Filter Dropdown */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {domains.map((dom) => (
                    <option key={dom} value={dom}>
                      {dom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Career Cards Grid */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500">Loading career profiles & evidence...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 mb-1">No careers match your search or filter</h3>
              <p className="text-xs text-slate-500 mb-4">
                {searchQuery
                  ? `No roles matched "${searchQuery}". Try different keywords or clear your search.`
                  : 'Try selecting "All Domains" to explore other fields.'}
              </p>
              <div className="flex items-center justify-center gap-2">
                {searchQuery && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedDomain('All Domains');
                    setSearchQuery('');
                    setActiveTab('all');
                  }}
                >
                  Show All Careers
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map(({ career, recommendation }) => {
                const isShortlisted = savedCareerIds.includes(career.careerId);
                const isTargetRole = userStatus?.selectedCareerId === career.careerId;

                return (
                  <div
                    key={career.careerId}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {career.domain}
                        </span>

                        {recommendation && (
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              recommendation.matchScore >= 80
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : recommendation.matchScore >= 60
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {recommendation.matchScore}% Match
                          </span>
                        )}
                      </div>

                      {/* Title & Summary */}
                      <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                        {career.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                        {career.summary}
                      </p>

                      {/* Match Rationale Pill if available */}
                      {recommendation && recommendation.matchRationale.length > 0 && (
                        <div className="mb-4 p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 space-y-1">
                          <span className="font-semibold block text-indigo-800">
                            Why it matches:
                          </span>
                          <p className="line-clamp-2 leading-relaxed text-indigo-700">
                            {recommendation.matchRationale[0]}
                          </p>
                        </div>
                      )}

                      {/* Quick Evidence Highlight */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-4 space-y-1.5 text-[11px] text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Median Salary:</span>
                          <span className="font-semibold text-slate-800">
                            {career.evidence.salaryData[0]?.currency}{' '}
                            ${career.evidence.salaryData[0]?.median.toLocaleString()}/yr
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Geographic Scope:</span>
                          <span className="font-medium text-slate-700">
                            {career.evidence.salaryData[0]?.geographicScope}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Outlook:</span>
                          <span className="font-medium text-emerald-700">
                            {career.evidence.employmentOutlook?.growthRateText}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        {/* Shortlist Toggle Button */}
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateFeedback(
                              career.careerId,
                              isShortlisted ? 'not_suitable' : 'shortlisted'
                            )
                          }
                          className={`p-2 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 ${
                            isShortlisted
                              ? 'bg-amber-50 border-amber-300 text-amber-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-amber-500 text-amber-500' : ''}`} />
                          <span className="hidden sm:inline">
                            {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                          </span>
                        </button>

                        {/* View Full Profile & Evidence */}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedCareer(career);
                            setDetailTab('overview');
                          }}
                          className="flex-1"
                        >
                          View Evidence <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Button>
                      </div>

                      {/* Select as Primary Target Career */}
                      {isTargetRole ? (
                        <div className="w-full py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-xs font-semibold flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Current Target Role
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => handleSelectCareer(career.careerId, career.title)}
                        >
                          Select as My Career Path
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Career Profile & Evidence Modal */}
      {selectedCareer && (
        <Modal
          isOpen={!!selectedCareer}
          onClose={() => setSelectedCareer(null)}
          title={selectedCareer.title}
          description={selectedCareer.domain}
          maxWidth="lg"
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            {/* Modal Subtabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setDetailTab('overview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  detailTab === 'overview'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Role Overview
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('evidence')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  detailTab === 'evidence'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Market Evidence & Salaries
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('exploration')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  detailTab === 'exploration'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Practical Mini-Projects ({selectedCareer.practicalMiniProjects.length})
              </button>
            </div>

            {/* Tab 1: Overview */}
            {detailTab === 'overview' && (
              <div className="space-y-4 text-xs text-slate-700">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">Description</h4>
                  <p className="leading-relaxed text-slate-600">{selectedCareer.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">Everyday Key Activities</h4>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                    {selectedCareer.keyActivities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <h4 className="font-semibold text-slate-900">Education & Entry Requirements</h4>
                  <p>
                    <strong>Required Level:</strong> {selectedCareer.educationRequirement.level}
                  </p>
                  <p>
                    <strong>Typical Majors:</strong>{' '}
                    {selectedCareer.educationRequirement.typicalMajors.join(', ')}
                  </p>
                  <div>
                    <strong>Common Entry Pathways:</strong>
                    <ul className="pl-4 list-disc mt-1 space-y-1 text-slate-600">
                      {selectedCareer.entryPathways.map((path, i) => (
                        <li key={i}>{path}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
                  <h4 className="font-semibold text-amber-900 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Trade-offs & Uncertainties
                  </h4>
                  <ul className="pl-4 list-disc space-y-1 text-amber-800">
                    {selectedCareer.tradeoffsAndUncertainties.map((tradeoff, i) => (
                      <li key={i}>{tradeoff}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Evidence & Salaries */}
            {detailTab === 'evidence' && (
              <div className="space-y-5 text-xs text-slate-700">
                {/* Geographic Salary Data */}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Geographic Salary Benchmarks (Verified Sources)
                  </h4>
                  <div className="space-y-3">
                    {selectedCareer.evidence.salaryData.map((sal, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-900">
                          <span>{sal.geographicScope}</span>
                          <span className="text-emerald-700">
                            Median: {sal.currency} ${sal.median.toLocaleString()} / {sal.period}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 text-[11px]">
                          <span>
                            Range: ${sal.min.toLocaleString()} – ${sal.max.toLocaleString()}
                          </span>
                          <span>SOC Code / Standard: {sal.socCodeOrStandard}</span>
                        </div>
                        <div className="pt-1 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>
                            Source: <strong>{sal.sourceName}</strong> ({sal.publicationYear})
                          </span>
                          <a
                            href={sal.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            Verify Source <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employment Growth Outlook */}
                <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 space-y-1.5">
                  <h4 className="font-semibold text-indigo-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    Employment Outlook: {selectedCareer.evidence.employmentOutlook.geographicScope}
                  </h4>
                  <p className="text-indigo-800">
                    <strong>Growth Rate:</strong> {selectedCareer.evidence.employmentOutlook.growthRateText}
                  </p>
                  <p className="text-indigo-800">
                    <strong>Projected Openings:</strong> {selectedCareer.evidence.employmentOutlook.projectedOpeningsText}
                  </p>
                  <div className="text-[11px] text-indigo-600 pt-1 flex items-center justify-between">
                    <span>Source: {selectedCareer.evidence.employmentOutlook.sourceName} ({selectedCareer.evidence.employmentOutlook.publicationYear})</span>
                    <a
                      href={selectedCareer.evidence.employmentOutlook.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      Official Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Sample Roles & Job Postings */}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-600" />
                    Sample Representative Roles & Postings
                  </h4>
                  <div className="space-y-2.5">
                    {selectedCareer.evidence.sampleRolesOrJobPostings.map((job, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-200 bg-white space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{job.title}</span>
                          {job.isIllustrativeDemo ? (
                            <Badge variant="amber" size="sm">
                              Illustrative Demo Profile
                            </Badge>
                          ) : (
                            <Badge variant="emerald" size="sm">
                              Verified Posting
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {job.companyOrType} • {job.location}
                        </p>
                        <p className="text-[11px] text-slate-600 italic">{job.sourceNote}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Certifying Bodies & Reports */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <h4 className="font-semibold text-slate-900">Official Bodies & Industry Reports</h4>
                  <div className="space-y-1.5">
                    {selectedCareer.evidence.officialBodiesAndCertifications.map((body, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span>
                          {body.name} ({body.countryOrScope})
                        </span>
                        <a
                          href={body.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Limitations Note */}
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
                  <strong>Data Limitations Note:</strong> {selectedCareer.evidence.limitationsNote}
                </div>
              </div>
            )}

            {/* Tab 3: Exploration Mini-Projects */}
            {detailTab === 'exploration' && (
              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-500 text-xs">
                  Low-stakes, practical activities designed to test your real interest in this career without long-term commitment:
                </p>
                {selectedCareer.practicalMiniProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                      <Badge variant="violet" size="sm">
                        {proj.duration}
                      </Badge>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{proj.description}</p>
                    <span className="inline-block text-[10px] text-indigo-600 font-semibold uppercase tracking-wider pt-1">
                      Type: {proj.type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setSelectedCareer(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSelectCareer(selectedCareer.careerId, selectedCareer.title)}
              >
                Select as My Career Path <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <Modal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          title="Side-by-Side Career Comparison Matrix"
          description="Compare everyday tasks, geographic compensation, qualifications, and trade-offs"
          maxWidth="xl"
        >
          <div className="max-h-[75vh] overflow-y-auto space-y-4">
            {compareList.length < 2 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Please select at least 2 careers to compare.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="p-3 font-semibold text-slate-500 w-36">Attribute</th>
                      {compareList.map((c) => (
                        <th key={c.careerId} className="p-3 font-bold text-slate-900 min-w-48">
                          {c.title}
                          <span className="block text-[10px] font-normal text-slate-500">
                            {c.domain}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Summary</td>
                      {compareList.map((c) => (
                        <td key={c.careerId} className="p-3 leading-relaxed text-slate-600">
                          {c.summary}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">
                        Median Salary (US / Scope)
                      </td>
                      {compareList.map((c) => (
                        <td key={c.careerId} className="p-3 font-semibold text-emerald-700">
                          ${c.evidence.salaryData[0]?.median.toLocaleString()}/yr
                          <span className="block text-[10px] font-normal text-slate-500">
                            {c.evidence.salaryData[0]?.geographicScope}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">
                        Growth Outlook
                      </td>
                      {compareList.map((c) => (
                        <td key={c.careerId} className="p-3 font-medium text-slate-800">
                          {c.evidence.employmentOutlook.growthRateText}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">
                        Education Required
                      </td>
                      {compareList.map((c) => (
                        <td key={c.careerId} className="p-3 text-slate-700">
                          {c.educationRequirement.level}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">
                        Top Trade-off
                      </td>
                      {compareList.map((c) => (
                        <td key={c.careerId} className="p-3 text-amber-800 bg-amber-50/30">
                          {c.tradeoffsAndUncertainties[0] || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Actions</td>
                      {compareList.map((c) => (
                        <td key={c.careerId} className="p-3">
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => handleSelectCareer(c.careerId, c.title)}
                          >
                            Choose Role
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Suggest Custom Role Modal */}
      {isSuggestModalOpen && (
        <Modal
          isOpen={isSuggestModalOpen}
          onClose={() => setIsSuggestModalOpen(false)}
          title="Suggest Unlisted Career Role"
          description="Can't find your target role? Submit any career title across any domain."
          maxWidth="md"
        >
          <form onSubmit={handleSuggestCustom} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Career Role Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Genetic Counselor, Space Systems Engineer..."
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Broad Domain</label>
              <select
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {domains.filter((d) => d !== 'All Domains').map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Optional Notes or Stated Interests
              </label>
              <textarea
                rows={3}
                placeholder="Describe what this career entails or why you are drawn to it..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsSuggestModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmittingCustom}>
                Record Role Suggestion
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
