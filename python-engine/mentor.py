"""AI Mentor chat generation.

Uses the Anthropic API when ANTHROPIC_API_KEY is set. Otherwise falls back to a
deterministic rule-based mentor so the demo works offline with zero API keys.
"""

from __future__ import annotations

import os
from typing import Any

SYSTEM_PROMPT = (
    "You are a friendly, encouraging competitive programming mentor. "
    "Use the user's stats to give concrete, actionable advice. Keep answers to 3-4 short lines. "
    "Mention specific topics and rating ranges."
)


def _fallback(stats: dict[str, Any]) -> str:
    weak = stats.get("weak_tags") or []
    solve_rate = stats.get("solve_rate", 0)
    trend = stats.get("rating_trend", 0)
    weak_text = ", ".join(weak) if weak else "no major weak spots"
    direction = "climbing" if trend >= 0 else "slipping"
    return (
        f"Your solve rate is {solve_rate:.0%} and your rating is {direction}. "
        f"Weak topics: {weak_text}. "
        "Spend the next 3 days on 1200-1400 problems in those tags, then review due problems "
        "and run one 90-minute mock contest."
    )


def get_mentor_feedback(stats: dict[str, Any]) -> str:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return _fallback(stats)

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=api_key)
        model = os.getenv("MENTOR_MODEL", "claude-3-5-sonnet-latest")
        prompt = (
            "User's last 7 days of data:\n"
            f"- solve rate: {stats.get('solve_rate')}\n"
            f"- weak tags: {stats.get('weak_tags')}\n"
            f"- recent rating trend: {stats.get('rating_trend')}\n"
            f"- predicted next rating: {stats.get('predicted_rating')}\n\n"
            "Give constructive advice as their mentor."
        )
        response = client.messages.create(
            model=model,
            max_tokens=300,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )
        return "".join(block.text for block in response.content if getattr(block, "type", "") == "text")
    except Exception as exc:  # noqa: BLE001 - fall back gracefully in demo mode
        return _fallback(stats) + f"\n(Anthropic call failed: {exc.__class__.__name__})"
