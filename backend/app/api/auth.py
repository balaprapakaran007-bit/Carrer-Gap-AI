from fastapi import APIRouter, Header, HTTPException
from typing import Optional, Dict, Any

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Returns current user details or demo user profile."""
    return {
        "uid": "demo_user",
        "name": "Alex Chen",
        "email": "alex.chen@example.com",
        "photoURL": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "createdAt": "2026-09-24T00:00:00Z"
    }
