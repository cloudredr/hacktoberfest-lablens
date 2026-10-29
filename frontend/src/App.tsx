import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { TerminologySearch } from './components/TerminologySearch';
import { ReportUpload } from './components/ReportUpload';
import { ReviewModal } from './components/ReviewModal';
import { ExplanationResults } from './components/ExplanationResults';
import { DoctorMedications } from './components/DoctorMedications';
import { MedicalReferencePanel } from './components/MedicalReferencePanel';
import { ChatDrawer } from './components/ChatDrawer';
import { AISettingsModal } from './components/AISettingsModal';
import { Footer } from './components/Footer';

import { 
  SupportedLanguage, 
  HealthStatus, 
  DocumentExtractionResponse, 
  LabTestItem, 
  ExplanationResponse 
} from './types';
import { fetchHealth, explainTests } from './services/api';

export function App() {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [health, setHealth] = useState<HealthStatus | null>(null);

  // Flow states
  const [extractedData, setExtractedData] = useState<DocumentExtractionResponse | null>(null);
  const [explanationData, setExplanationData] = useState<ExplanationResponse | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  // Modals & Panels
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [allowCloudConsent, setAllowCloudConsent] = useState(false);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => {});
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (query: string) => {
    setInitialSearchQuery(query);
    handleNavigate('terminology-section');
  };

  const handleExtracted = (data: DocumentExtractionResponse) => {
    setExtractedData(data);
  };

  const handleConfirmReview = async (tests: LabTestItem[], cloudConsent: boolean) => {
    setLoadingExplanation(true);
    setAllowCloudConsent(cloudConsent);
    try {
      const resp = await explainTests(tests, language, cloudConsent);
      // Merge in any doctor prescriptions extracted from the original document
      if (extractedData?.doctor_prescriptions) {
        resp.doctor_prescriptions = extractedData.doctor_prescriptions;
      }
      setExplanationData(resp);
      setExtractedData(null); // Close review modal
      // Scroll to results
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      alert(`Error generating explanations: ${err.message || 'Please try again.'}`);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleResetResults = () => {
    setExplanationData(null);
    setExtractedData(null);
    handleNavigate('upload-section');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        health={health}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <LandingHero
          language={language}
          onUnderstandClick={() => handleNavigate('upload-section')}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Upload & Report Entry Section */}
        {!explanationData && (
          <ReportUpload
            language={language}
            onExtracted={handleExtracted}
            allowCloudConsent={allowCloudConsent}
            onToggleCloudConsent={setAllowCloudConsent}
          />
        )}

        {/* Results View (When explanations are generated) */}
        {explanationData && (
          <>
            <ExplanationResults
              language={language}
              data={explanationData}
              onReset={handleResetResults}
              onOpenChat={() => setIsChatOpen(true)}
            />

            {/* Doctor-Mentioned Medicine Isolated Section (Feature G) */}
            <DoctorMedications
              language={language}
              prescriptions={explanationData.doctor_prescriptions || []}
            />
          </>
        )}

        {/* Terminology Search & Explorer */}
        <TerminologySearch
          language={language}
          initialQuery={initialSearchQuery}
        />

        {/* Authoritative Medical References Directory */}
        <MedicalReferencePanel
          language={language}
        />
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Review Modal (Feature C) */}
      {extractedData && (
        <ReviewModal
          language={language}
          tests={extractedData.tests}
          doctorPrescriptions={extractedData.doctor_prescriptions}
          warning={extractedData.warning}
          onConfirm={handleConfirmReview}
          onCancel={() => setExtractedData(null)}
          loading={loadingExplanation}
        />
      )}

      {/* Follow-up Interactive Q&A Chat Drawer (Feature E) */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        language={language}
        allowCloudConsent={allowCloudConsent}
      />

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        health={health}
        language={language}
        allowCloudConsent={allowCloudConsent}
        onToggleCloudConsent={setAllowCloudConsent}
      />
    </div>
  );
}

export default App;
