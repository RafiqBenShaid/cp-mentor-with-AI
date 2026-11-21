"""Pytest suite for the Python AI engine.

The analytics tests are skipped automatically when the optional ML
dependencies (numpy, scikit-learn, networkx) are not installed. The mentor
fallback test always runs because it has no third-party dependencies.
"""

from __future__ import annotations

import pytest


def test_mentor_fallback_without_api_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    from mentor import get_mentor_feedback

    reply = get_mentor_feedback(
        {
            "solve_rate": 0.62,
            "weak_tags": ["dp", "graph"],
            "rating_trend": 12,
        }
    )
    assert "dp" in reply
    assert "graph" in reply
    assert "62%" in reply


def _load_analysis():
    pytest.importorskip("numpy")
    pytest.importorskip("sklearn")
    pytest.importorskip("networkx")
    import analysis

    return analysis


def test_cluster_weaknesses_orders_by_severity() -> None:
    analysis = _load_analysis()
    stats = [
        {"tag": "dp", "total": 20, "solved": 8, "wrong": 12, "ratio": 0.40},
        {"tag": "math", "total": 20, "solved": 17, "wrong": 3, "ratio": 0.85},
        {"tag": "graph", "total": 20, "solved": 10, "wrong": 10, "ratio": 0.50},
        {"tag": "greedy", "total": 20, "solved": 18, "wrong": 2, "ratio": 0.90},
        {"tag": "strings", "total": 20, "solved": 15, "wrong": 5, "ratio": 0.75},
    ]
    result = analysis.cluster_weaknesses(stats)
    assert len(result) == len(stats)
    assert {r["level"] for r in result} <= {"weak", "medium", "strong"}
    assert result[0]["tag"] == "dp"


def test_cluster_weaknesses_handles_empty_input() -> None:
    analysis = _load_analysis()
    assert analysis.cluster_weaknesses([]) == []


def test_skill_graph_marks_gaps_and_prerequisites() -> None:
    analysis = _load_analysis()
    result = analysis.build_skill_graph(
        [
            {"tag": "dp", "total": 20, "solved": 8, "wrong": 12, "ratio": 0.4},
            {"tag": "graph", "total": 20, "solved": 18, "wrong": 2, "ratio": 0.9},
        ]
    )
    nodes, edges, gaps = result["nodes"], result["edges"], result["gaps"]
    by_id = {n["id"]: n for n in nodes}
    assert by_id["dp"]["mastery"] == pytest.approx(0.4)
    assert any(g["id"] == "dp" for g in gaps)
    assert {"from": "math", "to": "dp"} in edges


def test_predict_rating_follows_upward_trend() -> None:
    analysis = _load_analysis()
    result = analysis.predict_rating([1000, 1100, 1200, 1300, 1400], horizon=3)
    assert result["slope"] > 0
    assert result["low"] <= result["predictedRating"] <= result["high"]
    assert len(result["nextContests"]) == 3
    assert result["nextContests"][0] > 1400


def test_predict_rating_handles_short_history() -> None:
    analysis = _load_analysis()
    result = analysis.predict_rating([1500], horizon=2)
    assert result["predictedRating"] == 1500
    assert result["nextContests"] == [1500, 1500]
