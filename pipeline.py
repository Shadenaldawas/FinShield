"""
FinShield assessment pipeline — conceptually mapped to the ITU-T Y.3172
high-level ML pipeline (Clause 8.1): SRC -> C -> PP -> M -> P -> D -> SINK,
coordinated by an orchestrator function playing the MLFO role.

This is a deliberately simple, transparent implementation (rule-based
scoring, not a trained model) so every number in the output is explainable
and traceable — appropriate for a decision-support prototype, not a
certified risk engine.
"""
from datetime import datetime, timezone

import kb

# ---------------------------------------------------------------------------
# DEMO / PROTOTYPE LOGIC — simplified, illustrative thresholds only.
# These are NOT SAMA's actual supervisory pass/fail requirements. They are
# round demo numbers loosely inspired by publicly known concepts (e.g. Basel
# capital/liquidity ideas) chosen to make the demo behave sensibly, and must
# always be presented to the user as "Demo / Prototype Logic".
# ---------------------------------------------------------------------------
DEMO_THRESHOLDS = {
    "capital_adequacy_ratio_min": 10.5,   # %
    "liquidity_ratio_min": 90,            # %
    "npl_ratio_max": 5.0,                 # %
    "operating_margin_min": 0.15,         # (revenue-opex)/revenue
}


# --- SRC: source ---------------------------------------------------------
def src_ingest(raw_input: dict) -> dict:
    """Node: SRC. The raw user-submitted form data, as received."""
    return dict(raw_input)


# --- C: collector ----------------------------------------------------------
def collector_collect(src_record: dict) -> dict:
    """Node: C. Timestamps and packages the single-source submission.
    (A production system might collect from multiple SRC nodes; the
    hackathon prototype has one source — the assessment form.)"""
    return {
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "raw": src_record,
    }


# --- PP: pre-processor -----------------------------------------------------
def preprocessor_normalize(collected: dict) -> dict:
    """Node: PP. Validates and normalizes the raw fields into the shape the
    model needs (numeric coercion, missing-field defaults, derived ratios)."""
    raw = collected["raw"]

    def _num(key, default=0.0):
        try:
            return float(raw.get(key, default))
        except (TypeError, ValueError):
            return default

    revenue = _num("annual_revenue")
    opex = _num("operating_costs")
    operating_margin = (revenue - opex) / revenue if revenue > 0 else 0.0

    return {
        "institution_type": raw.get("institution_type", "unspecified"),
        "product": raw.get("product", "unspecified"),
        "target_market": raw.get("target_market", "unspecified"),
        "annual_revenue": revenue,
        "operating_costs": opex,
        "operating_margin": round(operating_margin, 4),
        "capital_adequacy_ratio": _num("capital_adequacy_ratio"),
        "liquidity_ratio": _num("liquidity_ratio"),
        "npl_ratio": _num("npl_ratio"),
        "submitted_at": collected["submitted_at"],
    }


# --- M: model ----------------------------------------------------------
def model_score(clean: dict) -> dict:
    """Node: M. Transparent weighted scoring model — 4 equally-weighted
    sub-scores, each 0-100, combined into an overall Financial Readiness
    Score. Explicitly labeled Demo/Prototype Logic."""
    th = DEMO_THRESHOLDS

    def clamp(x):
        return max(0.0, min(100.0, x))

    profitability_score = clamp(
        (clean["operating_margin"] / th["operating_margin_min"]) * 100
        if th["operating_margin_min"] else 0.0
    )
    capital_score = clamp(
        (clean["capital_adequacy_ratio"] / th["capital_adequacy_ratio_min"]) * 100
    )
    liquidity_score = clamp(
        (clean["liquidity_ratio"] / th["liquidity_ratio_min"]) * 100
    )
    npl_score = clamp(
        (1 - (clean["npl_ratio"] / th["npl_ratio_max"])) * 100
        if th["npl_ratio_max"] else 0.0
    )

    overall = round(
        0.25 * profitability_score
        + 0.25 * capital_score
        + 0.25 * liquidity_score
        + 0.25 * npl_score,
        1,
    )

    sub_scores = {
        "profitability_score": round(profitability_score, 1),
        "capital_score": round(capital_score, 1),
        "liquidity_score": round(liquidity_score, 1),
        "npl_score": round(npl_score, 1),
    }

    return {
        "overall_score": overall,
        "sub_scores": sub_scores,
        "thresholds_used": th,
    }


# --- P: policy ---------------------------------------------------------
def policy_apply(clean: dict, model_out: dict) -> dict:
    """Node: P. Applies demo threshold rules to decide the Risk Level badge
    and generates the explainable Risk / Reason / Recommendation / Evidence
    findings — both financial and regulatory."""
    th = DEMO_THRESHOLDS
    overall = model_out["overall_score"]

    if overall >= 75:
        risk_level = "Low"
    elif overall >= 50:
        risk_level = "Medium"
    else:
        risk_level = "High"

    financial_risks = []

    if clean["capital_adequacy_ratio"] < th["capital_adequacy_ratio_min"]:
        financial_risks.append({
            "risk": "Capital adequacy risk",
            "reason": (
                f"Capital adequacy ratio ({clean['capital_adequacy_ratio']}%) is "
                f"below the configured demo readiness threshold "
                f"({th['capital_adequacy_ratio_min']}%)."
            ),
            "recommendation": "Strengthen capital position before launch, or phase the rollout to reduce initial capital exposure.",
            "logic_type": "Demo / Prototype Logic",
        })

    if clean["liquidity_ratio"] < th["liquidity_ratio_min"]:
        financial_risks.append({
            "risk": "Liquidity risk",
            "reason": (
                f"Liquidity ratio ({clean['liquidity_ratio']}%) is below the "
                f"configured demo readiness threshold ({th['liquidity_ratio_min']}%)."
            ),
            "recommendation": "Improve liquidity coverage before launching the proposed product.",
            "logic_type": "Demo / Prototype Logic",
        })

    if clean["npl_ratio"] > th["npl_ratio_max"]:
        financial_risks.append({
            "risk": "Credit / non-performing loans risk",
            "reason": (
                f"NPL ratio ({clean['npl_ratio']}%) exceeds the configured demo "
                f"readiness threshold ({th['npl_ratio_max']}%)."
            ),
            "recommendation": "Review credit risk controls and provisioning before expanding into the target market.",
            "logic_type": "Demo / Prototype Logic",
        })

    if clean["operating_margin"] < th["operating_margin_min"]:
        financial_risks.append({
            "risk": "Profitability / cost-structure risk",
            "reason": (
                f"Operating margin ({clean['operating_margin']*100:.1f}%) is below "
                f"the configured demo readiness threshold "
                f"({th['operating_margin_min']*100:.0f}%)."
            ),
            "recommendation": "Reassess the cost base or revenue assumptions for the proposed product before launch.",
            "logic_type": "Demo / Prototype Logic",
        })

    # --- Regulatory / compliance retrieval ---------------------------------
    query = f"{clean['product']} {clean['target_market']} {clean['institution_type']}"
    retrieved_groups = kb.retrieve(query, top_k=3)

    regulatory_findings = []
    for group in retrieved_groups:
        for src in group["sources"]:
            regulatory_findings.append({
                "risk": f"Regulatory review needed — {src['authority']}",
                "reason": (
                    f"The proposed product/market touches topics covered by "
                    f"{src['authority']}'s official guidance ({', '.join(group['topics'][:3])})."
                ),
                "recommendation": (
                    f"Review {src['title']} before launch to confirm compliance."
                ),
                "evidence": {
                    "title": src["title"],
                    "authority": src["authority"],
                    "url": src["url"],
                    "type": src["type"],
                    "status": src["status"],
                    "manual_verification_recommended": src.get(
                        "manual_verification_recommended", False
                    ),
                },
            })

    return {
        "risk_level": risk_level,
        "financial_risks": financial_risks,
        "regulatory_findings": regulatory_findings,
    }


# --- D: distributor ------------------------------------------------------
def distributor_format(clean, model_out, policy_out) -> dict:
    """Node: D. Formats the pipeline's internal results into the response
    shape the frontend (SINK) renders."""
    recommendations = []
    for r in policy_out["financial_risks"]:
        recommendations.append(r["recommendation"])
    for r in policy_out["regulatory_findings"]:
        recommendations.append(r["recommendation"])
    if not recommendations:
        recommendations.append(
            "No material risks detected against the configured demo thresholds. "
            "Proceed with standard due diligence."
        )

    evidence = []
    seen = set()
    for r in policy_out["regulatory_findings"]:
        key = r["evidence"]["url"]
        if key not in seen:
            evidence.append(r["evidence"])
            seen.add(key)

    return {
        "generated_at": clean["submitted_at"],
        "input_summary": {
            "institution_type": clean["institution_type"],
            "product": clean["product"],
            "target_market": clean["target_market"],
            "annual_revenue": clean["annual_revenue"],
            "operating_costs": clean["operating_costs"],
            "capital_adequacy_ratio": clean["capital_adequacy_ratio"],
            "liquidity_ratio": clean["liquidity_ratio"],
            "npl_ratio": clean["npl_ratio"],
        },
        "readiness_score": model_out["overall_score"],
        "risk_level": policy_out["risk_level"],
        "sub_scores": model_out["sub_scores"],
        "thresholds_used": model_out["thresholds_used"],
        "financial_risks": policy_out["financial_risks"],
        "regulatory_findings": policy_out["regulatory_findings"],
        "recommendations": recommendations,
        "evidence": evidence,
        "disclaimer": (
            "FinShield is a decision-support prototype for the ITU AI Readiness "
            "2.0 Hackathon. It is NOT a certified financial or regulatory "
            "assessment tool and does not replace professional financial or "
            "legal judgment. All numeric thresholds are labeled 'Demo / "
            "Prototype Logic' and are illustrative only."
        ),
    }


# --- MLFO-style orchestrator ------------------------------------------------
def run_pipeline(raw_input: dict) -> dict:
    """Orchestrates SRC -> C -> PP -> M -> P -> D. The SINK is the frontend
    dashboard that renders this function's return value."""
    src_record = src_ingest(raw_input)
    collected = collector_collect(src_record)
    clean = preprocessor_normalize(collected)
    model_out = model_score(clean)
    policy_out = policy_apply(clean, model_out)
    result = distributor_format(clean, model_out, policy_out)
    return result
