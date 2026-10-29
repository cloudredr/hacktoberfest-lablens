# LabLens Medical Safety & Responsible AI Architecture

## Overview
LabLens is engineered around non-negotiable medical safety principles. Clinical safety cannot rely solely on model prompting; it must be enforced through deterministic, independent application-level filters, rigorous schema validations, and source-grounded verified references.

---

## 1. Non-Negotiable Medical Safety Rules

### Rule 2.1 — No Diagnosis
- **Rule**: LabLens must never diagnose medical conditions, diseases, or syndromes, nor claim that an extracted laboratory value confirms or rules out an illness.
- **Implementation**:
  - Educational descriptions explain what a parameter measures in physiological terms (e.g. *Creatinine is a waste product of muscle metabolism filtered by the kidneys*).
  - Prompts asking *"Do I have diabetes?"* or *"Diagnose my condition"* are intercepted immediately at the input layer and rejected with a polite explanation.
  - An independent post-generation safety layer scans all model output for diagnostic declarations (*"you are diagnosed with"*, *"this proves you have"*, *"this rules out"*) and redacts or replaces any offending text with a safe educational refusal.

### Rule 2.2 — Absolute Medication Recommendation Prohibition
- **Rule**: The AI MUST NEVER independently recommend, prescribe, rank, or suggest medicines, drugs, supplements, dosages, treatment schedules, or medication changes based on a laboratory report or conversation.
- **Scope**:
  - No medication recommendations for out-of-range test results.
  - No generation of clinical treatment plans.
  - No suggested dosages, durations, or drug substitutes.
  - Prohibitions apply equally to local MedGemma and cloud OpenAI models.
- **Implementation**:
  - Pre-filter: Catches queries seeking drug advice (*"What medicine should I take?"*, *"How much metformin?"*) and immediately returns:
    > *"LabLens cannot recommend, prescribe, rank, or suggest medicines, supplements, dosages, or treatment plans. Decisions regarding medications must always be made directly with your doctor or licensed prescribing clinician."*
  - Post-filter: Regex and semantic interceptor blocks any model output containing dosage instructions (*"take 500mg"*, *"prescribed medication regimen"*).

### Rule 2.3 — Doctor-Mentioned Medicines: Strictly Limited Exception
- **Rule**: An informational MedlinePlus drug reference may ONLY be displayed when the medicine is explicitly identified in a physician-authored prescription, medication instruction, or treatment section of the uploaded document.
- **Implementation**:
  1. Isolated Extraction: The document parser separates prescription sections from general laboratory findings.
  2. No Inference: Medicine names are NEVER inferred from laboratory values, suspected conditions, or symptoms.
  3. Strict MedlinePlus Verification: Extracted medicine names are matched against verified official MedlinePlus drug pages.
  4. Non-Fabrication Guarantee: If no matching MedlinePlus page can be verified, the application displays:
     > *"No matching MedlinePlus drug-information page could be verified."*
     The application NEVER fabricates URLs or substitutes arbitrary search links.
  5. User Review: Users can inspect and correct OCR-extracted drug names before verification.
  6. Educational Labeling: Every medicine reference is clearly labeled as educational information, never a prescription or endorsement.

### Rule 2.4 — Medical Uncertainty & Printed Reference Ranges
- **Rule**: Out-of-range results are never treated as proof of disease.
- **Implementation**:
  - The application strictly uses the laboratory's own printed reference interval from the report.
  - Neutral, standardized disclaimer applied to all out-of-range results:
    > *"Your report marks this result as [above/below/within] the laboratory's stated reference range. This alone does not establish a diagnosis. A healthcare professional can interpret it in context."*
  - If a reference range is absent or ambiguous, it is classified as `unspecified` with an invitation to review the original document.

### Rule 2.5 — Independent Multi-Tier Safety Filters
- **Input Pre-Filters**: Inspects user queries before inference.
- **Output Post-Filters**: Sanitizes generated text regardless of model temperature or provider origin.
- **Adversarial Test Suite**: Verified against prompt injections, diagnostic probes, and medication inquiries in `backend/tests/test_safety.py`.

---

## 2. AI Provider Architecture & Privacy
- **Local Primary**: Ollama running locally (`medgemma:27b`). Zero report content or conversation data leaves the user's computer.
- **Cloud Fallback Gate**: Cloud AI (OpenAI) fallback is opt-in by default and strictly requires the user's explicit informed consent checkbox.
- **Data Minimization**: Strips personal identifiers before cloud transmission; retains no chat history or report data on disk by default.

