# LabLens — Understand Your Lab Report
### AI-Powered Medical Report Explainer • Hacktoberfest Edition

[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2026-teal.svg)](https://hacktoberfest.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React: 19](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)](https://fastapi.tiangolo.com/)
[![Ollama: MedGemma](https://img.shields.io/badge/Ollama-MedGemma:4b-purple.svg)](https://ollama.com/library/medgemma)
[![Safety: Clinical Guardrails](https://img.shields.io/badge/Safety-Non--Diagnostic-red.svg)](SAFETY.md)

**LabLens** is a full-stack, privacy-first educational web application built for **Hacktoberfest** that demystifies laboratory reports for everyday users. It explains complex medical terminology, abbreviations, units, and laboratory reference ranges in plain, accessible language with direct citations to verified clinical resources from **MedlinePlus** (U.S. National Library of Medicine).

> [!IMPORTANT]
> **Clinical Safety & Non-Diagnostic Notice:** LabLens is an educational tool, not a diagnostic system. It never diagnoses medical conditions, declares illnesses, or suggests/prescribes medications. Any value outside a laboratory's printed reference range requires clinical context and consultation with a licensed healthcare professional.

---

## Architecture Overview

```
                      +------------------------------------------+
                      |         LabLens React Frontend           |
                      |   (Vite + TypeScript + Tailwind CSS)     |
                      +--------------------+---------------------+
                                           |
                               REST API / HTTP
                                           v
+---------------------------------------------------------------------------------+
|                               FastAPI Backend                                   |
|                                                                                 |
|  +------------------+   +-------------------+   +----------------------------+  |
|  | Document Pipeline|   | Medical Term Engine|   | Safety & Compliance Layer  |  |
|  | - PDF (pypdf)    |   | - MedlinePlus Dir |   | - No diagnosis filter      |  |
|  | - Image OCR      |   | - Med Search API  |   | - No medication suggestion |  |
|  | - Structured Regx|   | - Drug Link Lookup|   | - Untrusted input defense  |  |
|  +------------------+   +-------------------+   +----------------------------+  |
|                                           |                                     |
|                                           v                                     |
|  +---------------------------------------------------------------------------+  |
|  |                      Modular AI Provider Manager                          |  |
|  |  +---------------------------+  +---------------------------------------+ |  |
|  |  | Primary: Local Ollama     |  | Fallback: Cloud OpenAI                | |  |
|  |  | - gemma4:12b             |  | - Requires explicit user consent     | |  |
|  |  | - Zero data leaves machine|  | - Stripped PII, data minimization    | |  |
|  |  +---------------------------+  +---------------------------------------+ |  |
|  |  +----------------------------------------------------------------------+ |  |
|  |  | Verified Curated Grounded Knowledge Provider (High-reliability offline| |  |
|  |  +----------------------------------------------------------------------+ |  |
|  +---------------------------------------------------------------------------+  |
|                                           |                                     |
|  +---------------------------------------------------------------------------+  |
|  | SQLAlchemy 2.0 ORM (SQLite local / PostgreSQL production configurable)   |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
```

---

## Key Features

- **Laboratory Terminology Explorer (Feature B)**: Instant search of medical tests, abbreviations, definitions, units, physiological functions, and limitations.
- **Multi-Format Ingestion (Feature C)**: Supports PDF extraction, scanned image OCR, and manual entry forms with an interactive user verification and review screen before explanations.
- **Laboratory Result Explanation (Feature D)**: Plain-language summaries of what each test measures, why clinicians order it, and careful comparison with the report's printed reference range.
- **Interactive Follow-up Q&A Chat (Feature E)**: Ask questions about lab terminology with session-only memory and live MedlinePlus citations.
- **Verified Medical Reference Directory (Feature F)**: Dedicated panel linking to official MedlinePlus medical tests, health topics, and developer guidelines.
- **Doctor-Mentioned Prescriptions Section (Feature G)**: Isolated extraction of physician-written prescription instructions strictly verified against MedlinePlus drug pages.
- **Multilingual Support (Feature H)**: Full UI and terminology translation across English, Hindi (हिन्दी), and Odia (ଓଡ଼ିଆ).
- **Dual AI Provider Architecture**: Primary local inference with Ollama (`gemma4:12b` by default) and secondary OpenAI fallback gated by explicit user consent.

---

## Non-Negotiable Medical Safety Rules

1. **No Diagnosis (Rule 2.1)**: The AI never claims an abnormal value proves or rules out a disease.
2. **Absolute Medication Prohibition (Rule 2.2)**: The AI never recommends, prescribes, ranks, or suggests medications, dosages, or treatments.
3. **Doctor-Mentioned Medicine Strict Exception (Rule 2.3)**: Medicine references appear only if explicitly written in a physician-authored prescription section and verified on official MedlinePlus drug pages.
4. **Medical Uncertainty (Rule 2.4)**: Neutral, safe phrasing: *"Your report marks this result as [above/below/within] the laboratory's stated reference range. This alone does not establish a diagnosis. A healthcare professional can interpret it in context."*
5. **Model-Independent Safety Layer (Rule 2.5)**: Pre-filters and post-filters sanitize inputs and outputs regardless of provider response.

---

## Quick Start Guide

### 1. Prerequisites
- **Python 3.11+**
- **Node.js 18+ & npm**
- **Ollama** (optional for local AI): [Download Ollama](https://ollama.ai/)

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/LabLens.git
cd LabLens

# Create and activate Python virtual environment
python -m venv backend/venv
# Windows:
backend\venv\Scripts\activate
# Linux/macOS:
source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run test suite (Safety & API tests)
set PYTHONPATH=backend
pytest backend/tests -v

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend API will be available at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Build or run development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Running Local MedGemma with Ollama
```bash
# Download Gemma 4 12B
ollama pull gemma4:12b

# Optionally run an interactive prompt to verify it works
ollama run gemma4:12b
```
LabLens defaults to `gemma4:12b`. Ollama must be running at `http://localhost:11434`; check installed models with `ollama list`. If Gemma 4 12B is not installed, LabLens can use another installed local model or its curated MedlinePlus provider.

### 5. Optional Gemini image scanning and chat

Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey), then put it in the root `.env` file:

```dotenv
GEMINI_API_KEY=your-google-ai-studio-key
GEMINI_MODEL=gemini-3.8-flash
```

The `.env` file is git-ignored. Never commit or share the API key. Restart the backend after setting it. Gemini is used for PNG/JPEG report-image extraction and Ask AI chat only when cloud consent is enabled in **AI Settings**; otherwise chat uses local Ollama. With consent, uploaded images and chat messages are sent to Google, and images are not de-identified first. Review every extracted result against the report. AI systems can make mistakes; LabLens cannot guarantee 99% accuracy, and its output is not a diagnosis or medical advice.

---

## Sample Reports for Testing

LabLens includes 3 pre-built realistic sample reports located in `backend/sample_reports/`:
1. `cbc_report.pdf` — Complete Blood Count with low Hemoglobin and low Platelets.
2. `metabolic_panel.pdf` — Comprehensive Metabolic Panel with high Glucose and high Creatinine.
3. `lipid_prescription_report.pdf` — Lipid & Thyroid panel with doctor-authored Metformin and Atorvastatin prescriptions.

---

## Contributing to Hacktoberfest

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [SAFETY.md](SAFETY.md) before submitting pull requests. All PRs must pass the adversarial safety test suite.

---

## License

This project is licensed under the MIT License. MedlinePlus content is provided courtesy of the U.S. National Library of Medicine.
