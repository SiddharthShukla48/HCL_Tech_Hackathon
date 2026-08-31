import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

driver = GraphDatabase.driver(
    os.environ["NEO4J_URI"],
    auth=(os.environ["NEO4J_USER"], os.environ["NEO4J_PASSWORD"]),
)

with driver.session() as session:
    result = session.run("RETURN 'Neo4j connection OK' AS msg")
    print(result.single()["msg"])

driver.close()