import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

_driver = None


def get_driver():
    global _driver
    if _driver is None:
        _driver = GraphDatabase.driver(
            os.environ["NEO4J_URI"],
            auth=(os.environ["NEO4J_USER"], os.environ["NEO4J_PASSWORD"]),
        )
    return _driver


def close_driver():
    global _driver
    if _driver is not None:
        _driver.close()
        _driver = None


def list_domains() -> list[str]:
    """All distinct domains — these are your 'roadmaps' for the dashboard."""
    with get_driver().session() as session:
        result = session.run("MATCH (t:Topic) RETURN DISTINCT t.domain AS domain ORDER BY domain")
        return [r["domain"] for r in result]


def get_topics_by_domain(domain: str) -> list[dict]:
    """All topic nodes belonging to a domain, e.g. for building a full roadmap view."""
    with get_driver().session() as session:
        result = session.run(
            """
            MATCH (t:Topic {domain: $domain})
            RETURN t.id AS id, t.name AS name, t.difficulty_level AS difficulty_level,
                   t.description AS description
            ORDER BY t.difficulty_level, t.name
            """,
            domain=domain,
        )
        return [dict(r) for r in result]


def get_prerequisite_edges(domain: str) -> list[dict]:
    """All PREREQUISITE_OF edges within a domain — used to build/order the roadmap DAG."""
    with get_driver().session() as session:
        result = session.run(
            """
            MATCH (a:Topic {domain: $domain})-[:PREREQUISITE_OF]->(b:Topic {domain: $domain})
            RETURN a.id AS from_id, b.id AS to_id
            """,
            domain=domain,
        )
        return [dict(r) for r in result]


def get_topic(topic_id: str) -> dict | None:
    with get_driver().session() as session:
        result = session.run(
            """
            MATCH (t:Topic {id: $topic_id})
            RETURN t.id AS id, t.name AS name, t.domain AS domain,
                   t.difficulty_level AS difficulty_level, t.description AS description
            """,
            topic_id=topic_id,
        )
        record = result.single()
        return dict(record) if record else None


def get_prerequisites(topic_id: str) -> list[dict]:
    """Direct prerequisite topics (must come before this one)."""
    with get_driver().session() as session:
        result = session.run(
            """
            MATCH (pre:Topic)-[:PREREQUISITE_OF]->(t:Topic {id: $topic_id})
            RETURN pre.id AS id, pre.name AS name, pre.difficulty_level AS difficulty_level
            """,
            topic_id=topic_id,
        )
        return [dict(r) for r in result]


def get_dependents(topic_id: str) -> list[dict]:
    """Direct next topics that this one unlocks."""
    with get_driver().session() as session:
        result = session.run(
            """
            MATCH (t:Topic {id: $topic_id})-[:PREREQUISITE_OF]->(next:Topic)
            RETURN next.id AS id, next.name AS name, next.difficulty_level AS difficulty_level
            """,
            topic_id=topic_id,
        )
        return [dict(r) for r in result]


def get_top_resources(topic_id: str, k: int = 10) -> list[dict]:
    """Top-scored resources teaching a topic, already pruned to top-10 at ingest time."""
    with get_driver().session() as session:
        result = session.run(
            """
            MATCH (r:Resource)-[e:TEACHES]->(:Topic {id: $topic_id})
            RETURN r.id AS id, r.title AS title, r.type AS type, r.provider AS provider,
                   r.rating AS rating, r.est_hours AS est_hours, r.difficulty AS difficulty,
                   r.url AS url, e.score AS score
            ORDER BY e.score DESC
            LIMIT $k
            """,
            topic_id=topic_id,
            k=k,
        )
        return [dict(r) for r in result]


def search_topics(query_text: str) -> list[dict]:
    """Simple case-insensitive match on name/description — used to ground free-text goals."""
    with get_driver().session() as session:
        result = session.run(
            """
            MATCH (t:Topic)
            WHERE toLower(t.name) CONTAINS toLower($q)
               OR toLower(t.description) CONTAINS toLower($q)
               OR toLower(t.domain) CONTAINS toLower($q)
            RETURN t.id AS id, t.name AS name, t.domain AS domain,
                   t.difficulty_level AS difficulty_level
            """,
            q=query_text,
        )
        return [dict(r) for r in result]


if __name__ == "__main__":
    # quick manual sanity check
    print("Domains:", list_domains())
    print("Topics in Data Science:", [t["name"] for t in get_topics_by_domain("Data Science")])
    print("Prereqs of ds_ml_fundamentals:", get_prerequisites("ds_ml_fundamentals"))
    print("Top resources for ds_python_basics:", [r["title"] for r in get_top_resources("ds_python_basics")])
    print("Search 'react':", search_topics("react"))
    close_driver()