import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Edit3, 
  Sparkles, 
  AlertCircle, 
  Plus, 
  Trash2,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { 
  DocumentExtractionResponse, 
  LabTestItem, 
  SupportedLanguage 
} from '../types';
import { 
  uploadReportFile, 
  manualReportExtraction, 
  fetchSampleReports, 
  loadSampleReport 
} from '../services/api';
import { translations } from '../translations';

interface ReportUploadProps {
  language: SupportedLanguage;
  onExtracted: (data: DocumentExtractionResponse) => void;
  allowCloudConsent: boolean;
  onToggleCloudConsent: (allowed: boolean) => void;
}

export const ReportUpload: React.FC<ReportUploadProps> = ({
  language,
  onExtracted,
  allowCloudConsent,
  onToggleCloudConsent,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'samples' | 'upload' | 'manual'>('samples');
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample reports state
  const [samples, setSamples] = useState<Record<string, { title: string; description: string; text: string }>>({});
  const [loadingSamples, setLoadingSamples] = useState(false);

  // Manual entry state
  const [manualTests, setManualTests] = useState<LabTestItem[]>([
    { name: 'Hemoglobin', value: '11.2', unit: 'g/dL', reference_range: '12.0 - 16.0', flag: 'L', confidence_status: 'verified' },
    { name: 'White Blood Cell Count', value: '6.8', unit: '10^3/uL', reference_range: '4.5 - 11.0', flag: 'Normal', confidence_status: 'verified' },
    { name: 'Platelets', value: '135', unit: '10^3/uL', reference_range: '150 - 450', flag: 'L', confidence_status: 'verified' },
  ]);

  useEffect(() => {
    fetchSampleReports()
      .then(setSamples)
      .catch(() => {});
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    setError(null);
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    if (!validExtensions.includes(ext)) {
      setError(`Unsupported file type '.${ext}'. Please upload a PDF, PNG, or JPEG file.`);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }
    setFile(selectedFile);
  };

  const handleProcessUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await uploadReportFile(file, allowCloudConsent);
      onExtracted(result);
    } catch (err: any) {
      setError(err.message || 'Failed to extract data from document.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = async (sampleId: string) => {
    setLoadingSamples(true);
    setError(null);
    try {
      const result = await loadSampleReport(sampleId);
      onExtracted(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load sample report.');
    } finally {
      setLoadingSamples(false);
    }
  };

  const handleAddManualRow = () => {
    setManualTests([
      ...manualTests,
      { name: '', value: '', unit: '', reference_range: '', flag: '', confidence_status: 'verified' }
    ]);
  };

  const handleRemoveManualRow = (idx: number) => {
    setManualTests(manualTests.filter((_, i) => i !== idx));
  };

  const handleUpdateManualRow = (idx: number, field: keyof LabTestItem, val: string) => {
    const updated = [...manualTests];
    updated[idx] = { ...updated[idx], [field]: val };
    setManualTests(updated);
  };

  const handleSubmitManual = () => {
    const validTests = manualTests.filter(t => t.name.trim() && t.value.trim());
    if (validTests.length === 0) {
      setError('Please add at least one test with a name and result value.');
      return;
    }
    onExtracted({
      tests: validTests,
      doctor_prescriptions: [],
      unparsed_lines: [],
      raw_text: 'Manual Entry'
    });
  };

  return (
    <section id="upload-section" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.uploadTitle}
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            {t.uploadSubtitle}
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('samples')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'samples'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>{t.sampleReportsTab}</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4 text-teal-600" />
              <span>{t.uploadFileTab}</span>
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4 text-teal-600" />
              <span>{t.manualEntryTab}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: SAMPLE REPORTS */}
        {activeTab === 'samples' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(samples).map(([key, sample]) => (
              <div
                key={key}
                className="bg-slate-50 border border-slate-200 hover:border-teal-400 rounded-2xl p-6 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{sample.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{sample.description}</p>
                </div>
                <button
                  onClick={() => handleLoadSample(key)}
                  disabled={loadingSamples}
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Sample Report</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: FILE UPLOAD */}
        {activeTab === 'upload' && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`cursor-pointer transition-colors ${dragOver ? 'opacity-75' : ''}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {t.dragDropText}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Supported formats: PDF, PNG, JPG, JPEG (Max: 10MB)
              </p>
              <label className="flex items-start gap-2 text-left text-xs text-slate-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <input
                  type="checkbox"
                  checked={allowCloudConsent}
                  onChange={(e) => onToggleCloudConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-teal-600"
                />
                <span>
                  <strong className="block text-amber-900">Allow Gemini to scan this report image</strong>
                  The image may include identifying details and will be sent to Google. Uncheck to keep processing local.
                  Verify every extracted value against the original report.
                </span>
              </label>

              <input
                id="file-input"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                className="hidden"
              />

              <label
                htmlFor="file-input"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold shadow-xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Choose File From Device</span>
              </label>

              {file && (
                <div className="mt-6 inline-flex items-center space-x-3 bg-white border border-teal-200 px-4 py-2 rounded-xl text-left shadow-xs">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block truncate max-w-xs">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-6">
                <button
                  onClick={handleProcessUpload}
                  disabled={loading}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-600/25 transition-all cursor-pointer"
                >
                  {loading ? 'Extracting Lab Parameters...' : 'Extract & Review Parameters'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANUAL ENTRY */}
        {activeTab === 'manual' && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enter Lab Results Manually</h3>
                <p className="text-xs text-slate-500">Provide the test name, your result, unit, and the reference range printed on your report.</p>
              </div>
              <button
                onClick={handleAddManualRow}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-3">
              {manualTests.map((tRow, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 bg-white p-3 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    value={tRow.name}
                    onChange={(e) => handleUpdateManualRow(i, 'name', e.target.value)}
                    placeholder="Test Name (e.g. Hemoglobin)"
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    value={tRow.value}
                    onChange={(e) => handleUpdateManualRow(i, 'value', e.target.value)}
                    placeholder="Value (e.g. 11.2)"
                    className="w-full sm:w-24 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    value={tRow.unit}
                    onChange={(e) => handleUpdateManualRow(i, 'unit', e.target.value)}
                    placeholder="Unit (e.g. g/dL)"
                    className="w-full sm:w-24 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    value={tRow.reference_range}
                    onChange={(e) => handleUpdateManualRow(i, 'reference_range', e.target.value)}
                    placeholder="Ref Range (e.g. 12 - 16)"
                    className="w-full sm:w-32 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    value={tRow.flag || ''}
                    onChange={(e) => handleUpdateManualRow(i, 'flag', e.target.value)}
                    placeholder="Flag (H / L)"
                    className="w-full sm:w-20 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    onClick={() => handleRemoveManualRow(i)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Remove row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmitManual}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-600/25 transition-all cursor-pointer"
              >
                Proceed to Review & Explanation
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
