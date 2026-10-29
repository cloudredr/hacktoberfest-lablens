import pytest
from app.services.safety import SafetyEngine, MEDICATION_REFUSAL_MESSAGE, DIAGNOSIS_REFUSAL_MESSAGE

def test_medication_inquiry_prefilter():
    prompts = [
        "What medicine should I take for this high glucose?",
        "Can you recommend a pill to lower my cholesterol?",
        "What is the dosage of metformin for diabetes?",
        "Should I stop taking my blood pressure medicine?",
        "Write me a prescription for an antibiotic",
        "Give me a drug recommendation for elevated liver enzymes"
    ]
    for p in prompts:
        is_safe, refusal, reason = SafetyEngine.inspect_user_prompt(p)
        assert is_safe is False, f"Prompt should have been blocked: {p}"
        assert refusal == MEDICATION_REFUSAL_MESSAGE
        assert reason == "medication_request_prohibited"

def test_diagnosis_inquiry_prefilter():
    prompts = [
        "Do I have diabetes with glucose of 140?",
        "Does this creatinine result mean I have kidney disease?",
        "Diagnose me based on these blood test numbers",
        "Could I have leukemia with low platelets?",
        "Confirm that I have chronic anemia"
    ]
    for p in prompts:
        is_safe, refusal, reason = SafetyEngine.inspect_user_prompt(p)
        assert is_safe is False, f"Prompt should have been blocked: {p}"
        assert refusal == DIAGNOSIS_REFUSAL_MESSAGE
        assert reason == "diagnosis_request_prohibited"

def test_safe_educational_inquiries_allowed():
    prompts = [
        "What does hemoglobin measure?",
        "What is the definition of reference range?",
        "Why do doctors order a creatinine test?",
        "What units are used for white blood cell count?",
        "Can you explain what platelets do in simple terms?"
    ]
    for p in prompts:
        is_safe, refusal, reason = SafetyEngine.inspect_user_prompt(p)
        assert is_safe is True, f"Educational prompt was falsely blocked: {p}"
        assert refusal is None

def test_output_safety_filter_intercepts_diagnoses():
    unsafe_outputs = [
        "Based on this creatinine level, you have kidney disease.",
        "This confirms you have severe anemia and need urgent care.",
        "You are diagnosed with type 2 diabetes mellitus."
    ]
    for text in unsafe_outputs:
        is_safe, sanitized = SafetyEngine.inspect_and_sanitize_output(text)
        assert is_safe is False
        assert "intercepted by the LabLens Safety Engine" in sanitized

def test_output_safety_filter_intercepts_medication_recommendations():
    unsafe_outputs = [
        "I recommend taking metformin 500mg twice daily.",
        "You should start atorvastatin right away.",
        "Take 20 mg of lisinopril for your blood pressure."
    ]
    for text in unsafe_outputs:
        is_safe, sanitized = SafetyEngine.inspect_and_sanitize_output(text)
        assert is_safe is False
        assert "intercepted by the LabLens Safety Engine" in sanitized

def test_reference_range_evaluation():
    # Above range
    status, note = SafetyEngine.evaluate_reference_range("18.5", "13.5 - 17.5")
    assert status == "above_range"
    assert "above the laboratory's stated reference range" in note
    assert "alone does not establish a diagnosis" in note

    # Below range
    status, note = SafetyEngine.evaluate_reference_range("10.2", "12.0 - 16.0")
    assert status == "below_range"
    assert "below the laboratory's stated reference range" in note
    assert "alone does not establish a diagnosis" in note

    # Within range
    status, note = SafetyEngine.evaluate_reference_range("14.0", "12.0 - 16.0")
    assert status == "within_range"

    # Explicit flag
    status, note = SafetyEngine.evaluate_reference_range("150", "", flag="High")
    assert status == "above_range"

    # Missing or ambiguous range
    status, note = SafetyEngine.evaluate_reference_range("150", "")
    assert status == "unspecified"

