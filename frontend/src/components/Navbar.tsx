import React from 'react';
import { Activity, ShieldCheck, Settings, MessageSquare, Globe, Cpu } from 'lucide-react';
import { SupportedLanguage, HealthStatus } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  health: HealthStatus | null;
  onOpenSettings: () => void;
  onOpenChat: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  health,
  onOpenSettings,
  onOpenChat,
  onNavigate,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => onNavigate('hero')}
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              LabLens
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Hacktoberfest
              </span>
            </span>
            <p className="text-xs text-slate-500 font-medium -mt-0.5">{t.tagline}</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
          <button 
            onClick={() => onNavigate('upload-section')} 
            className="hover:text-teal-600 transition-colors cursor-pointer"
          >
            {t.understandReportCTA}
          </button>
          <button 
            onClick={() => onNavigate('terminology-section')} 
            className="hover:text-teal-600 transition-colors cursor-pointer"
          >
            {t.searchTermsCTA}
          </button>
          <button 
            onClick={() => onNavigate('references-section')} 
            className="hover:text-teal-600 transition-colors cursor-pointer"
          >
            MedlinePlus
          </button>
          <button 
            onClick={() => onNavigate('safety-section')} 
            className="hover:text-teal-600 transition-colors cursor-pointer"
          >
            Safety & Privacy
          </button>
        </nav>

        {/* Actions & Status */}
        <div className="flex items-center space-x-3">
          {/* AI Provider Status Pill */}
          <button
            onClick={onOpenSettings}
            className="hidden sm:flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
            title="Click to configure AI providers"
          >
            <span className={`w-2 h-2 rounded-full ${health?.ollama_available ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-500 ring-2 ring-amber-200'}`}></span>
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {health?.ollama_available ? `Ollama (${health.available_models[0] || health.configured_model})` : 'Curated Engine'}
            </span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs font-medium">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-md transition-all ${language === 'en' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-0.5 rounded-md transition-all ${language === 'hi' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLanguageChange('or')}
              className={`px-2 py-0.5 rounded-md transition-all ${language === 'or' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>

          {/* Ask AI Button */}
          <button
            onClick={onOpenChat}
            className="inline-flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="AI Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

