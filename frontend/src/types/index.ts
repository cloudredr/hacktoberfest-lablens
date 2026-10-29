export interface LabTestItem {
  name: string;
  value: string;
  unit: string;
  reference_range: string;
  flag?: string | null;
  confidence_status: 'verified' | 'review_required';
  raw_line?: string | null;
}

export interface DoctorPrescriptionItem {
  medicine_name: string;
  raw_snippet: string;
  verification_status: 'verified' | 'review_required' | 'unverified';
  medline_url?: string | null;
  medline_title?: string | null;
  educational_note?: string | null;
}

export interface DocumentExtractionResponse {
  tests: LabTestItem[];
  doctor_prescriptions: DoctorPrescriptionItem[];
  unparsed_lines: string[];
  raw_text: string;
  warning?: string | null;
}

export interface LabTestExplanation {
  test_name: string;
  extracted_value: string;
  unit: string;
  reference_range: string;
  comparison_status: 'within_range' | 'above_range' | 'below_range' | 'unspecified';
  comparison_note: string;
  what_it_measures: string;
  why_ordered: string;
  interpretive_limitations: string;
  medline_title: string;
  medline_url: string;
  source_attribution: string;
}

export interface ExplanationResponse {
  explanations: LabTestExplanation[];
  doctor_prescriptions: DoctorPrescriptionItem[];
  disclaimer: string;
  provider_used: string;
  provider_label: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  refused?: boolean;
  provider_label?: string;
  citations?: Array<{ source: string; title: string; url: string }>;
}

export interface TerminologyItem {
  term: string;
  test_name: string;
  abbreviations: string[];
  plain_definition: string;
  what_it_measures: string;
  why_ordered: string;
  common_units: string[];
  limitations: string;
  medline_url: string;
  medline_title: string;
  category: string;
}

export interface HealthStatus {
  status: string;
  ollama_available: boolean;
  ollama_model_available: boolean;
  configured_model: string;
  available_models: string[];
  gemini_configured: boolean;
  openai_configured: boolean;
  allow_cloud_fallback_default: boolean;
}

export type SupportedLanguage = 'en' | 'hi' | 'or';
