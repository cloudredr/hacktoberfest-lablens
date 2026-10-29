import React from 'react';
import { X, Cpu, Cloud, ShieldCheck, CheckCircle2, AlertCircle, Terminal, HelpCircle } from 'lucide-react';
import { HealthStatus, SupportedLanguage } from '../types';
import { translations } from '../translations';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: HealthStatus | null;
  language: SupportedLanguage;
  allowCloudConsent: boolean;
  onToggleCloudConsent: (val: boolean) => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({
  isOpen,
  onClose,
  health,
  language,
  allowCloudConsent,
  onToggleCloudConsent,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t.settingsTitle}</h3>
              <p className="text-xs text-slate-500">
                Manage local Ollama and optional Google Gemini cloud processing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Primary Provider: Ollama */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${health?.ollama_available ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <h4 className="text-sm font-bold text-slate-900">{t.localAILabel}</h4>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${health?.ollama_available ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                {health?.ollama_available ? 'Service Online' : 'Offline / Standalone'}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5">
              <p>
                <strong>Configured Primary Model:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">{health?.configured_model || 'gemma4:12b'}</code>
              </p>
              <p>
                <strong>Discovered Local Models:</strong> {health?.available_models && health.available_models.length > 0 ? (
                  <span className="text-slate-800 font-mono font-medium">{health.available_models.join(', ')}</span>
                ) : (
                  <span className="text-slate-500 italic">None detected</span>
                )}
              </p>
            </div>

            {/* Setup instructions for MedGemma */}
            <div className="mt-4 pt-3 border-t border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1 mb-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>How to pull MedGemma locally:</span>
              </span>
              <div className="bg-slate-900 text-slate-100 text-[11px] font-mono p-2.5 rounded-xl flex items-center justify-between">
                <code>ollama pull gemma4:12b</code>
                <span className="text-[10px] text-slate-400">Terminal Command</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                After pulling, LabLens will use Gemma 4 12B when Ollama is available. Otherwise, LabLens uses its curated MedlinePlus provider.
              </p>
            </div>
          </div>

          {/* Optional Gemini cloud provider */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Google Gemini 3.8 Flash</h4>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${health?.gemini_configured ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                }`}>
                {health?.gemini_configured ? 'API Configured' : 'API Key Needed'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Gemini can read uploaded PNG/JPEG lab-report images and answer Ask AI chat questions. It is used only when cloud consent is enabled; otherwise chat stays on local Ollama. OpenAI remains an optional fallback only when Ollama is unavailable.
            </p>
            <p className="text-xs text-slate-600 mb-3">
              OpenAI fallback: {health?.openai_configured ? 'API configured' : 'Not configured'}
            </p>

            <label className="flex items-start space-x-2.5 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={allowCloudConsent}
                onChange={(e) => onToggleCloudConsent(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 mt-0.5 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  Allow Gemini and other configured cloud AI
                </span>
                <span className="text-slate-600 block mt-0.5">
                  If enabled, uploaded images and chat messages may be sent to Google Gemini, including any identifying details visible in the report. Images are not de-identified before sending. If Ollama is unavailable, the existing OpenAI fallback may also receive lab values. Uncheck to keep chat local and disable Gemini image scanning.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
