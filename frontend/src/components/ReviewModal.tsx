import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Lock, 
  ShieldCheck, 
  Sparkles,
  Pill
} from 'lucide-react';
import { 
  LabTestItem, 
  DoctorPrescriptionItem, 
  SupportedLanguage 
} from '../types';
import { translations } from '../translations';

interface ReviewModalProps {
  language: SupportedLanguage;
  tests: LabTestItem[];
  doctorPrescriptions: DoctorPrescriptionItem[];
  warning?: string | null;
  onConfirm: (validatedTests: LabTestItem[], allowCloudConsent: boolean) => void;
  onCancel: () => void;
  loading: boolean;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  language,
  tests: initialTests,
  doctorPrescriptions,
  warning,
  onConfirm,
  onCancel,
  loading,
}) => {
  const t = translations[language];
  const [items, setItems] = useState<LabTestItem[]>(initialTests);
  const [allowCloudConsent, setAllowCloudConsent] = useState(false);

  const handleUpdate = (idx: number, field: keyof LabTestItem, val: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: val };
    setItems(updated);
  };

  const handleRemove = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    setItems([
      ...items,
      { name: '', value: '', unit: '', reference_range: '', flag: '', confidence_status: 'verified' }
    ]);
  };

  const handleSave = () => {
    const valid = items.filter(it => it.name.trim() && it.value.trim());
    onConfirm(valid, allowCloudConsent);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Review Extracted Parameters</h3>
              <p className="text-xs text-slate-500">
                Verify that test names, values, and reference ranges match your printed report before generating explanations.
              </p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {warning && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{warning}</span>
            </div>
          )}

          {/* Test items table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-100/75 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-3.5 py-3">Test Name</th>
                    <th className="px-3.5 py-3 w-28">Result Value</th>
                    <th className="px-3.5 py-3 w-24">Unit</th>
                    <th className="px-3.5 py-3 w-36">Printed Ref Range</th>
                    <th className="px-3.5 py-3 w-24">Flag (H/L)</th>
                    <th className="px-3.5 py-3 w-24">Status</th>
                    <th className="px-3.5 py-3 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {items.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-medium border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) => handleUpdate(idx, 'value', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.unit}
                          onChange={(e) => handleUpdate(idx, 'unit', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.reference_range}
                          onChange={(e) => handleUpdate(idx, 'reference_range', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.flag || ''}
                          onChange={(e) => handleUpdate(idx, 'flag', e.target.value)}
                          placeholder="Optional"
                          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.confidence_status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {row.confidence_status === 'verified' ? 'Verified' : 'Review Required'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleRemove(idx)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctor-Authored Medication Prescriptions Preview (Isolated from lab values) */}
          {doctorPrescriptions.length > 0 && (
            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs mb-2">
                <Pill className="w-4 h-4 text-purple-700" />
                <span>Doctor-Authored Prescription Notes Detected in Document (Isolated)</span>
              </div>
              <p className="text-xs text-purple-800/90 mb-3">
                The following medicines were identified strictly from doctor-written instructions. They will be displayed in an isolated reference section with official MedlinePlus information.
              </p>
              <div className="space-y-1.5">
                {doctorPrescriptions.map((rx, i) => (
                  <div key={i} className="text-xs bg-white border border-purple-200 rounded-lg p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-purple-950">{rx.medicine_name}</span>
                      <span className="text-[11px] text-slate-500 ml-2 font-mono">({rx.raw_snippet})</span>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                      Doctor Prescription
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy & Cloud Fallback Consent Gate */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">
                  Data Processing & Cloud AI Privacy Consent
                </p>
                <p className="text-slate-600">
                  By default, LabLens processes your reports locally using MedGemma on Ollama or local verified knowledge bases. No personal identifiers or report files leave your computer.
                </p>
                <label className="flex items-center space-x-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allowCloudConsent}
                    onChange={(e) => setAllowCloudConsent(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="text-slate-800 font-medium">
                    {t.consentCheckbox}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel / Back to Upload
          </button>
          <button
            onClick={handleSave}
            disabled={loading || items.length === 0}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-600/25 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Generating Explanations...' : 'Generate Explanations'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

