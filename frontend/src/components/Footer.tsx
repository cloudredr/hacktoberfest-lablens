import React from 'react';
import { Activity, Heart, ExternalLink, Code2 } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface FooterProps {
  language: SupportedLanguage;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">LabLens</span>
              <p className="text-slate-500 text-[11px]">AI-Powered Medical Report Explainer • Hacktoberfest</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-300">
            <a href="#hero" className="hover:text-teal-400 transition-colors">Home</a>
            <a href="#upload-section" className="hover:text-teal-400 transition-colors">Understand Report</a>
            <a href="#terminology-section" className="hover:text-teal-400 transition-colors">Terminology</a>
            <a href="#references-section" className="hover:text-teal-400 transition-colors">MedlinePlus</a>
            <a href="#safety-section" className="hover:text-teal-400 transition-colors">Medical Safety</a>
          </div>
        </div>

        {/* Disclaimer & Attribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
          <div>
            <span className="text-slate-300 font-semibold block mb-1">Clinical Safety & Non-Diagnostic Notice</span>
            <p className="text-slate-500">
              LabLens is strictly an educational tool and does not provide clinical diagnoses, medical care, or medication prescriptions. Any laboratory result marked out of range requires evaluation by a licensed healthcare professional in the context of symptoms and medical history.
            </p>
          </div>
          <div>
            <span className="text-slate-300 font-semibold block mb-1">Attribution & Privacy Guarantee</span>
            <p className="text-slate-500">
              Laboratory test descriptions and drug information are derived from official MedlinePlus services provided by the U.S. National Library of Medicine. All processing is privacy-first, executed locally through Ollama whenever available, with zero third-party telemetry.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
          <p>© 2026 LabLens Open-Source Community. Built with responsible AI for Hacktoberfest.</p>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Built with care for public health literacy</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
