from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.medline_service import MedlineService
from app.models.schemas import TerminologyItem

router = APIRouter(prefix="/terminology", tags=["Terminology"])

@router.get("", response_model=List[TerminologyItem])
async def search_terminology(q: Optional[str] = Query("", description="Search term, abbreviation, or test name")):
    """Searches laboratory terminology catalog with verified MedlinePlus links."""
    results = MedlineService.search_terminology(q or "")
    return [TerminologyItem(**r) for r in results]

@router.get("/{term}", response_model=TerminologyItem)
async def get_term_detail(term: str):
    """Retrieves full educational details and official MedlinePlus reference for a test."""
    entry = MedlineService.find_lab_test_entry(term)
    if not entry:
        raise HTTPException(status_code=404, detail=f"Terminology entry for '{term}' not found.")
    return TerminologyItem(
        term=entry["canonical_name"],
        test_name=entry["canonical_name"],
        abbreviations=entry["abbreviations"],
        plain_definition=entry["plain_definition"],
        what_it_measures=entry["what_it_measures"],
        why_ordered=entry["why_ordered"],
        common_units=entry["common_units"],
        limitations=entry["limitations"],
        medline_url=entry["medline_url"],
        medline_title=entry["medline_title"],
        category=entry["category"]
    )

