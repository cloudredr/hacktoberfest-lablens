import React, { useState } from 'react';
import { Pill, ExternalLink, ShieldCheck, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { DoctorPrescriptionItem, SupportedLanguage } from '../types';
import { verifyMedicine } from '../services/api';
import { translations } from '../translations';

interface DoctorMedicationsProps {
  language: SupportedLanguage;
  prescriptions: DoctorPrescriptionItem[];
}

export const DoctorMedications: React.FC<DoctorMedicationsProps> = ({
  language,
  prescriptions: initialPrescriptions,
}) => {
  const t = translations[language];
  const [items, setItems] = useState<DoctorPrescriptionItem[]>(initialPrescriptions);
  const [verifyingIdx, setVerifyingIdx] = useState<number | null>(null);

  if (items.length === 0) {
    return null;
  }

  const handleVerifyName = async (idx: number, name: string) => {
    setVerifyingIdx(idx);
    try {
      const res = await verifyMedicine(name);
      const updated = [...items];
      updated[idx] = {
        ...updated[idx],
        medicine_name: res.medicine_name,
        verification_status: res.verified ? 'verified' : 'unverified',
        medline_url: res.medline_url,
        medline_title: res.medline_title,
        educational_note: res.educational_note,
      };
      setItems(updated);
    } catch {
      // Keep previous
    } finally {
      setVerifyingIdx(null);
    }
  };

  return (
    <section className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-purple-50/50 rounded-3xl border border-purple-200/80 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-950 tracking-tight">
                {t.doctorMedsTitle}
              </h3>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                Strict Doctor Prescription Extraction Only (Rule 2.3)
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-purple-900/85 leading-relaxed max-w-4xl mb-6">
            {t.doctorMedsDesc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((med, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-slate-900">
                      {med.medicine_name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      med.verification_status === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {med.verification_status === 'verified' ? 'MedlinePlus Verified' : 'Verification Required'}
                    </span>
                  </div>

                  <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600 font-mono mb-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Report Snippet:</span>
                    {med.raw_snippet}
                  </div>

                  {med.educational_note && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {med.educational_note}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {med.medline_url ? (
                    <a
                      href={med.medline_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
                    >
                      <span>Official Drug Information</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-amber-700 font-medium">
                      No matching MedlinePlus drug-information page could be verified.
                    </span>
                  )}

                  <button
                    onClick={() => {
                      const newName = prompt('Verify / edit medicine name for lookup:', med.medicine_name);
                      if (newName && newName.trim()) {
                        handleVerifyName(idx, newName.trim());
                      }
                    }}
                    disabled={verifyingIdx === idx}
                    className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    {verifyingIdx === idx ? 'Checking...' : 'Edit / Re-verify'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-purple-200/60 text-[11px] text-purple-800/80 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              LabLens does not recommend or evaluate medication regimens. Consult your prescribing physician for dosage, safety, and treatment guidance.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

