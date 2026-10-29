from app.services.medline_service import MedlineService

def test_medline_lab_test_lookup():
    entry = MedlineService.find_lab_test_entry("Hemoglobin")
    assert entry is not None
    assert entry["canonical_name"] == "Hemoglobin"
    assert "https://medlineplus.gov/lab-tests/" in entry["medline_url"]

def test_medline_abbreviation_lookup():
    entry = MedlineService.find_lab_test_entry("WBC")
    assert entry is not None
    assert "White Blood Cell" in entry["canonical_name"]

def test_doctor_medicine_verification_valid():
    verified, url, title, note = MedlineService.verify_doctor_medicine("Metformin 500mg")
    assert verified is True
    assert url == "https://medlineplus.gov/druginfo/meds/a696005.html"
    assert "Metformin" in title
    assert "Educational information only" in note

def test_doctor_medicine_verification_unverified():
    verified, url, title, note = MedlineService.verify_doctor_medicine("InventedDrugXYZ")
    assert verified is False
    assert url is None
    assert note == "No matching MedlinePlus drug-information page could be verified."

