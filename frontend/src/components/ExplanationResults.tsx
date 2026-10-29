import React from 'react';
import { 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  HelpCircle, 
  ExternalLink, 
  BookOpen, 
  Cpu, 
  Printer, 
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  ExplanationResponse, 
  LabTestExplanation, 
  SupportedLanguage 
} from '../types';
import { translations } from '../translations';

interface ExplanationResultsProps {
  language: SupportedLanguage;
  data: ExplanationResponse;
  onReset: () => void;
  onOpenChat: () => void;
}

export const ExplanationResults: React.FC<ExplanationResultsProps> = ({
  language,
  data,
  onReset,
  onOpenChat,
}) => {
  const t = translations[language];

  const getStatusBadge = (status: LabTestExplanation['comparison_status']) => {
    switch (status) {
      case 'within_range':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.withinRange}</span>
          </span>
        );
      case 'above_range':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.aboveRange}</span>
          </span>
        );
      case 'below_range':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300">
            <ArrowDownRight className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.belowRange}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.unspecifiedRange}</span>
          </span>
        );
    }
  };

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md mb-2">
              <Cpu className="w-3.5 h-3.5 text-teal-600" />
              <span>{data.provider_label}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.resultsTitle}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t.resultsSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Summary</span>
            </button>
            <button
              onClick={onOpenChat}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask AI Follow-Up</span>
            </button>
            <button
              onClick={onReset}
              className="inline-flex items-center space-x-1 px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
              title="Start Over"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Report</span>
            </button>
          </div>
        </div>

        {/* Global Medical Disclaimer Banner */}
        <div className="mb-8 p-4 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-start space-x-3 text-teal-950 text-xs">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {data.disclaimer}
          </p>
        </div>

        {/* Test Explanation Cards */}
        <div className="space-y-6">
          {data.explanations.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-colors"
            >
              {/* Card Top: Test Title, Extracted Value, Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {exp.test_name}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500 font-mono">
                    <span>Printed Reference Range: <strong className="text-slate-700 font-medium">{exp.reference_range}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                      {exp.extracted_value}
                    </span>
                    <span className="text-xs font-medium text-slate-500 ml-1.5 font-mono">
                      {exp.unit}
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(exp.comparison_status)}
                  </div>
                </div>
              </div>

              {/* Range comparison note */}
              <div className="py-3 px-4 my-4 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200/70 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{exp.comparison_note}</span>
              </div>

              {/* 3 Explanation Quadrants: Measures, Why Ordered, Limitations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs text-slate-600">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1.5 uppercase tracking-wider text-[11px] text-teal-800">
                    {t.measuresLabel}
                  </span>
                  <p className="leading-relaxed text-slate-700">
                    {exp.what_it_measures}
                  </p>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1.5 uppercase tracking-wider text-[11px] text-teal-800">
                    {t.whyOrderedLabel}
                  </span>
                  <p className="leading-relaxed text-slate-700">
                    {exp.why_ordered}
                  </p>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1.5 uppercase tracking-wider text-[11px] text-slate-700">
                    {t.limitationsLabel}
                  </span>
                  <p className="leading-relaxed text-slate-600 italic">
                    {exp.interpretive_limitations}
                  </p>
                </div>
              </div>

              {/* MedlinePlus Verified Link */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-500">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Source: {exp.source_attribution}</span>
                </div>
                <a
                  href={exp.medline_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                >
                  <span>{exp.medline_title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

