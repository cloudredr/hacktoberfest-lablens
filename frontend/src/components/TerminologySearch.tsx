import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, BookOpen, AlertCircle, Info, Tag } from 'lucide-react';
import { TerminologyItem, SupportedLanguage } from '../types';
import { searchTerminology } from '../services/api';
import { translations } from '../translations';

interface TerminologySearchProps {
  language: SupportedLanguage;
  initialQuery?: string;
}

export const TerminologySearch: React.FC<TerminologySearchProps> = ({
  language,
  initialQuery = '',
}) => {
  const t = translations[language];
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<TerminologyItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTerms(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchTerms = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchTerminology(q);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search terminology');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Complete Blood Count', 'Kidney Function / Metabolic Panel', 'Metabolic Panel / Diabetes', 'Lipid Panel', 'Thyroid Panel', 'Liver Function'];

  const filteredResults = selectedCategory === 'All' 
    ? results 
    : results.filter(r => r.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <section id="terminology-section" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-800 bg-teal-100/80 px-2.5 py-1 rounded-md mb-3">
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            <span>MedlinePlus Grounded Dictionary</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Laboratory Terminology & Reference Explorer
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Look up any medical test, abbreviation, or lab parameter to understand what it measures and why clinicians commonly order it.
          </p>
        </div>

        {/* Search input and category filter */}
        <div className="space-y-4 mb-8">
          <div className="relative max-w-2xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by test name (e.g. Hemoglobin, HbA1c, Creatinine) or abbreviation (e.g. WBC, PLT, TSH)..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl shadow-xs text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="py-12 text-center text-slate-500 text-sm">
            <div className="inline-block w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p>Searching verified medical terminology...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && filteredResults.length === 0 && (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-800">No laboratory terms found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              We couldn't find a verified test matching "{query}". Try searching for common terms like "Creatinine", "Hemoglobin", "HbA1c", or "WBC".
            </p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((item) => (
            <div
              key={item.term}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {item.test_name}
                  </h3>
                  <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded-md shrink-0">
                    {item.category.split('/')[0].trim()}
                  </span>
                </div>

                {item.abbreviations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.abbreviations.map((abbr) => (
                      <span key={abbr} className="text-xs bg-slate-100 text-slate-600 font-mono font-medium px-2 py-0.5 rounded">
                        {abbr}
                      </span>
                    ))}
                    {item.common_units.map((unit) => (
                      <span key={unit} className="text-xs bg-blue-50 text-blue-700 font-mono px-2 py-0.5 rounded">
                        {unit}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  {item.plain_definition}
                </p>

                <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5">What it measures:</span>
                    <span>{item.what_it_measures}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5">Why clinicians order it:</span>
                    <span>{item.why_ordered}</span>
                  </div>
                  {item.limitations && (
                    <div>
                      <span className="font-semibold text-slate-800 block mb-0.5">Key limitations:</span>
                      <span className="text-slate-500 italic">{item.limitations}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* MedlinePlus Link */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <a
                  href={item.medline_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                >
                  <span>Official MedlinePlus Reference</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

