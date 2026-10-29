# Contributing to LabLens

Thank you for contributing to LabLens during Hacktoberfest! We welcome issues, documentation improvements, test cases, and feature enhancements that align with our medical safety guidelines.

---

## Code of Conduct & Safety Guidelines

Before contributing, please read [SAFETY.md](SAFETY.md). Every contributor must respect our non-negotiable medical safety rules:
1. Never introduce diagnostic capabilities.
2. Never introduce automated medication recommendation or dosage logic.
3. Keep doctor-mentioned medicine references strictly isolated from AI explanations.
4. Ground all factual medical definitions in verified references (prefer MedlinePlus).

---

## Development Workflow

### 1. Branching
Create a feature branch from `main`:
```bash
git checkout -b feature/your-feature-name
```

### 2. Running Backend Tests
Ensure all unit and adversarial safety tests pass:
```bash
set PYTHONPATH=backend
backend\venv\Scripts\pytest backend\tests -v
```

### 3. Running Frontend Checks
Build the TypeScript frontend without errors:
```bash
cd frontend
npm run build
```

### 4. Submitting Pull Requests
- Keep PRs focused on a single feature or bug fix.
- Include unit tests for any new parser or safety logic.
- Verify that no medical safety policies are bypassed.

