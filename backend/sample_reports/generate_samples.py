import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def create_cbc_pdf(filename: str):
    c = canvas.Canvas(filename, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 750, "METROPOLITAN DIAGNOSTICS LABORATORY")
    
    c.setFont("Helvetica", 10)
    c.drawString(50, 730, "Patient: Jane Doe | Age: 42 | Sex: Female | Date: 2026-10-15")
    c.drawString(50, 715, "Specimen: Whole Blood EDTA | Ordering Physician: Dr. Marcus Evans, MD")
    c.line(50, 705, 560, 705)
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 685, "TEST NAME")
    c.drawString(220, 685, "RESULT")
    c.drawString(280, 685, "UNITS")
    c.drawString(360, 685, "REFERENCE INTERVAL")
    c.drawString(510, 685, "FLAG")
    c.line(50, 675, 560, 675)
    
    c.setFont("Helvetica", 10)
    y = 655
    tests = [
        ("Hemoglobin", "11.2", "g/dL", "12.0 - 16.0", "L"),
        ("White Blood Cell Count", "6.8", "10^3/uL", "4.5 - 11.0", "Normal"),
        ("Platelets", "135", "10^3/uL", "150 - 450", "L"),
    ]
    for name, val, unit, ref, flag in tests:
        c.drawString(50, y, name)
        c.drawString(220, y, val)
        c.drawString(280, y, unit)
        c.drawString(360, y, ref)
        c.drawString(510, y, flag)
        y -= 25
        
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(50, 560, "Clinical Note: Manual differential confirmed mild thrombocytopenia. Correlate clinically.")
    c.save()

def create_metabolic_pdf(filename: str):
    c = canvas.Canvas(filename, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 750, "ADVANCED HEALTH LAB SERVICES")
    
    c.setFont("Helvetica", 10)
    c.drawString(50, 730, "Patient: Robert Smith | Age: 58 | Sex: Male | Date: 2026-10-18")
    c.drawString(50, 715, "Specimen: Fasting Serum | Ordering Physician: Dr. Rachel Adams, MD")
    c.line(50, 705, 560, 705)
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 685, "TEST NAME")
    c.drawString(220, 685, "RESULT")
    c.drawString(280, 685, "UNITS")
    c.drawString(360, 685, "REFERENCE INTERVAL")
    c.drawString(510, 685, "FLAG")
    c.line(50, 675, 560, 675)
    
    c.setFont("Helvetica", 10)
    y = 655
    tests = [
        ("Fasting Blood Glucose", "126", "mg/dL", "70 - 99", "H"),
        ("Creatinine", "1.5", "mg/dL", "0.7 - 1.3", "High"),
        ("Blood Urea Nitrogen", "24", "mg/dL", "7 - 20", "H"),
        ("ALT", "32", "U/L", "7 - 56", "Normal"),
    ]
    for name, val, unit, ref, flag in tests:
        c.drawString(50, y, name)
        c.drawString(220, y, val)
        c.drawString(280, y, unit)
        c.drawString(360, y, ref)
        c.drawString(510, y, flag)
        y -= 25
        
    c.save()

def create_prescription_pdf(filename: str):
    c = canvas.Canvas(filename, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 750, "ST. JUDE CLINICAL LABORATORIES & OUTPATIENT CENTER")
    
    c.setFont("Helvetica", 10)
    c.drawString(50, 730, "Patient: Maria Garcia | Age: 61 | Sex: Female | Date: 2026-10-20")
    c.drawString(50, 715, "Ordering Physician: Dr. Sarah Jenkins, MD")
    c.line(50, 705, 560, 705)
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 685, "TEST NAME")
    c.drawString(220, 685, "RESULT")
    c.drawString(280, 685, "UNITS")
    c.drawString(360, 685, "REFERENCE INTERVAL")
    c.drawString(510, 685, "FLAG")
    c.line(50, 675, 560, 675)
    
    c.setFont("Helvetica", 10)
    y = 655
    tests = [
        ("Total Cholesterol", "228", "mg/dL", "< 200", "High"),
        ("TSH", "5.4", "uIU/mL", "0.4 - 4.0", "H"),
        ("HbA1c", "6.9", "%", "4.0 - 5.6", "High"),
    ]
    for name, val, unit, ref, flag in tests:
        c.drawString(50, y, name)
        c.drawString(220, y, val)
        c.drawString(280, y, unit)
        c.drawString(360, y, ref)
        c.drawString(510, y, flag)
        y -= 25
        
    # Doctor Prescriptions section
    c.line(50, y - 10, 560, y - 10)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y - 30, "Physician Orders / Prescriptions:")
    c.setFont("Helvetica", 10)
    c.drawString(50, y - 50, "Rx: Metformin 500mg oral tablet - Take 1 tablet twice daily with meals")
    c.drawString(50, y - 70, "Rx: Atorvastatin 20mg oral tablet - Take 1 tablet daily at bedtime")
    c.save()

if __name__ == "__main__":
    out_dir = os.path.dirname(os.path.abspath(__file__))
    create_cbc_pdf(os.path.join(out_dir, "cbc_report.pdf"))
    create_metabolic_pdf(os.path.join(out_dir, "metabolic_panel.pdf"))
    create_prescription_pdf(os.path.join(out_dir, "lipid_prescription_report.pdf"))
    print("Generated 3 realistic laboratory report PDFs in backend/sample_reports/")

