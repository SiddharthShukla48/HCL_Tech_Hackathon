import json
import math
import os
from pathlib import Path

from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
TOP_K_PER_TOPIC = 10

PROVIDER_TRUST = {
    "Coursera": 0.9,
    "Udacity": 0.85,
    "freeCodeCamp": 0.85,
    "YouTube": 0.6,
    "Independent": 0.55,
}


def compute_score(resource: dict, relevance: float, max_review_count: int) -> float:
    normalized_rating = resource["rating"] / 5.0
    review_factor = (
        math.log1p(resource["review_count"]) / math.log1p(max_review_count)
        if max_review_count > 0
        else 0.0
    )
    trust = PROVIDER_TRUST.get(resource["provider"], 0.6)
    score = 0.35 * normalized_rating + 0.25 * review_factor + 0.2 * trust + 0.2 * relevance
    return round(score, 4)


def load_json(filename: str) -> dict:
    with open(DATA_DIR / filename, encoding="utf-8") as f:
        return json.load(f)


def main():
    topics_data = load_json("seed_topics.json")
    resources_data = load_json("seed_resources.json")

    topics = topics_data["topics"]
    prerequisites = topics_data["prerequisites"]
    resources = resources_data["resources"]

    max_review_count = max(r["review_count"] for r in resources)

    teaches_rows = []
    for res in resources:
        for t in res["teaches"]:
            score = compute_score(res, t["relevance"], max_review_count)
            teaches_rows.append(
                {
                    "resource_id": res["id"],
                    "topic_id": t["topic_id"],
                    "relevance": t["relevance"],
                    "score": score,
                }
            )

    driver = GraphDatabase.driver(
        os.environ["NEO4J_URI"],
        auth=(os.environ["NEO4J_USER"], os.environ["NEO4J_PASSWORD"]),
    )

    with driver.session() as session:
        print("Clearing existing graph...")
        session.run("MATCH (n) DETACH DELETE n")

        session.run(
            "CREATE CONSTRAINT topic_id IF NOT EXISTS FOR (t:Topic) REQUIRE t.id IS UNIQUE"
        )
        session.run(
            "CREATE CONSTRAINT resource_id IF NOT EXISTS FOR (r:Resource) REQUIRE r.id IS UNIQUE"
        )

        print(f"Loading {len(topics)} topics...")
        session.run(
            """
            UNWIND $topics AS topic
            MERGE (t:Topic {id: topic.id})
            SET t.name = topic.name,
                t.domain = topic.domain,
                t.difficulty_level = topic.difficulty_level,
                t.description = topic.description
            """,
            topics=topics,
        )

        print(f"Loading {len(prerequisites)} prerequisite edges...")
        session.run(
            """
            UNWIND $prereqs AS p
            MATCH (a:Topic {id: p.from}), (b:Topic {id: p.to})
            MERGE (a)-[:PREREQUISITE_OF]->(b)
            """,
            prereqs=prerequisites,
        )

        print(f"Loading {len(resources)} resources...")
        session.run(
            """
            UNWIND $resources AS res
            MERGE (r:Resource {id: res.id})
            SET r.title = res.title,
                r.type = res.type,
                r.provider = res.provider,
                r.rating = res.rating,
                r.review_count = res.review_count,
                r.est_hours = res.est_hours,
                r.difficulty = res.difficulty,
                r.url = res.url
            """,
            resources=resources,
        )

        print(f"Loading {len(teaches_rows)} TEACHES edges...")
        session.run(
            """
            UNWIND $teaches AS t
            MATCH (r:Resource {id: t.resource_id}), (topic:Topic {id: t.topic_id})
            MERGE (r)-[e:TEACHES]->(topic)
            SET e.relevance_score = t.relevance, e.score = t.score
            """,
            teaches=teaches_rows,
        )

        print(f"Pruning to top-{TOP_K_PER_TOPIC} resources per topic...")
        session.run(
            """
            MATCH (:Topic)<-[e:TEACHES]-(:Resource)
            WITH e.score AS s, e
            ORDER BY s DESC
            WITH e
            MATCH (t:Topic)<-[e]-(:Resource)
            WITH t, collect(e) AS edges
            WHERE size(edges) > $k
            UNWIND edges[$k..] AS toRemove
            DELETE toRemove
            """,
            k=TOP_K_PER_TOPIC,
        )

        counts = session.run(
            """
            MATCH (t:Topic) WITH count(t) AS topics
            MATCH (r:Resource) WITH topics, count(r) AS resources
            MATCH ()-[e:TEACHES]->() WITH topics, resources, count(e) AS teaches
            MATCH ()-[p:PREREQUISITE_OF]->() RETURN topics, resources, teaches, count(p) AS prereqs
            """
        ).single()
        print(
            f"Done. Topics={counts['topics']} Resources={counts['resources']} "
            f"TEACHES={counts['teaches']} PREREQUISITE_OF={counts['prereqs']}"
        )

    driver.close()


if __name__ == "__main__":
    main()