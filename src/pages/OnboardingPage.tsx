import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  GitCompare,
  Target,
  Search,
  AlertCircle,
  SkipForward,
  Check,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { careerService } from '../services/careerService';
import type { CareerProfile, DiscoveryResponses, CareerStatus } from '../types/career';

// Questionnaire step configuration
const SUBJECT_OPTIONS = [
  'Computer Science & Programming',
  'Mathematics & Statistics',
  'Psychology & Human Behavior',
  'Biology & Neuroscience',
  'Business, Economics & Finance',
  'Public Policy, Ethics & Law',
  'Creative Arts & Visual Design',
  'Mechanical & Electrical Engineering',
  'Environmental & Earth Sciences',
  'Writing, Literature & Communication',
];

const ACTIVITY_OPTIONS = [
  'Writing code & building digital tools',
  'Analyzing complex data to find hidden trends',
  'Listening empathetically & counseling people',
  'Designing visual graphics, interfaces & UX',
  'Drafting policy briefs & analyzing regulations',
  'Prototyping physical electronics or robotics',
  'Negotiating deals & evaluating business models',
  'Conducting scientific research & lab experiments',
  'Teaching, mentoring & explaining hard concepts',
  'Organizing teams & managing product timelines',
];

const DOMAIN_OPTIONS = [
  'Technology & Software',
  'AI, Data & Mathematics',
  'Cybersecurity & Infrastructure',
  'Healthcare & Life Sciences',
  'Business, Finance & Consulting',
  'Design, UX & Creative Media',
  'Public Policy, Law & Governance',
  'Robotics, Hardware & Engineering',
  'Education & Academic Research',
  'Other / Emerging Fields',
];

const WORK_STYLE_OPTIONS = [
  'Solving deep, abstract analytical problems',
  'Working directly with people and counseling',
  'Creative and open-ended design exploration',
  'Coordinating cross-functional team initiatives',
  'High-precision investigative or security analysis',
  'Practical hands-on lab or hardware engineering',
];

const ENVIRONMENT_OPTIONS = [
  '100% Remote or flexible asynchronous work',
  'Collaborative modern studio or office environment',
  'Clinical healthcare or hospital setting',
  'Fast-paced technology startup',
  'Government, civic institution or NGO',
  'Academic or corporate research laboratory',
];

const PRIORITY_OPTIONS = [
  'High earning potential & rapid compensation growth',
  'Positive social and human impact',
  'Predictable work-life balance and schedule flexibility',
  'Continuous learning and technical mastery',
  'High autonomy and decision-making freedom',
  'Prestige, leadership opportunities & career mobility',
];

const EDUCATION_OPTIONS = [
  { value: 'bachelor', label: "Bachelor's Degree (4 years)" },
  { value: 'masters', label: "Willing to pursue Master's Degree (1-2 years postgrad)" },
  { value: 'doctorate', label: 'Willing to pursue Doctorate / PhD or Medical Licensure' },
  { value: 'bootcamp', label: 'Self-taught, Certifications, or Accelerated Bootcamp' },
  { value: 'flexible', label: 'Flexible / Undecided on graduate study' },
];

const GEOGRAPHY_OPTIONS = [
  'United States (US National Market)',
  'India (Tier-1 Technology & Business Hubs)',
  'United Kingdom (NHS / UK National Market)',
  'Global / Remote International Opportunities',
  'Flexible / Open to relocation anywhere',
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  // Primary Path Selection: 'decided' | 'comparing' | 'undecided' | null
  const [selectedPath, setSelectedPath] = useState<CareerStatus | null>(null);

  // Catalog state for Decided & Comparing flows
  const [catalog, setCatalog] = useState<CareerProfile[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');

  // Path A (Decided) state
  const [chosenCareerId, setChosenCareerId] = useState<string>('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleTitle, setCustomRoleTitle] = useState('');
  const [customRoleDomain, setCustomRoleDomain] = useState('Technology & Software');

  // Path B (Comparing) state: 2 to 4 career IDs
  const [compareCareerIds, setCompareCareerIds] = useState<string[]>([]);

  // Path C (Undecided Questionnaire) wizard state
  const [questionnaireStep, setQuestionnaireStep] = useState(1);
  const [responses, setResponses] = useState<DiscoveryResponses>({
    favouriteSubjects: [],
    confidentActivities: [],
    broadInterests: [],
    workStyles: [],
    workEnvironments: [],
    careerPriorities: [],
    educationWillingness: 'bachelor',
    geographicPreferences: 'United States (US National Market)',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load catalog on mount
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await careerService.getCatalog();
        setCatalog(res.data);
        setDomains(['All Domains', ...res.domains]);
      } catch (err) {
        console.error('Error fetching catalog:', err);
      }
    };
    fetchCatalog();
  }, []);

  // Filter catalog based on domain and search
  const filteredCatalog = catalog.filter((c) => {
    const matchesDomain =
      selectedDomain === 'All Domains' || c.domain.toLowerCase().includes(selectedDomain.toLowerCase());
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      [
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
        .toLowerCase()
        .includes(q);
    return matchesDomain && matchesSearch;
  });

  // Toggle multi-select items in questionnaire
  const toggleArrayItem = (key: keyof DiscoveryResponses, item: string) => {
    setResponses((prev) => {
      const currentList = (prev[key] as string[]) || [];
      if (currentList.includes(item)) {
        return { ...prev, [key]: currentList.filter((i) => i !== item) };
      } else {
        return { ...prev, [key]: [...currentList, item] };
      }
    });
  };

  // Toggle career selection in comparing mode (max 4)
  const toggleCompareCareer = (id: string) => {
    setCompareCareerIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, id];
    });
  };

  // Submit Path A: Decided
  const handleConfirmDecided = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      if (isCustomRole) {
        if (!customRoleTitle.trim()) {
          setErrorMessage('Please enter a role title for your custom career.');
          setIsSubmitting(false);
          return;
        }
        await careerService.suggestCustomRole(customRoleTitle.trim(), customRoleDomain);
        await careerService.selectCareer(undefined, customRoleTitle.trim());
      } else {
        if (!chosenCareerId) {
          setErrorMessage('Please pick a career role from the catalog or enter a custom one.');
          setIsSubmitting(false);
          return;
        }
        await careerService.selectCareer(chosenCareerId);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to confirm career role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Path B: Comparing
  const handleConfirmComparing = async () => {
    if (compareCareerIds.length < 2) {
      setErrorMessage('Please select at least 2 careers to compare side-by-side.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      // Mark selected careers as exploring/shortlisted
      await Promise.all(
        compareCareerIds.map((id) => careerService.updateFeedback(id, 'exploring'))
      );
      navigate(`/discovery?mode=compare&careers=${compareCareerIds.join(',')}`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save career comparison.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Path C: Questionnaire
  const handleSubmitQuestionnaire = async (skipAll = false) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const payload = skipAll ? {} : responses;
      await careerService.submitDiscovery(payload, 'undecided');
      navigate('/discovery');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit discovery questionnaire.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">SkillPulse AI</h1>
            <p className="text-xs text-slate-500 mt-0.5">Career Guidance & Industry Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="text-xs text-slate-500 hover:text-slate-700 transition font-medium px-2 py-1"
          >
            Skip to Dashboard
          </Link>
          <Badge variant="indigo" size="sm" hasDot>
            Onboarding
          </Badge>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        {/* Step 1: 3-Choice Path Selection */}
        {!selectedPath && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
                <Compass className="w-3.5 h-3.5" />
                Step 1 of Onboarding
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Where are you in your career journey?
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                SkillPulse adapts to your current stage. Whether you have a precise dream role or have no idea where to start, we support every path.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Option 1: Decided */}
              <button
                type="button"
                onClick={() => setSelectedPath('decided')}
                className="group flex flex-col text-left p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1.5">
                  I know which career I want to pursue
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed flex-1">
                  Pick your target role across all domains or enter a custom title to start your role-specific skills tracker.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                  Select Role <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Comparing */}
              <button
                type="button"
                onClick={() => setSelectedPath('comparing')}
                className="group flex flex-col text-left p-6 rounded-xl border-2 border-slate-200 hover:border-violet-600 hover:bg-violet-50/30 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <GitCompare className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1.5">
                  I have a few careers in mind and want to compare
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed flex-1">
                  Choose 2 to 4 roles and see side-by-side matrices of salaries, everyday tasks, qualifications, and industry outlook.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-violet-600">
                  Compare Careers <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 3: Undecided / Discovery */}
              <button
                type="button"
                onClick={() => setSelectedPath('undecided')}
                className="group flex flex-col text-left p-6 rounded-xl border-2 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1.5">
                  I am not sure yet & want help discovering suitable careers
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed flex-1">
                  Answer a friendly, skippable questionnaire about your interests, work style, and preferences to uncover verified paths.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  Start Discovery <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                <strong>No permanent commitment required:</strong> You can change your career choice or explore other fields at any time directly from your dashboard settings.
              </p>
            </div>
          </div>
        )}

        {/* Path A: Decided Flow */}
        {selectedPath === 'decided' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedPath(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to choices
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Select Your Target Career Role
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Choose from our verified multi-domain catalog, or specify an unlisted custom career.
                </p>
              </div>
              <Badge variant="indigo">Path: Decided</Badge>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Custom Role vs Catalog Toggle */}
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => setIsCustomRole(false)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                  !isCustomRole
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Browse Catalog ({catalog.length} Roles)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCustomRole(true);
                  setChosenCareerId('');
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                  isCustomRole
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                + Enter Custom / Unlisted Role
              </button>
            </div>

            {!isCustomRole ? (
              <>
                {/* Search & Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search roles (e.g. Psychologist, Data Scientist)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    >
                      {domains.map((dom) => (
                        <option key={dom} value={dom}>
                          {dom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Catalog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 mb-6">
                  {filteredCatalog.map((c) => {
                    const isSelected = chosenCareerId === c.careerId;
                    return (
                      <div
                        key={c.careerId}
                        onClick={() => setChosenCareerId(c.careerId)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition text-left flex flex-col justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            )}
                          </div>
                          <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 mb-2">
                            {c.domain}
                          </span>
                          <p className="text-xs text-slate-600 line-clamp-2">{c.summary}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{c.evidence.salaryData[0]?.geographicScope || 'Global'}</span>
                          <span className="font-medium text-slate-700">
                            ${c.evidence.salaryData[0]?.median.toLocaleString()}/yr median
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Custom Role Input */
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bioinformatics Data Specialist, Environmental Consultant..."
                    value={customRoleTitle}
                    onChange={(e) => setCustomRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Broad Career Domain
                  </label>
                  <select
                    value={customRoleDomain}
                    onChange={(e) => setCustomRoleDomain(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {DOMAIN_OPTIONS.map((dom) => (
                      <option key={dom} value={dom}>
                        {dom}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your custom role will be immediately registered and set as your target. SkillPulse will adapt your dashboard and track progress toward it.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setSelectedPath(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmDecided}
                isLoading={isSubmitting}
                disabled={!isCustomRole && !chosenCareerId}
              >
                Confirm Career & Continue to Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* Path B: Comparing Flow */}
        {selectedPath === 'comparing' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedPath(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to choices
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Select 2 to 4 Careers to Compare
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Choose multiple paths from across all domains. You will see an evidence-backed comparison matrix.
                </p>
              </div>
              <Badge variant="violet">
                {compareCareerIds.length} / 4 Selected
              </Badge>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Selected Chips */}
            {compareCareerIds.length > 0 && (
              <div className="mb-4 p-3 bg-violet-50/60 border border-violet-100 rounded-xl flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-violet-900">Selected for comparison:</span>
                {compareCareerIds.map((id) => {
                  const career = catalog.find((c) => c.careerId === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-violet-200 text-xs text-violet-800 font-medium shadow-2xs"
                    >
                      {career?.title || id}
                      <button
                        type="button"
                        onClick={() => toggleCompareCareer(id)}
                        className="hover:text-rose-500 ml-1 text-slate-400"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 mb-6">
              {catalog.map((c) => {
                const isChecked = compareCareerIds.includes(c.careerId);
                return (
                  <div
                    key={c.careerId}
                    onClick={() => toggleCompareCareer(c.careerId)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition text-left flex flex-col justify-between ${
                      isChecked
                        ? 'border-violet-600 bg-violet-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-violet-600 border-violet-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 mb-1.5">
                        {c.domain}
                      </span>
                      <p className="text-xs text-slate-600 line-clamp-2">{c.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setSelectedPath(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmComparing}
                isLoading={isSubmitting}
                disabled={compareCareerIds.length < 2}
              >
                Launch Side-by-Side Comparison ({compareCareerIds.length})
              </Button>
            </div>
          </div>
        )}

        {/* Path C: Undecided Skippable Questionnaire */}
        {selectedPath === 'undecided' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-200">
            {/* Header with Progress */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedPath(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to choices
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Career Discovery Questionnaire
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Step {questionnaireStep} of 5 — Every question is skippable
                </p>
              </div>
              <div className="text-right">
                <Badge variant="emerald">
                  Question {questionnaireStep} / 5
                </Badge>
                <button
                  type="button"
                  onClick={() => handleSubmitQuestionnaire(true)}
                  className="block text-[11px] text-slate-500 hover:text-indigo-600 mt-1 font-medium"
                >
                  Skip All & Explore All Roles →
                </button>
              </div>
            </div>

            {/* Disclaimer Alert */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 mb-6 flex items-start gap-2.5 text-xs text-emerald-900 leading-relaxed">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Exploratory Guidance Notice:</strong> These questions help our transparent matching engine surface suitable career fields based on your stated interests. This is exploratory guidance, not a psychological test or guarantee of career success.
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Questionnaire Step 1: Subjects */}
            {questionnaireStep === 1 && (
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  1. Which academic subjects or topics do you genuinely enjoy?
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Select any subjects you find engaging. This helps identify transferable foundational knowledge.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                  {SUBJECT_OPTIONS.map((sub) => {
                    const isSelected = responses.favouriteSubjects?.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleArrayItem('favouriteSubjects', sub)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-semibold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{sub}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Questionnaire Step 2: Activities & Skills */}
            {questionnaireStep === 2 && (
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  2. What activities do you enjoy and feel confident doing?
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Focus on what feels energizing or natural to you.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                  {ACTIVITY_OPTIONS.map((act) => {
                    const isSelected = responses.confidentActivities?.includes(act);
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => toggleArrayItem('confidentActivities', act)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-semibold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{act}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Questionnaire Step 3: Broad Domains */}
            {questionnaireStep === 3 && (
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  3. Which broad industry domains appeal to you?
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  We cover all career areas — not just technology. Select anything that sounds intriguing.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                  {DOMAIN_OPTIONS.map((dom) => {
                    const isSelected = responses.broadInterests?.includes(dom);
                    return (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => toggleArrayItem('broadInterests', dom)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-semibold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{dom}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Questionnaire Step 4: Working Style & Environment */}
            {questionnaireStep === 4 && (
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  4. How and where do you prefer to work?
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Your work environment significantly impacts long-term job satisfaction.
                </p>

                <div className="mb-4">
                  <span className="block text-xs font-semibold text-slate-700 mb-2">Preferred Working Style:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {WORK_STYLE_OPTIONS.map((ws) => {
                      const isSelected = responses.workStyles?.includes(ws);
                      return (
                        <button
                          key={ws}
                          type="button"
                          onClick={() => toggleArrayItem('workStyles', ws)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-violet-50 border-violet-600 text-violet-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span>{ws}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-2">Preferred Environment:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ENVIRONMENT_OPTIONS.map((env) => {
                      const isSelected = responses.workEnvironments?.includes(env);
                      return (
                        <button
                          key={env}
                          type="button"
                          onClick={() => toggleArrayItem('workEnvironments', env)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-violet-50 border-violet-600 text-violet-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span>{env}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Questionnaire Step 5: Priorities & Geography */}
            {questionnaireStep === 5 && (
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  5. Career Priorities & Education Willingness
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Helps us weigh trade-offs and salary expectations against required degree commitments.
                </p>

                <div className="mb-4">
                  <span className="block text-xs font-semibold text-slate-700 mb-2">Top Career Priorities:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRIORITY_OPTIONS.map((p) => {
                      const isSelected = responses.careerPriorities?.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => toggleArrayItem('careerPriorities', p)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span>{p}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Willingness to Pursue Further Education:
                    </label>
                    <select
                      value={responses.educationWillingness}
                      onChange={(e) =>
                        setResponses((prev) => ({ ...prev, educationWillingness: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    >
                      {EDUCATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Geographic Region of Primary Interest:
                    </label>
                    <select
                      value={responses.geographicPreferences}
                      onChange={(e) =>
                        setResponses((prev) => ({ ...prev, geographicPreferences: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    >
                      {GEOGRAPHY_OPTIONS.map((geo) => (
                        <option key={geo} value={geo}>
                          {geo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
              <div>
                {questionnaireStep > 1 ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setQuestionnaireStep((s) => s - 1)}
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPath(null)}>
                    Cancel
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {questionnaireStep < 5 ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuestionnaireStep((s) => s + 1)}
                    >
                      Skip Question <SkipForward className="w-3.5 h-3.5 ml-1" />
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setQuestionnaireStep((s) => s + 1)}
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSubmitQuestionnaire(true)}
                    >
                      Skip & Explore
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleSubmitQuestionnaire(false)}
                      isLoading={isSubmitting}
                    >
                      Generate Recommendations (Rule-Based Matching) <Sparkles className="w-4 h-4 ml-1.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="text-center py-4 border-t border-slate-200/60 bg-white/50 text-[11px] text-slate-400">
        SkillPulse AI — Multi-Domain Career Intelligence Platform. Data sourced from US BLS, UK NHS, and official professional bodies.
      </footer>
    </div>
  );
};
