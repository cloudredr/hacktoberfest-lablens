import re
from typing import Tuple, Optional, List

# Standard non-negotiable medical disclaimers
GLOBAL_MEDICAL_DISCLAIMER = (
    "LabLens is an educational tool, not a medical diagnostic system or clinical decision tool. "
    "It never replaces the evaluation, diagnosis, or treatment advice of a qualified healthcare professional. "
    "Laboratory results must always be interpreted in full clinical context, including physical examination, "
    "medical history, and symptoms."
)

MEDICATION_REFUSAL_MESSAGE = (
    "LabLens cannot recommend, prescribe, rank, or suggest medicines, supplements, dosages, or treatment plans. "
    "Decisions regarding medications must always be made directly with your doctor or licensed prescribing clinician. "
    "Please consult your healthcare provider or pharmacist regarding any medication questions."
)

DIAGNOSIS_REFUSAL_MESSAGE = (
    "LabLens cannot diagnose diseases or determine whether you have a medical condition. "
    "An out-of-range lab result is not proof of disease and can be influenced by diet, hydration, medications, "
    "and lab-specific calibration. Only a qualified clinician can interpret laboratory results in your clinical context."
)

# Prohibited request patterns (pre-filter on user inputs)
MEDICATION_REQUEST_PATTERNS = [
    r"\b(?:what|which|should I take|can I take|prescribe|recommend|suggest|give|provide|need|want)\b.*?\b(?:medicine|medication|drug|pill|tablet|dose|dosage|cure|treatment|supplement|antibiotic|insulin|statin)\b",
    r"\b(?:how much|how many mg|dose of|dosage for)\b",
    r"\b(?:stop taking|start taking|increase dose|decrease dose|substitute for)\b",
    r"\b(?:what to take for|remedy for|cure for)\b",
    r"\b(?:give|write|provide|need)(?:\s+me)?\s+(?:a\s+)?prescription\b",
    r"\b(?:prescription for|medication recommendation|drug recommendation)\b",
]

DIAGNOSIS_REQUEST_PATTERNS = [
    r"\b(?:do I have|am I having|could I have|confirm that I have)\b.*?\b(?:cancer|diabetes|anemia|infection|kidney disease|liver disease|lupus|leukemia|failure|disease|condition)\b",
    r"\b(?:diagnose me|give me a diagnosis|tell me my disease|what disease do I have)\b",
    r"\b(?:mean|prove|indicate)\s+(?:that\s+)?I have\b",
    r"\b(?:does this|do these|does my)\b.*?\b(?:mean|prove|indicate)\b.*?\b(?:I have|I suffer from)\b",
]

# Prohibited generation patterns (post-filter on AI generated output)
UNSAFE_OUTPUT_PATTERNS = [
    r"\b(?:you (?:have|suffer from|are diagnosed with)|this confirms you have|this rules out)\b",
    r"\b(?:I (?:recommend|prescribe|suggest) (?:taking|that you take)|take \d+\s*(?:mg|ml|tablets?))\b",
    r"\b(?:you should (?:start|stop|take|buy|use) (?:metformin|atorvastatin|antibiotics?|insulin|lisinopril|aspirin|ibuprofen|amoxicillin))\b",
    r"\b(?:treatment plan|prescribed medication regimen|dosage recommendations?)\b",
]

class SafetyEngine:
    @staticmethod
    def inspect_user_prompt(prompt: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Inspects user input before it reaches the AI model.
        Returns: (is_safe, refusal_message, reason)
        """
        clean_text = prompt.strip().lower()

        # Check medication inquiry
        for pattern in MEDICATION_REQUEST_PATTERNS:
            if re.search(pattern, clean_text, re.IGNORECASE):
                return False, MEDICATION_REFUSAL_MESSAGE, "medication_request_prohibited"

        # Check diagnosis inquiry
        for pattern in DIAGNOSIS_REQUEST_PATTERNS:
            if re.search(pattern, clean_text, re.IGNORECASE):
                return False, DIAGNOSIS_REFUSAL_MESSAGE, "diagnosis_request_prohibited"

        return True, None, None

    @staticmethod
    def inspect_and_sanitize_output(text: str) -> Tuple[bool, str]:
        """
        Independent safety layer validating model output.
        If unsafe diagnostic or prescribing patterns are found, the output is blocked
        and replaced with a safe educational refusal.
        """
        for pattern in UNSAFE_OUTPUT_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                return False, (
                    "The generated explanation was intercepted by the LabLens Safety Engine because "
                    "it contained speculative diagnostic or medication wording. "
                    "LabLens provides strictly educational definitions. Please discuss your results "
                    "with a qualified healthcare professional."
                )
        return True, text

    @staticmethod
    def evaluate_reference_range(value_str: str, range_str: str, flag: Optional[str] = None) -> Tuple[str, str]:
        """
        Evaluates extracted value against printed reference range.
        Never treats an out-of-range value as disease proof.
        Returns: (comparison_status, comparison_note)
        Status: 'within_range' | 'above_range' | 'below_range' | 'unspecified'
        """
        # If explicit flag is present from lab
        if flag:
            f = flag.strip().upper()
            if f in ["H", "HIGH", "*H", ">"]:
                return "above_range", (
                    "Your report marks this result as above the laboratory's stated reference range. "
                    "This alone does not establish a diagnosis. A healthcare professional can interpret it in context."
                )
            if f in ["L", "LOW", "*L", "<"]:
                return "below_range", (
                    "Your report marks this result as below the laboratory's stated reference range. "
                    "This alone does not establish a diagnosis. A healthcare professional can interpret it in context."
                )
            if f in ["N", "NORMAL", "WNL"]:
                return "within_range", (
                    "Your report marks this result within the laboratory's printed reference range. "
                    "Reference ranges can vary between different laboratories."
                )

        if not range_str or range_str.strip() == "":
            return "unspecified", (
                "No reference range was specified on this laboratory report line. "
                "Reference ranges vary by laboratory and individual clinical context."
            )

        # Try to parse numerical range: "13.5 - 17.5" or "13.5-17.5" or "< 200" or "> 50"
        try:
            # Extract numbers from value
            val_clean = re.sub(r"[^\d.]", "", value_str.strip())
            if not val_clean:
                return "unspecified", "Non-numeric result value; review in clinical context with your doctor."
            val = float(val_clean)

            # Less than pattern: "< 200"
            lt_match = re.search(r"<\s*([\d.]+)", range_str)
            if lt_match:
                upper = float(lt_match.group(1))
                if val <= upper:
                    return "within_range", "Result is within the laboratory's printed cutoff threshold."
                else:
                    return "above_range", (
                        "Your report marks this result as above the laboratory's stated reference range. "
                        "This alone does not establish a diagnosis. A healthcare professional can interpret it in context."
                    )

            # Greater than pattern: "> 50"
            gt_match = re.search(r">\s*([\d.]+)", range_str)
            if gt_match:
                lower = float(gt_match.group(1))
                if val >= lower:
                    return "within_range", "Result is within the laboratory's printed cutoff threshold."
                else:
                    return "below_range", (
                        "Your report marks this result as below the laboratory's stated reference range. "
                        "This alone does not establish a diagnosis. A healthcare professional can interpret it in context."
                    )

            # Range pattern: "13.5 - 17.5"
            range_match = re.search(r"([\d.]+)\s*[-–—to]+\s*([\d.]+)", range_str)
            if range_match:
                low = float(range_match.group(1))
                high = float(range_match.group(2))
                if val < low:
                    return "below_range", (
                        "Your report marks this result as below the laboratory's stated reference range. "
                        "This alone does not establish a diagnosis. A healthcare professional can interpret it in context."
                    )
                elif val > high:
                    return "above_range", (
                        "Your report marks this result as above the laboratory's stated reference range. "
                        "This alone does not establish a diagnosis. A healthcare professional can interpret it in context."
                    )
                else:
                    return "within_range", (
                        "Your report marks this result within the laboratory's printed reference range. "
                        "Reference ranges can vary between different laboratories."
                    )
        except Exception:
            pass

        return "unspecified", (
            "The laboratory reference range could not be unambiguously compared automatically. "
            "Please review the printed report interval directly."
        )
