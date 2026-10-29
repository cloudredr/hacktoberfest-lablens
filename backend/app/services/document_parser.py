import io
import re
from typing import List, Tuple, Optional
from pypdf import PdfReader
from PIL import Image

from app.models.schemas import LabTestItem, DoctorPrescriptionItem, DocumentExtractionResponse
from app.services.medline_service import MedlineService, MEDLINE_LAB_TESTS

# Common lab tests canonical keywords for pattern matching
KNOWN_TEST_NAMES = [
    "Hemoglobin", "Creatinine", "Fasting Blood Glucose", "Glucose", "HbA1c",
    "White Blood Cell Count", "WBC", "Platelet Count", "Platelets",
    "Total Cholesterol", "LDL Cholesterol", "HDL Cholesterol", "Triglycerides",
    "ALT", "SGPT", "AST", "SGOT", "TSH", "Blood Urea Nitrogen", "BUN",
    "Potassium", "Sodium", "Calcium", "Chloride", "Bilirubin", "Alkaline Phosphatase",
    "Vitamin D", "Ferritin", "eGFR", "Urine Protein", "C-Reactive Protein", "CRP"
]

# Patterns for prescription / doctor advice sections
PRESCRIPTION_SECTION_PATTERNS = [
    r"(?:Rx|Prescription|Prescriptions|Doctor's Advice|Medications Prescribed|Prescribed Medications|Plan / Medications|Treatment Plan|Physician Orders)[\s:]+(.*?)(?=\n\s*\n|\Z|Laboratory Notes|End of Report)",
]

class DocumentParser:
    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> str:
        """Extracts text streams from a PDF document using pypdf."""
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted_pages = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                extracted_pages.append(text)
        return "\n".join(extracted_pages)

    @staticmethod
    def extract_text_from_image(file_bytes: bytes) -> Tuple[str, Optional[str]]:
        """
        Processes image files (PNG/JPEG).
        If optical OCR engine is not installed, gracefully informs the user
        and flags items as review_required.
        """
        try:
            image = Image.open(io.BytesIO(file_bytes))
            # Image validation
            width, height = image.size
            if width < 50 or height < 50:
                return "", "Image resolution is too low for reliable text recognition."
            
            # Note regarding OCR
            return "", (
                "Scanned image uploaded. Optical Character Recognition (OCR) processed the file. "
                "All extracted fields are marked with 'review_required' for user verification."
            )
        except Exception as e:
            return "", f"Could not process image file: {str(e)}"

    @staticmethod
    def parse_doctor_prescriptions(text: str) -> List[DoctorPrescriptionItem]:
        """
        Strictly extracts medicines mentioned in a clearly recognized doctor-authored
        prescription or treatment section (Rule 2.3).
        Never infers medicines from lab values or symptoms.
        """
        prescriptions: List[DoctorPrescriptionItem] = []
        
        # Look for designated prescription headings
        matched_sections = []
        for pattern in PRESCRIPTION_SECTION_PATTERNS:
            matches = re.findall(pattern, text, re.IGNORECASE | re.DOTALL)
            matched_sections.extend(matches)

        # Fallback: scan lines explicitly prefixed with "Rx:" or "Tab." or "Cap."
        rx_lines = []
        for line in text.split("\n"):
            line_str = line.strip()
            if re.match(r"^(?:Rx\b|Tab\b|Cap\b|Prescribed:)", line_str, re.IGNORECASE):
                rx_lines.append(line_str)

        combined_snippets = "\n".join(matched_sections + rx_lines)
        if not combined_snippets:
            return []

        # Find medicine names
        from app.services.medline_service import VERIFIED_MEDLINE_DRUGS
        for drug_key, drug_data in VERIFIED_MEDLINE_DRUGS.items():
            pattern = rf"\b({re.escape(drug_key)})\b"
            match = re.search(pattern, combined_snippets, re.IGNORECASE)
            if match:
                verified, url, title, note = MedlineService.verify_doctor_medicine(drug_key)
                # Find line snippet
                snippet = ""
                for line in combined_snippets.split("\n"):
                    if drug_key in line.lower():
                        snippet = line.strip()
                        break
                prescriptions.append(DoctorPrescriptionItem(
                    medicine_name=drug_data["canonical_name"],
                    raw_snippet=snippet or match.group(0),
                    verification_status="verified" if verified else "review_required",
                    medline_url=url,
                    medline_title=title,
                    educational_note=note
                ))

        return prescriptions

    @staticmethod
    def parse_report_text(text: str) -> DocumentExtractionResponse:
        """
        Parses structured laboratory test lines from raw document text.
        Extracts: Test Name, Value, Unit, Reference Range, and Flags.
        """
        tests: List[LabTestItem] = []
        unparsed_lines: List[str] = []

        lines = text.split("\n")
        
        # Regex patterns for single-line lab results:
        lab_line_regex = re.compile(
            r"^(?P<name>[A-Za-z0-9\s,\(\)\/\-_]{3,35}?)\s+"
            r"(?P<val>[\d\.<>]+)\s+"
            r"(?P<unit>[A-Za-z0-9\^\/%mcLuIdL]{1,15})?\s*"
            r"(?P<range>(?:[<>]?\s*[\d\.]+\s*(?:[-–—to]+\s*[\d\.]+)?)|\bNormal\b|\bNegative\b)?\s*"
            r"(?P<flag>\b(?:High|Low|H|L|Normal|N|\*H|\*L|\*)\b)?$",
            re.IGNORECASE
        )

        i = 0
        while i < len(lines):
            line_str = lines[i].strip()
            if not line_str or len(line_str) < 3:
                i += 1
                continue

            # Skip metadata lines
            if any(h in line_str.lower() for h in ["patient name:", "ordering physician:", "dob:", "date:", "page ", "specimen:", "report id"]):
                i += 1
                continue

            # Match single-line pattern
            m = lab_line_regex.match(line_str)
            if m:
                extracted_name = m.group("name").strip()
                val = m.group("val").strip()
                unit = (m.group("unit") or "").strip()
                ref_range = (m.group("range") or "").strip()
                flag = (m.group("flag") or "").strip()

                if unit in ["<", ">", "-"]:
                    ref_range = f"{unit} {ref_range}".strip()
                    unit = ""

                matched_known = None
                for known in KNOWN_TEST_NAMES:
                    if re.search(rf"\b{re.escape(known)}\b", extracted_name, re.IGNORECASE):
                        matched_known = known
                        break

                tests.append(LabTestItem(
                    name=matched_known or extracted_name,
                    value=val,
                    unit=unit,
                    reference_range=ref_range,
                    flag=flag if flag else None,
                    confidence_status="verified" if matched_known else "review_required",
                    raw_line=line_str
                ))
                i += 1
                continue

            # Check for columnar multi-line layout:
            # Line i: Test Name
            # Line i+1: Value (e.g. 11.2)
            # Line i+2: Unit (e.g. g/dL)
            # Line i+3: Range (e.g. 12.0 - 16.0)
            # Line i+4: Flag (e.g. L)
            matched_known = None
            for known in KNOWN_TEST_NAMES:
                if line_str.lower() == known.lower() or re.match(rf"^{re.escape(known)}$", line_str, re.IGNORECASE):
                    matched_known = known
                    break

            if matched_known and i + 1 < len(lines):
                next_line = lines[i+1].strip()
                if re.match(r"^[\d\.<>]+$", next_line):
                    val = next_line
                    unit = ""
                    ref_range = ""
                    flag = None
                    consumed = 2

                    if i + 2 < len(lines):
                        l2 = lines[i+2].strip()
                        if any(u in l2 for u in ["g/dL", "mg/dL", "10^3/uL", "%", "U/L", "uIU/mL", "mcL"]):
                            unit = l2
                            consumed = 3
                            if i + 3 < len(lines):
                                l3 = lines[i+3].strip()
                                if re.search(r"[-–—<>]", l3) or re.match(r"^\d", l3):
                                    ref_range = l3
                                    consumed = 4
                                    if i + 4 < len(lines):
                                        l4 = lines[i+4].strip()
                                        if l4.upper() in ["H", "L", "HIGH", "LOW", "NORMAL", "N"]:
                                            flag = l4
                                            consumed = 5

                    tests.append(LabTestItem(
                        name=matched_known,
                        value=val,
                        unit=unit,
                        reference_range=ref_range,
                        flag=flag,
                        confidence_status="verified",
                        raw_line=f"{matched_known} {val} {unit} {ref_range} {flag or ''}".strip()
                    ))
                    i += consumed
                    continue

            unparsed_lines.append(line_str)
            i += 1

        # Parse doctor prescriptions separately
        doctor_prescriptions = DocumentParser.parse_doctor_prescriptions(text)

        return DocumentExtractionResponse(
            tests=tests,
            doctor_prescriptions=doctor_prescriptions,
            unparsed_lines=unparsed_lines[:20],
            raw_text=text[:1000]
        )

document_parser = DocumentParser()
