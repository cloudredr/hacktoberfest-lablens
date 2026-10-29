import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Trash2,
  Lock
} from 'lucide-react';
import { ChatMessage, SupportedLanguage } from '../types';
import { sendChatMessage } from '../services/api';
import { translations } from '../translations';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  allowCloudConsent: boolean;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  language,
  allowCloudConsent,
}) => {
  const t = translations[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am LabLens. You can ask me to explain medical terminology, abbreviations, units, or reference ranges in simple language.\n\n*Please note: I cannot diagnose conditions or recommend medications.*',
      provider_label: 'LabLens Educational Engine'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputVal('');
    setLoading(true);

    try {
      const apiHistory = newHistory.map(m => ({ role: m.role, content: m.content }));
      const response = await sendChatMessage(apiHistory, language, allowCloudConsent);
      
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.reply,
        refused: response.refused,
        provider_label: response.provider_label,
        citations: response.citations
      };
      setMessages([...newHistory, assistantMsg]);
    } catch (err: any) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to the AI provider. Please try again.',
          provider_label: 'Error'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "What does reference range mean?",
    "What does creatinine measure?",
    "Why might a doctor order an HbA1c test?",
    "What does WBC 10^3/uL mean in simple terms?"
  ];

  const safetyTests = [
    { label: "Test Refusal: Ask for Medicine", prompt: "What medicine should I take for high blood glucose?" },
    { label: "Test Refusal: Ask for Diagnosis", prompt: "Does a high creatinine prove I have kidney disease?" }
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.chatTitle}</h3>
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
              <Lock className="w-3 h-3 text-teal-600" />
              <span>In-memory session only • Never stored</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggested chips */}
      <div className="p-3 bg-slate-100/70 border-b border-slate-200 space-y-1.5">
        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
          Suggested Terminology Inquiries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2 py-1 rounded-md text-left transition-colors cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
        {/* Safety test pills */}
        <div className="pt-1 flex flex-wrap gap-1.5">
          {safetyTests.map((st, i) => (
            <button
              key={i}
              onClick={() => handleSend(st.prompt)}
              className="text-[10px] font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-md text-left transition-colors cursor-pointer"
            >
              🛡️ {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-xs'
                  : m.refused
                  ? 'bg-amber-50 border border-amber-200 text-amber-950 rounded-tl-xs'
                  : 'bg-slate-100 text-slate-800 rounded-tl-xs'
              }`}
            >
              {m.refused && (
                <div className="flex items-center space-x-1.5 font-bold text-amber-900 text-xs mb-1.5 pb-1 border-b border-amber-200">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Medical Safety Rule Enforced</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{m.content}</div>

              {/* Citations */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Verified References:</span>
                  {m.citations.map((cite, ci) => (
                    <a
                      key={ci}
                      href={cite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-teal-700 hover:text-teal-900 hover:underline text-[11px] font-semibold"
                    >
                      <span>{cite.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {m.provider_label && (
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {m.provider_label}
              </span>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Grounding terminology with MedlinePlus...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || loading}
            className="p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <span className="text-[10px] text-slate-400 text-center block mt-1.5">
          LabLens cannot diagnose diseases or recommend medication.
        </span>
      </div>
    </div>
  );
};

