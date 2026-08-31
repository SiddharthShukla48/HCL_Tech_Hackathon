import math
import sys
import uuid
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import agents
import kg

app = FastAPI(title="Learning Path Recommender")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# in-memory profile store — no auth, no persistence across restarts
PROFILES: dict[str, dict] = {}

HARDCODED_USER = {"id": "user_001", "name": "Siddharth Shukla"}


def _new_profile() -> dict:
    return {
        "domain": None,
        "current_level": {},
        "target_topic_ids": None,
        "last_path": None,
        "completed_resource_ids": set(),
    }


def _get_profile(learner_id: str) -> dict:
    if learner_id not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown learner_id. Call POST /session first.")
    return PROFILES[learner_id]


def _slugify(value: str) -> str:
    return value.strip().lower().replace(" & ", "-").replace("/", "-").replace(" ", "-").replace("_", "-")


def _domain_from_roadmap_id(roadmap_id: str) -> str | None:
    candidates = {"/".join(part for part in domain.lower().replace("&", "and").split()): domain for domain in kg.list_domains()}
    lookup = {"".join(ch if ch.isalnum() else "-" for ch in domain.lower()): domain for domain in kg.list_domains()}
    slug = _slugify(roadmap_id)
    return lookup.get(slug) or next((domain for domain in kg.list_domains() if _slugify(domain) == slug), None)


def _build_roadmap_summary(domain: str) -> dict:
    topics = kg.get_topics_by_domain(domain)
    return {
        "id": _slugify(domain),
        "title": domain,
        "shortDescription": f"A structured learning path to build practical skills in {domain}.",
        "durationWeeks": max(4, math.ceil(len(topics) * 1.7)),
        "skillTags": [topic["name"] for topic in topics[:3]],
        "progressPercent": 0,
        "completed": False,
    }


def _build_roadmap_detail(domain: str) -> dict:
    path = agents.generate_learning_path(domain)
    steps = []
    resources = []
    for milestone in path.get("milestones", []):
        for step in milestone.get("steps", []):
            topic = step["topic"]
            step_record = {
                "id": topic["id"],
                "title": topic["name"],
                "durationWeeks": 1,
                "description": step["explanation"].get("reason") or topic.get("description") or "Core topic in this roadmap.",
                "skillsGained": [topic["name"], *[resource["title"] for resource in step.get("resources", [])[:2]]],
                "subtopics": [resource["title"] for resource in step.get("resources", [])[:4]] or [topic["name"]],
                "completed": False,
            }
            steps.append(step_record)
            for resource in step.get("resources", []):
                resources.append({
                    "id": resource["id"],
                    "title": resource["title"],
                    "description": f"{resource['type']} recommendation for {topic['name']}.",
                    "type": resource.get("type", "course"),
                    "link": resource.get("url") or "https://example.com",
                    "completed": False,
                })

    milestones_overview = []
    for idx, milestone in enumerate(path.get("milestones", []), start=1):
        milestone_titles = [
            step["topic"]["name"]
            for step in milestone.get("steps", [])[:3]
            if isinstance(step, dict) and isinstance(step.get("topic"), dict)
        ]
        milestones_overview.append(
            f"Milestone {idx}: {', '.join(milestone_titles) if milestone_titles else 'Continue learning'}"
        )

    return {
        "id": _slugify(domain),
        "title": domain,
        "description": f"This learning path helps you move from fundamentals to advanced concepts in {domain}.",
        "durationWeeks": max(4, math.ceil(len(steps) * 1.5)),
        "skillTags": [topic["name"] for topic in kg.get_topics_by_domain(domain)[:3]],
        "prerequisites": [
            "Start with the basics and follow the recommended order of the roadmap.",
            "Work through the listed resources before moving to the next milestone.",
        ],
        "milestonesOverview": milestones_overview,
        "steps": steps,
        "resources": resources,
    }


# ---------- request/response models ----------

class SessionResponse(BaseModel):
    learner_id: str


class ChatRequest(BaseModel):
    learner_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str
    domain: Optional[str]
    path: Optional[dict]


class RoadmapSummary(BaseModel):
    domain: str
    topic_count: int


class ProgressUpdateRequest(BaseModel):
    learner_id: str
    resource_id: str


# ---------- endpoints ----------

@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/session", response_model=SessionResponse)
def create_session():
    learner_id = str(uuid.uuid4())
    PROFILES[learner_id] = _new_profile()
    return SessionResponse(learner_id=learner_id)


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    profile = _get_profile(req.learner_id)
    result = agents.handle_chat_message(profile, req.message)
    PROFILES[req.learner_id] = result["profile"]
    return ChatResponse(
        reply=result["reply"],
        domain=result["profile"].get("domain"),
        path=result["path"],
    )


@app.get("/roadmaps", response_model=list[RoadmapSummary])
def legacy_list_roadmaps():
    return [RoadmapSummary(domain=domain, topic_count=len(kg.get_topics_by_domain(domain))) for domain in kg.list_domains()]


@app.get("/api/roadmaps")
def list_roadmaps():
    return [_build_roadmap_summary(domain) for domain in kg.list_domains()]


@app.get("/roadmap/{domain}/progress")
def legacy_roadmap_progress(domain: str, learner_id: str):
    profile = _get_profile(learner_id)
    if domain not in kg.list_domains():
        raise HTTPException(status_code=404, detail=f"Unknown domain '{domain}'")
    return agents.get_progress_and_next_actions(domain, profile["completed_resource_ids"])


@app.get("/api/roadmaps/{roadmap_id}")
def get_roadmap_detail(roadmap_id: str):
    domain = _domain_from_roadmap_id(roadmap_id)
    if domain is None:
        raise HTTPException(status_code=404, detail=f"Unknown roadmap '{roadmap_id}'")
    return _build_roadmap_detail(domain)


@app.put("/api/roadmaps/{roadmap_id}/progress")
def save_roadmap_progress(roadmap_id: str, progress_state: dict):
    _domain_from_roadmap_id(roadmap_id)
    return {"ok": True, "roadmapId": roadmap_id, "saved": progress_state}


@app.get("/api/dashboard")
def get_dashboard():
    roadmaps = [_build_roadmap_summary(domain) for domain in kg.list_domains()]
    next_actions = []
    total_progress = 0
    for domain in kg.list_domains():
        progress = agents.get_progress_and_next_actions(domain, set())
        total_progress += progress.get("progress_percent", 0)
        for action in progress.get("next_actions", [])[:2]:
            next_actions.append({
                "id": f"{_slugify(domain)}-{action['topic_id']}",
                "text": f"Complete '{action['topic_name']}' in {domain}",
                "roadmapId": _slugify(domain),
            })

    distribution = []
    for domain in kg.list_domains()[:4]:
        topics = kg.get_topics_by_domain(domain)
        level = max(25, min(95, len(topics) * 12))
        distribution.append({"skill": domain, "level": level})

    return {
        "overallProgressPercent": round(total_progress / max(1, len(roadmaps))),
        "roadmapsCompleted": 0,
        "totalRoadmaps": len(roadmaps),
        "skillDistribution": distribution,
        "weeklyActivity": [
            {"week": "Week 1", "hoursSpent": 3},
            {"week": "Week 2", "hoursSpent": 5},
            {"week": "Week 3", "hoursSpent": 7},
            {"week": "Week 4", "hoursSpent": 6},
        ],
        "nextActions": next_actions[:4],
    }


@app.post("/api/chat/question")
def get_follow_up_question(payload: dict):
    step = int(payload.get("step", 1))
    if step <= 1:
        content = "What is your current skill level — beginner, intermediate, or advanced?"
    else:
        content = "Are you more interested in a technical path, a project-focused path, or a role-based goal?"
    return {"role": "assistant", "type": "question", "content": content}


@app.post("/api/chat/generate-roadmap")
def generate_roadmap_summary(payload: dict | None = None):
    payload = payload or {}
    message = payload.get("message") or payload.get("goal") or ""

    domain = None
    if message:
        parsed = agents.parse_goal(message)
        domain = parsed.get("domain")

    domain = domain or payload.get("domain") or next(iter(kg.list_domains()), "Data Science")
    roadmap_id = _slugify(domain)
    return {
        "role": "assistant",
        "type": "roadmap_summary",
        "content": f"I’ve mapped out a personalised {domain} roadmap for you. The path starts with foundational concepts and then progresses to practical milestones and project work.",
        "roadmapId": roadmap_id,
    }


@app.post("/progress")
def update_progress(req: ProgressUpdateRequest):
    profile = _get_profile(req.learner_id)
    profile["completed_resource_ids"].add(req.resource_id)

    response = {"marked_complete": req.resource_id}
    if profile.get("domain"):
        response["progress"] = agents.get_progress_and_next_actions(
            profile["domain"], profile["completed_resource_ids"]
        )
    return response


@app.on_event("shutdown")
def shutdown_event():
    kg.close_driver()