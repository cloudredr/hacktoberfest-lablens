from app.services.document_parser import DocumentParser
from app.api.routes.extract import SAMPLE_REPORTS

def test_parse_cbc_sample():
    cbc_text = SAMPLE_REPORTS["cbc_anemia"]["text"]
    result = DocumentParser.parse_report_text(cbc_text)
    assert len(result.tests) >= 3
    test_names = [t.name for t in result.tests]
    assert "Hemoglobin" in test_names
    assert "White Blood Cell Count" in test_names
    assert "Platelets" in test_names

def test_parse_doctor_prescriptions_isolation():
    report_with_rx = SAMPLE_REPORTS["lipid_thyroid_rx"]["text"]
    result = DocumentParser.parse_report_text(report_with_rx)
    # Must identify Metformin and Atorvastatin in prescription section
    assert len(result.doctor_prescriptions) >= 2
    med_names = [m.medicine_name for m in result.doctor_prescriptions]
    assert "Metformin" in med_names
    assert "Atorvastatin" in med_names

def test_no_spurious_prescriptions_from_general_text():
    # CBC report without any doctor prescriptions
    report_no_rx = SAMPLE_REPORTS["cbc_anemia"]["text"]
    result = DocumentParser.parse_report_text(report_no_rx)
    assert len(result.doctor_prescriptions) == 0

