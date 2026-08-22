"""
Knowledge Base loader + lightweight retrieval.

No external ML dependency on purpose: this is a hackathon prototype, and a
pure-Python keyword/overlap scorer is deterministic, has zero install risk,
and is easy for a beginner to read line-by-line. It plays the retrieval role
of a RAG system without pulling in a vector database.
"""
import json
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KB_DIR = os.path.join(BASE_DIR, "knowledge_base")
REGS_DIR = os.path.join(KB_DIR, "regulations")
DOMAIN_DIR = os.path.join(KB_DIR, "domain_data")

_STOPWORDS = {
    "the", "a", "an", "and", "or", "of", "to", "in", "for", "on", "is", "are",
    "be", "this", "that", "with", "as", "by", "it", "not", "official", "text",
}


def _tokenize(text: str):
    words = re.findall(r"[a-z0-9_]+", text.lower())
    return [w for w in words if w not in _STOPWORDS and len(w) > 2]


def load_sources():
    path = os.path.join(REGS_DIR, "sources_log.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_summaries():
    """Read the paraphrased regulation summary files and pair each with its
    matching source-ledger metadata (matched on shared 'topics')."""
    ledger = load_sources()
    summaries = []
    summary_files = {
        "saudi_pdpl": os.path.join(REGS_DIR, "saudi_pdpl", "summary.md"),
        "saudi_sama": os.path.join(REGS_DIR, "saudi_sama", "summary.md"),
        "saudi_cma": os.path.join(REGS_DIR, "saudi_cma", "summary.md"),
        "saudi_vision2030": os.path.join(REGS_DIR, "saudi_vision2030", "summary.md"),
    }
    for group, path in summary_files.items():
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        # topics line inside the markdown file, e.g. "**topics:** a, b, c"
        m = re.search(r"\*\*topics:\*\*\s*(.+)", text)
        topics = [t.strip() for t in m.group(1).split(",")] if m else []
        # find every ledger entry that shares at least one topic with this file
        matched_sources = [
            s for s in ledger["sources"]
            if set(s.get("topics", [])) & set(topics)
        ]
        summaries.append({
            "group": group,
            "text": text,
            "topics": topics,
            "sources": matched_sources,
        })
    return summaries


def retrieve(query: str, top_k: int = 3):
    """Very small keyword-overlap retriever. Returns the top_k regulation
    summary groups (each with its citable official sources) most relevant
    to the query string."""
    query_tokens = set(_tokenize(query))
    summaries = load_summaries()
    scored = []
    for s in summaries:
        doc_tokens = set(_tokenize(s["text"]) + s["topics"])
        overlap = query_tokens & doc_tokens
        score = len(overlap)
        if score > 0:
            scored.append((score, s))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [s for _, s in scored[:top_k]]


def load_demo_institutions():
    path = os.path.join(DOMAIN_DIR, "demo_institutions.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_market_indicators():
    path = os.path.join(DOMAIN_DIR, "market_indicators.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
