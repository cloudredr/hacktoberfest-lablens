from fastapi import APIRouter
from app.models.schemas import VerifyMedicineRequest, VerifyMedicineResponse
from app.services.medline_service import MedlineService

router = APIRouter(prefix="/medications", tags=["Doctor-Mentioned Medication Verification"])

@router.post("/verify", response_model=VerifyMedicineResponse)
async def verify_doctor_medicine(request: VerifyMedicineRequest):
    """
    Verifies a medicine explicitly mentioned in a physician prescription against
    authoritative MedlinePlus drug pages.
    Enforces Rule 2.3: Never fabricates a URL. If unverified, returns standard note.
    """
    verified, url, title, note = MedlineService.verify_doctor_medicine(request.medicine_name)
    return VerifyMedicineResponse(
        medicine_name=request.medicine_name,
        verified=verified,
        medline_url=url,
        medline_title=title,
        educational_note=note
    )

