import React from 'react';
import { ExternalLink, BookOpen, ShieldCheck, Check } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface MedicalReferencePanelProps {
  language: SupportedLanguage;
}

export const MedicalReferencePanel: React.FC<MedicalReferencePanelProps> = ({ language }) => {
  const references = [
    {
      title: "MedlinePlus Medical Test Directory",
      organization: "National Library of Medicine (NLM), NIH",
      url: "https://medlineplus.gov/lab-tests/",
      description: "Official public health library explaining what medical tests are, why they are ordered, how to prepare, and what the results indicate.",
      category: "Laboratory Tests",
      verifiedDate: "October 2026"
    },
    {
      title: "MedlinePlus Health Topics A-Z",
      organization: "National Library of Medicine (NLM), NIH",
      url: "https://medlineplus.gov/healthtopics.html",
      description: "Comprehensive medical encyclopedic references for wellness, diseases, and physiological systems.",
      category: "General Health",
      verifiedDate: "October 2026"
    },
    {
      title: "MedlinePlus Drug Information Service",
      organization: "American Society of Health-System Pharmacists & NLM",
      url: "https://medlineplus.gov/druginformation.html",
      description: "Authoritative patient drug information on prescription and over-the-counter medicines, potential interactions, and side effects.",
      category: "Medication Reference",
      verifiedDate: "October 2026"
    },
    {
      title: "MedlinePlus Connect & Web Services",
      organization: "U.S. National Library of Medicine",
      url: "https://medlineplus.gov/about/developers/webservices/",
      description: "Developer API guidelines and terminology standards (LOINC, SNOMED CT, RxNorm) for clinical health topic linkage.",
      category: "Standards & Developer APIs",
      verifiedDate: "October 2026"
    }
  ];

  return (
    <section id="references-section" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-800 bg-teal-100/80 px-2.5 py-1 rounded-md mb-3">
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            <span>Authoritative Sources</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Verified Medical Reference Directory
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            LabLens strictly relies on official references published by the U.S. National Library of Medicine (NLM). We never fabricate article titles, citations, or URLs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {references.map((ref, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60">
                    {ref.category}
                  </span>
                  <div className="flex items-center space-x-1 text-[11px] text-emerald-700 font-medium">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Verified {ref.verifiedDate}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {ref.title}
                </h3>
                <span className="text-xs text-slate-500 font-medium block mb-3">
                  {ref.organization}
                </span>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {ref.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline"
                >
                  <span>Visit Official MedlinePlus Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-slate-100 rounded-2xl text-xs text-slate-500 text-center">
          MedlinePlus is a registered trademark of the U.S. National Library of Medicine. Use of MedlinePlus resources does not imply endorsement of LabLens by the NLM or the U.S. Government.
        </div>
      </div>
    </section>
  );
};

