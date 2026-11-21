# CP Mentor Hub — AI Engine (Python / FastAPI)

Local analytics service used by the desktop app for:

| Endpoint | What it does |
|---|---|
| `POST /weakness` | KMeans clustering of tag wrong-ratios into strong / medium / weak |
| `POST /skill-graph` | Builds a prerequisite DAG with networkx and highlights gaps |
| `POST /predict` | Linear-regression rating projection + consistency score |
| `POST /mentor` | Claude-powered mentor reply (falls back to rule-based offline) |

## Setup

```bash
cd python-engine
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app:app --reload --port 8000
```

Open http://localhost:8000/docs for the interactive API docs.

## Optional environment variables

```bash
export ANTHROPIC_API_KEY="sk-ant-..."   # enables real AI Mentor replies
export MENTOR_MODEL="claude-3-5-sonnet-latest"
```

Without `ANTHROPIC_API_KEY`, the mentor endpoint uses a deterministic rule-based
reply so the demo works with no secrets.

## Run tests

```bash
pip install -r requirements-dev.txt
python3 -m pytest -q
```

## Quick test

```bash
curl -X POST http://localhost:8000/predict \
  -H 'Content-Type: application/json' \
  -d '{"ratings":[1180,1215,1254,1290,1330,1310,1355,1390,1423],"horizon":3}'
```
