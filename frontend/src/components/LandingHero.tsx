import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  Lock, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Database
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { translations } from '../translations';

interface LandingHeroProps {
  language: SupportedLanguage;
  onUnderstandClick: () => void;
  onSearchSubmit: (query: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  language,
  onUnderstandClick,
  onSearchSubmit,
}) => {
  const t = translations[language];
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearchSubmit(searchVal.trim());
    }
  };

  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-50/60 via-slate-50/20 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Educational Tool • Non-Diagnostic • Privacy First</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {t.heroHeadline}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            {t.heroSubheadline}
          </p>

          {/* Call-to-action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onUnderstandClick}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              <span>{t.understandReportCTA}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#terminology-section"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-300 shadow-xs transition-all cursor-pointer"
            >
              <Search className="w-5 h-5 text-slate-500" />
              <span>{t.searchTermsCTA}</span>
            </a>
          </div>

          {/* Quick Terminology Search Bar on Hero */}
          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center shadow-md rounded-2xl border border-slate-200 bg-white p-1.5 focus-within:ring-2 focus-within:ring-teal-500">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Quick search terms: Hemoglobin, Creatinine, HbA1c, WBC..."
                className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Prominent Medical Safety Disclaimer Box */}
        <div id="safety-section" className="mt-12 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 sm:p-6 text-amber-950 flex items-start space-x-4 shadow-xs">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900">
                {t.disclaimerTitle}
              </h2>
              <p className="mt-1 text-sm text-amber-800/95 leading-relaxed">
                {t.disclaimerText}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-amber-800">
                <span className="bg-amber-100/90 px-2.5 py-1 rounded-md">⛔ Never Diagnoses Diseases</span>
                <span className="bg-amber-100/90 px-2.5 py-1 rounded-md">⛔ Never Prescribes or Recommends Medications</span>
                <span className="bg-amber-100/90 px-2.5 py-1 rounded-md">✓ Educational Definitions Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t.featuresTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Purpose-built architecture adhering to responsible AI and healthcare informatics standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{t.feature1Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.feature1Desc}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{t.feature2Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.feature2Desc}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{t.feature3Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.feature3Desc}</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{t.feature4Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.feature4Desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

