"""FastAPI service exposing the CP Mentor Hub analytics engine.

Run:
    uvicorn app:app --reload --port 8000
"""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from analysis import build_skill_graph, cluster_weaknesses, predict_rating
from mentor import get_mentor_feedback

app = FastAPI(title="CP Mentor Hub AI Engine", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TagStat(BaseModel):
    tag: str
    total: int
    solved: int
    wrong: int
    ratio: float


class TagStatsRequest(BaseModel):
    tag_stats: list[TagStat]


class RatingRequest(BaseModel):
    ratings: list[float] = Field(..., min_length=1)
    horizon: int = Field(3, ge=1, le=10)


class MentorRequest(BaseModel):
    solve_rate: float = 0.0
    weak_tags: list[str] = []
    rating_trend: float = 0.0
    predicted_rating: int | None = None
    message: str | None = None


@app.get("/health")
def health() -> dict[str, Any]:
    return {"ok": True, "service": "cp-mentor-ai-engine"}


@app.post("/weakness")
def weakness(payload: TagStatsRequest) -> dict[str, Any]:
    return {"weaknesses": cluster_weaknesses([t.model_dump() for t in payload.tag_stats])}


@app.post("/skill-graph")
def skill_graph(payload: TagStatsRequest) -> dict[str, Any]:
    return build_skill_graph([t.model_dump() for t in payload.tag_stats])


@app.post("/predict")
def predict(payload: RatingRequest) -> dict[str, Any]:
    return predict_rating(payload.ratings, payload.horizon)


@app.post("/mentor")
def mentor(payload: MentorRequest) -> dict[str, str]:
    return {"reply": get_mentor_feedback(payload.model_dump())}
