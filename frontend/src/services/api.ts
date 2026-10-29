import {
  HealthStatus,
  TerminologyItem,
  DocumentExtractionResponse,
  LabTestItem,
  ExplanationResponse,
  ChatMessage
} from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch health status');
  return res.json();
}

export async function searchTerminology(q: string = ''): Promise<TerminologyItem[]> {
  const res = await fetch(`${API_BASE}/terminology?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Failed to search terminology');
  return res.json();
}

export async function fetchTermDetail(term: string): Promise<TerminologyItem> {
  const res = await fetch(`${API_BASE}/terminology/${encodeURIComponent(term)}`);
  if (!res.ok) throw new Error('Term not found');
  return res.json();
}

export async function fetchSampleReports(): Promise<Record<string, { title: string; description: string; text: string }>> {
  const res = await fetch(`${API_BASE}/extract/samples`);
  if (!res.ok) throw new Error('Failed to fetch sample reports');
  return res.json();
}

export async function loadSampleReport(sampleId: string): Promise<DocumentExtractionResponse> {
  const res = await fetch(`${API_BASE}/extract/sample/${sampleId}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to load sample report');
  return res.json();
}

export async function uploadReportFile(
  file: File,
  allowCloudConsent: boolean = false
): Promise<DocumentExtractionResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('allow_cloud_consent', String(allowCloudConsent));
  const res = await fetch(`${API_BASE}/extract/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to process document upload');
  }
  return res.json();
}

export async function manualReportExtraction(text: string): Promise<DocumentExtractionResponse> {
  const res = await fetch(`${API_BASE}/extract/manual`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to parse manual report text');
  return res.json();
}

export async function explainTests(
  tests: LabTestItem[],
  language: string = 'en',
  allowCloudConsent: boolean = false
): Promise<ExplanationResponse> {
  const res = await fetch(`${API_BASE}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tests,
      language,
      allow_cloud_consent: allowCloudConsent,
    }),
  });
  if (!res.ok) throw new Error('Failed to generate explanations');
  return res.json();
}

export async function sendChatMessage(
  messages: Array<{ role: string; content: string }>,
  language: string = 'en',
  allowCloudConsent: boolean = false
): Promise<{
  reply: string;
  citations: Array<{ source: string; title: string; url: string }>;
  refused: boolean;
  refusal_reason?: string;
  provider_used: string;
  provider_label: string;
}> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      language,
      allow_cloud_consent: allowCloudConsent,
    }),
  });
  if (!res.ok) throw new Error('Failed to communicate with chat service');
  return res.json();
}

export async function verifyMedicine(medicineName: string) {
  const res = await fetch(`${API_BASE}/medications/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medicine_name: medicineName }),
  });
  if (!res.ok) throw new Error('Failed to verify medicine');
  return res.json();
}
