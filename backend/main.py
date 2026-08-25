"""
FinShield backend — FastAPI entrypoint.

Run with:  uvicorn main:app --reload --port 8000
(see repo README for full setup instructions)
"""
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import kb
import pipeline

app = FastAPI(
    title="FinShield API",
    description=(
        "Decision-support prototype for financial readiness assessment. "
        "Built for the ITU AI Readiness 2.0 Hackathon (KSA). Not a certified "
        "regulatory tool."
    ),
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AssessmentRequest(BaseModel):
    institution_type: str = Field(..., examples=["fintech"])
    product: str = Field(..., examples=["digital_investment"])
    target_market: str = Field(..., examples=["ksa_domestic"])
    annual_revenue: float = Field(..., ge=0)
    operating_costs: float = Field(..., ge=0)
    capital_adequacy_ratio: float = Field(..., ge=0, le=100)
    liquidity_ratio: float = Field(..., ge=0, le=500)
    npl_ratio: float = Field(..., ge=0, le=100)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/demo-institutions")
def demo_institutions():
    """Returns the synthetic demo profiles so the frontend can offer a
    'Load demo scenario' shortcut (brief's demo scenario: digital investment
    product launch)."""
    return kb.load_demo_institutions()


@app.get("/api/market-indicators")
def market_indicators():
    return kb.load_market_indicators()


@app.get("/api/sources")
def sources():
    """Exposes the full official source ledger (Section 7) for the
    Evidence/Sources screen."""
    return kb.load_sources()


@app.post("/api/assess")
def assess(payload: AssessmentRequest):
    try:
        result = pipeline.run_pipeline(payload.model_dump())
    except Exception as exc:  # pragma: no cover - defensive for a hackathon demo
        raise HTTPException(status_code=500, detail=f"Assessment pipeline error: {exc}")
    return result
