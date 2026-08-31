import kg


import json
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

MODEL = "qwen/qwen3.8-27b"
_groq_client = None


def get_groq_client() -> Groq:
    global _groq_client
    if _groq_client is None:
        _groq_client = Groq(api_key=os.environ["GROQ_API_KEY"])
    return _groq_client


def _llm(system_prompt: str, user_prompt: str, temperature: float = 0.2) -> str:
    client = get_groq_client()
    response = client.chat.completions.create(
        model=MODEL,
        temperature=temperature,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response.choices[0].message.content.strip()


def _llm_json(system_prompt: str, user_prompt: str, fallback: dict) -> dict:
    raw = _llm(system_prompt, user_prompt, temperature=0.0)
    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.lower().startswith("json"):
            raw = raw[4:]
    try:
        return json.loads(raw.strip())
    except (json.JSONDecodeError, ValueError):
        return fallback

MASTERY_THRESHOLD = 2  # proficiency 0-3; >=2 means "skip, already know this"
MILESTONE_SIZE = 3


def _build_domain_graph(domain: str):
    topics = kg.get_topics_by_domain(domain)
    edges = kg.get_prerequisite_edges(domain)

    topic_by_id = {t["id"]: t for t in topics}
    forward_adj: dict[str, list[str]] = {t["id"]: [] for t in topics}   # prereq -> dependents
    reverse_adj: dict[str, list[str]] = {t["id"]: [] for t in topics}   # topic -> its prereqs

    for e in edges:
        forward_adj.setdefault(e["from_id"], []).append(e["to_id"])
        reverse_adj.setdefault(e["to_id"], []).append(e["from_id"])

    return topic_by_id, forward_adj, reverse_adj


def _ancestors_of(target_ids: list[str], reverse_adj: dict[str, list[str]]) -> set[str]:
    """All transitive prerequisites of the given topics, plus the topics themselves."""
    seen = set()
    stack = list(target_ids)
    while stack:
        current = stack.pop()
        if current in seen:
            continue
        seen.add(current)
        for prereq_id in reverse_adj.get(current, []):
            if prereq_id not in seen:
                stack.append(prereq_id)
    return seen


def _topological_order(keep_ids: set[str], topic_by_id: dict, forward_adj: dict, reverse_adj: dict) -> list[str]:
    """Kahn's algorithm restricted to keep_ids, stable by (difficulty, name) on ties."""
    in_degree = {tid: 0 for tid in keep_ids}
    for tid in keep_ids:
        for prereq_id in reverse_adj.get(tid, []):
            if prereq_id in keep_ids:
                in_degree[tid] += 1

    difficulty_rank = {"beginner": 0, "intermediate": 1, "advanced": 2}
    ready = sorted(
        [tid for tid, d in in_degree.items() if d == 0],
        key=lambda tid: (difficulty_rank.get(topic_by_id[tid]["difficulty_level"], 1), topic_by_id[tid]["name"]),
    )

    ordered = []
    while ready:
        current = ready.pop(0)
        ordered.append(current)
        for dependent_id in forward_adj.get(current, []):
            if dependent_id in keep_ids:
                in_degree[dependent_id] -= 1
                if in_degree[dependent_id] == 0:
                    ready.append(dependent_id)
        ready.sort(key=lambda tid: (difficulty_rank.get(topic_by_id[tid]["difficulty_level"], 1), topic_by_id[tid]["name"]))

    return ordered


def _explain_step(topic: dict, immediate_prereqs: list[dict], resources: list[dict]) -> dict:
    if immediate_prereqs:
        prereq_names = ", ".join(p["name"] for p in immediate_prereqs)
        reason = f"Comes after {prereq_names}, which you need before this topic makes sense."
    else:
        reason = "No prerequisites within this roadmap — a good starting point."

    top_resource_reason = None
    if resources:
        top = resources[0]
        top_resource_reason = (
            f"'{top['title']}' is ranked highest for this topic "
            f"(rating {top['rating']}/5, provider {top['provider']}, score {round(top['score'], 2)})."
        )

    return {
        "topic_id": topic["id"],
        "topic_name": topic["name"],
        "prerequisites": [p["id"] for p in immediate_prereqs],
        "reason": reason,
        "top_resource_reason": top_resource_reason,
    }


def generate_learning_path(
    domain: str,
    current_level: dict[str, int] | None = None,
    target_topic_ids: list[str] | None = None,
    resources_per_topic: int = 3,
) -> dict:
    """
    Build an ordered, milestone-grouped learning path for a domain.
    current_level: {topic_id: proficiency 0-3}, topics >= MASTERY_THRESHOLD are skipped.
    target_topic_ids: if given, only these topics + their prerequisites are included.
    """
    current_level = current_level or {}
    topic_by_id, forward_adj, reverse_adj = _build_domain_graph(domain)

    if target_topic_ids:
        keep_ids = _ancestors_of(target_topic_ids, reverse_adj) & set(topic_by_id.keys())
    else:
        keep_ids = set(topic_by_id.keys())

    ordered_ids = _topological_order(keep_ids, topic_by_id, forward_adj, reverse_adj)

    # drop topics the learner already knows, but only after ordering (keeps sequencing correct)
    path_ids = [tid for tid in ordered_ids if current_level.get(tid, 0) < MASTERY_THRESHOLD]

    steps = []
    for tid in path_ids:
        topic = topic_by_id[tid]
        immediate_prereqs = [topic_by_id[p] for p in reverse_adj.get(tid, []) if p in topic_by_id]
        resources = kg.get_top_resources(tid, k=resources_per_topic)
        steps.append(
            {
                "topic": topic,
                "resources": resources,
                "explanation": _explain_step(topic, immediate_prereqs, resources),
            }
        )

    milestones = [
        {"milestone_number": i // MILESTONE_SIZE + 1, "steps": steps[i : i + MILESTONE_SIZE]}
        for i in range(0, len(steps), MILESTONE_SIZE)
    ]

    return {"domain": domain, "total_topics": len(steps), "milestones": milestones}


def get_progress_and_next_actions(domain: str, completed_resource_ids: set[str] | None = None) -> dict:
    """
    Given resources a learner has completed, compute per-topic status and next actions.
    Used both by the dashboard (default view, empty completed set) and after progress updates.
    """
    completed_resource_ids = completed_resource_ids or set()
    topic_by_id, forward_adj, reverse_adj = _build_domain_graph(domain)

    topic_status = {}
    topic_resources_cache = {}
    for tid, topic in topic_by_id.items():
        resources = kg.get_top_resources(tid, k=10)
        topic_resources_cache[tid] = resources
        resource_ids = {r["id"] for r in resources}
        topic_status[tid] = "done" if resource_ids & completed_resource_ids else "pending"

    next_actions = []
    for tid, topic in topic_by_id.items():
        if topic_status[tid] == "done":
            continue
        prereq_ids = reverse_adj.get(tid, [])
        prereqs_done = all(topic_status.get(p) == "done" for p in prereq_ids)
        if prereqs_done:
            topic_status[tid] = "current"
            resources = topic_resources_cache[tid]
            if resources:
                next_actions.append(
                    {
                        "topic_id": tid,
                        "topic_name": topic["name"],
                        "recommended_resource": resources[0],
                    }
                )
        else:
            topic_status[tid] = "locked"

    topics_out = [
        {**topic_by_id[tid], "status": status} for tid, status in topic_status.items()
    ]
    done_count = sum(1 for s in topic_status.values() if s == "done")
    progress_percent = round(100 * done_count / len(topic_by_id), 1) if topic_by_id else 0.0

    return {
        "domain": domain,
        "progress_percent": progress_percent,
        "topics": topics_out,
        "next_actions": next_actions,
    }


def _all_candidate_topics() -> list[dict]:
    candidates = []
    for domain in kg.list_domains():
        for t in kg.get_topics_by_domain(domain):
            candidates.append({**t, "domain": domain})
    return candidates


def parse_goal(user_message: str) -> dict:
    """Free-text goal -> grounded {domain, target_topic_ids}. Never invents topic ids."""
    candidates = _all_candidate_topics()
    listing = "\n".join(f"- {c['id']} | {c['name']} | domain: {c['domain']}" for c in candidates)

    system_prompt = (
        "You map a learner's goal to entries from a fixed topic list. "
        "Only use ids that appear in the list. Respond with JSON only, no prose:\n"
        '{"domain": "<one domain name or null>", "target_topic_ids": ["<id>", ...] or null}\n'
        "Set target_topic_ids to null if the user wants the whole domain rather than a specific topic."
    )
    user_prompt = f"Available topics:\n{listing}\n\nUser goal: \"{user_message}\""

    result = _llm_json(system_prompt, user_prompt, fallback={"domain": None, "target_topic_ids": None})

    valid_ids = {c["id"] for c in candidates}
    valid_domains = set(kg.list_domains())
    if result.get("domain") not in valid_domains:
        result["domain"] = None
    if result.get("target_topic_ids"):
        result["target_topic_ids"] = [t for t in result["target_topic_ids"] if t in valid_ids] or None
    return result


def explain_path_intro(path: dict) -> str:
    first_milestone = path["milestones"][0] if path["milestones"] else None
    first_topics = [s["topic"]["name"] for s in first_milestone["steps"]] if first_milestone else []

    system_prompt = (
        "You are a friendly learning assistant. Write a short, warm 3-4 sentence intro to a "
        "learning roadmap you generated. Only mention the domain, topic count, and the first "
        "topics given below — do not invent any other topics or resources."
    )
    user_prompt = (
        f"Domain: {path['domain']}\n"
        f"Total topics remaining: {path['total_topics']}\n"
        f"First topics to start with: {', '.join(first_topics) if first_topics else 'none — path is empty'}"
    )
    return _llm(system_prompt, user_prompt, temperature=0.4)


def phrase_explanation(explanation: dict) -> str:
    system_prompt = (
        "You are a friendly learning assistant. Turn the structured reasoning below into a "
        "natural 2-3 sentence explanation. Do not add facts that aren't given."
    )
    user_prompt = json.dumps(explanation)
    return _llm(system_prompt, user_prompt, temperature=0.4)


def classify_intent(message: str, current_path: dict | None) -> dict:
    topics_in_path = []
    if current_path:
        for m in current_path["milestones"]:
            for s in m["steps"]:
                topics_in_path.append({"id": s["topic"]["id"], "name": s["topic"]["name"]})
    listing = "\n".join(f"- {t['id']} | {t['name']}" for t in topics_in_path) or "(none)"

    system_prompt = (
        "Classify the user's message about their learning path. Respond with JSON only:\n"
        '{"intent": "mark_known" | "why_question" | "general", "topic_id": "<id from list or null>"}\n'
        "mark_known = user says they already know/have done a specific topic.\n"
        "why_question = user asks why a specific topic is included or ordered a certain way.\n"
        "general = anything else. Only use topic ids from the list below, else use null."
    )
    user_prompt = f"Topics in current path:\n{listing}\n\nMessage: \"{message}\""

    return _llm_json(system_prompt, user_prompt, fallback={"intent": "general", "topic_id": None})


def general_reply(message: str, path_summary: str) -> str:
    system_prompt = (
        "You are a friendly learning-path assistant. Answer the user's message helpfully and "
        "briefly, using only the roadmap context given — do not invent topics, resources, or facts "
        "not present in the context."
    )
    user_prompt = f"Roadmap context:\n{path_summary}\n\nUser message: \"{message}\""
    return _llm(system_prompt, user_prompt, temperature=0.4)


def _summarize_path(path: dict | None) -> str:
    if not path:
        return "No roadmap selected yet."
    lines = [f"Domain: {path['domain']} ({path['total_topics']} topics remaining)"]
    for m in path["milestones"]:
        names = ", ".join(s["topic"]["name"] for s in m["steps"])
        lines.append(f"Milestone {m['milestone_number']}: {names}")
    return "\n".join(lines)


def _find_explanation(path: dict | None, topic_id: str) -> dict | None:
    if not path:
        return None
    for m in path["milestones"]:
        for s in m["steps"]:
            if s["topic"]["id"] == topic_id:
                return s["explanation"]
    return None


def handle_chat_message(profile: dict, message: str) -> dict:
    """
    profile: {"domain": str|None, "current_level": {topic_id:int}, "target_topic_ids": [...]|None, "last_path": dict|None}
    Returns {"profile": updated_profile, "reply": str, "path": dict|None}
    """
    profile = dict(profile)
    profile.setdefault("current_level", {})

    if not profile.get("domain"):
        parsed = parse_goal(message)
        if not parsed.get("domain"):
            reply = general_reply(
                message,
                "No roadmap selected yet. Available domains: " + ", ".join(kg.list_domains()),
            )
            return {"profile": profile, "reply": reply, "path": None}

        profile["domain"] = parsed["domain"]
        profile["target_topic_ids"] = parsed.get("target_topic_ids")
        path = generate_learning_path(profile["domain"], profile["current_level"], profile["target_topic_ids"])
        profile["last_path"] = path
        return {"profile": profile, "reply": explain_path_intro(path), "path": path}

    current_path = profile.get("last_path")
    intent = classify_intent(message, current_path)

    if intent["intent"] == "mark_known" and intent.get("topic_id"):
        profile["current_level"][intent["topic_id"]] = 3
        path = generate_learning_path(profile["domain"], profile["current_level"], profile.get("target_topic_ids"))
        profile["last_path"] = path
        topic_name = kg.get_topic(intent["topic_id"])["name"]
        reply = f"Got it — marking '{topic_name}' as known and updating your path.\n\n{explain_path_intro(path)}"
        return {"profile": profile, "reply": reply, "path": path}

    if intent["intent"] == "why_question" and intent.get("topic_id"):
        explanation = _find_explanation(current_path, intent["topic_id"])
        reply = phrase_explanation(explanation) if explanation else "That topic isn't in your current path."
        return {"profile": profile, "reply": reply, "path": current_path}

    reply = general_reply(message, _summarize_path(current_path))
    return {"profile": profile, "reply": reply, "path": current_path}

if __name__ == "__main__":
    profile = {"domain": None, "current_level": {}, "target_topic_ids": None, "last_path": None}

    turn1 = handle_chat_message(profile, "I want to learn machine learning")
    print("USER: I want to learn machine learning")
    print("BOT:", turn1["reply"], "\n")
    profile = turn1["profile"]

    turn2 = handle_chat_message(profile, "I already know Python")
    print("USER: I already know Python")
    print("BOT:", turn2["reply"], "\n")
    profile = turn2["profile"]

    turn3 = handle_chat_message(profile, "Why do I need statistics before ML fundamentals?")
    print("USER: Why do I need statistics before ML fundamentals?")
    print("BOT:", turn3["reply"])

    kg.close_driver()