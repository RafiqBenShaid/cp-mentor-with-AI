"""AI / analytics engine for CP Mentor Hub.

Pure functions used by the FastAPI service:
- KMeans weakness clustering
- prerequisite skill graph (networkx)
- rating prediction (linear regression)
"""

from __future__ import annotations

from typing import Any

import networkx as nx
import numpy as np
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression

LEVELS = ["strong", "medium", "weak"]

TAG_PREREQS: dict[str, list[str]] = {
    "arrays": [],
    "implementation": [],
    "math": [],
    "strings": [],
    "sorting": ["arrays"],
    "greedy": ["sorting"],
    "binary search": ["sorting", "arrays"],
    "prefix sums": ["arrays"],
    "two pointers": ["arrays", "sorting"],
    "data structures": ["implementation"],
    "number theory": ["math"],
    "bitmask": ["math", "arrays"],
    "dp": ["prefix sums", "greedy"],
    "graph": ["data structures", "arrays"],
    "trees": ["graph", "data structures"],
    "advanced dp": ["dp", "bitmask"],
}


def cluster_weaknesses(tag_stats: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Cluster tags into strong/medium/weak using KMeans on wrong ratios."""
    if not tag_stats:
        return []

    wrong = np.array([1.0 - float(t["ratio"]) for t in tag_stats], dtype=float).reshape(-1, 1)
    k = min(3, len(tag_stats))
    model = KMeans(n_clusters=k, n_init=10, random_state=42).fit(wrong)
    centroids = model.cluster_centers_.ravel()

    order = np.argsort(centroids)
    rank = {int(original): new for new, original in enumerate(order)}
    if k == 3:
        labels = LEVELS
    elif k == 2:
        labels = ["strong", "weak"]
    else:
        labels = ["medium"]

    result: list[dict[str, Any]] = []
    for i, stat in enumerate(tag_stats):
        cluster = rank[int(model.labels_[i])]
        result.append(
            {
                "tag": stat["tag"],
                "wrongRatio": round(1.0 - float(stat["ratio"]), 4),
                "level": labels[cluster],
                "cluster": cluster,
            }
        )
    order_by_level = {"weak": 0, "medium": 1, "strong": 2}
    return sorted(result, key=lambda r: (order_by_level[r["level"]], -r["wrongRatio"]))


def build_skill_graph(tag_stats: list[dict[str, Any]]) -> dict[str, Any]:
    """Build a prerequisite DAG and mark knowledge gaps (mastery < 0.6)."""
    stats = {t["tag"]: t for t in tag_stats}
    graph = nx.DiGraph()

    for tag, prereqs in TAG_PREREQS.items():
        stat = stats.get(tag)
        mastery = float(stat["ratio"]) if stat else 0.4
        graph.add_node(
            tag,
            mastery=round(mastery, 4),
            solved=int(stat["solved"]) if stat else 0,
            total=int(stat["total"]) if stat else 0,
            prereqs=prereqs,
        )
        for prereq in prereqs:
            if prereq not in graph:
                graph.add_node(prereq, mastery=0.4, solved=0, total=0, prereqs=[])
            graph.add_edge(prereq, tag)

    nodes = [
        {
            "id": node,
            "label": node.title(),
            "mastery": data["mastery"],
            "solved": data["solved"],
            "total": data["total"],
            "prereqs": data["prereqs"],
            "level": "weak" if data["mastery"] < 0.6 else "medium" if data["mastery"] < 0.75 else "strong",
        }
        for node, data in graph.nodes(data=True)
    ]
    edges = [{"from": u, "to": v} for u, v in graph.edges()]
    gaps = [n for n in nodes if n["mastery"] < 0.6]
    return {"nodes": nodes, "edges": edges, "gaps": gaps}


def predict_rating(ratings: list[float], horizon: int = 3) -> dict[str, Any]:
    """Fit a linear regression over contest history and project future ratings."""
    if len(ratings) < 2:
        last = float(ratings[-1]) if ratings else 0.0
        return {
            "predictedRating": round(last),
            "low": round(last - 20),
            "high": round(last + 20),
            "slope": 0.0,
            "rSquared": 0.0,
            "consistency": 0,
            "nextContests": [round(last)] * horizon,
        }

    values = np.array(ratings, dtype=float)
    x = np.arange(len(values)).reshape(-1, 1)
    model = LinearRegression().fit(x, values)
    predictions = model.predict(x)
    ss_res = float(np.sum((values - predictions) ** 2))
    ss_tot = float(np.sum((values - values.mean()) ** 2))
    r_squared = 0.0 if ss_tot == 0 else 1.0 - ss_res / ss_tot
    residual_std = float(np.sqrt(ss_res / len(values)))

    future_x = np.arange(len(values), len(values) + horizon).reshape(-1, 1)
    future = model.predict(future_x)
    predicted = float(future[0])
    spread = max(20.0, residual_std)

    return {
        "predictedRating": round(predicted),
        "low": round(predicted - spread),
        "high": round(predicted + spread),
        "slope": round(float(model.coef_[0]), 2),
        "rSquared": round(r_squared, 3),
        "consistency": max(0, min(100, round(100 - residual_std))),
        "nextContests": [round(float(v)) for v in future],
    }
