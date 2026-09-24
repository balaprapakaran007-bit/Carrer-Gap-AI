import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from app.models.schemas import SharedProfilePublicView
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/share", tags=["Public Profile Sharing"])

@router.post("/{analysisId}")
async def create_or_toggle_share(analysisId: str, payload: Dict[str, Any] = Body(default={})):
    """Creates, enables, or revokes a public read-only share token for an analysis."""
    analysis = firebase_service.get_analysis(analysisId) or firebase_service.get_analysis("demo-analysis-ml-01")
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    enable = payload.get("enable", True)

    if not enable:
        if analysis.shareToken:
            firebase_service.revoke_shared_profile(analysis.shareToken)
        analysis.isShareable = False
        firebase_service.save_analysis(analysis)
        return {"success": True, "isShareable": False, "message": "Public link revoked."}

    token = analysis.shareToken or f"share-{uuid.uuid4().hex[:12]}"
    analysis.isShareable = True
    analysis.shareToken = token
    firebase_service.save_analysis(analysis)

    public_view = SharedProfilePublicView(
        shareToken=token,
        roleTitle=analysis.jobTitle,
        jobCompany=analysis.jobCompany,
        readinessScore=analysis.readinessScore,
        topStrengths=analysis.topStrengths,
        topMatchedSkills=[s.skill for s in analysis.skillsMatrix if s.status.value == "Matched"][:6],
        aiStrengthSummary=analysis.summaryParagraph,
        createdAt=datetime.utcnow().isoformat(),
        isActive=True
    )
    firebase_service.save_shared_profile(public_view)

    return {
        "success": True,
        "isShareable": True,
        "shareToken": token,
        "shareUrl": f"/share/{token}",
        "profile": public_view
    }

@router.get("/{token}", response_model=SharedProfilePublicView)
async def get_public_profile(token: str):
    """Public read-only endpoint returning safe profile summary with no private PII."""
    profile = firebase_service.get_shared_profile(token)
    if not profile:
        # Check demo token
        if token in ["demo-share-careergap-2026", "demo"]:
            profile = firebase_service.get_shared_profile("demo-share-careergap-2026")
        if not profile:
            raise HTTPException(status_code=404, detail="This shared profile link has expired or been revoked by the candidate.")
    return profile
