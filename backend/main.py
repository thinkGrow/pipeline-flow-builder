from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*'],
)


class Node(BaseModel):
    model_config = ConfigDict(extra='allow')
    id: str


class Edge(BaseModel):
    model_config = ConfigDict(extra='allow')
    source: str
    target: str


class Pipeline(BaseModel):
    nodes: list[Node]
    edges: list[Edge]


def is_dag(node_ids: list[str], edges: list[Edge]) -> bool:
    adjacency = {node_id: [] for node_id in node_ids}
    for edge in edges:
        if edge.source in adjacency and edge.target in adjacency:
            adjacency[edge.source].append(edge.target)

    UNVISITED, VISITING, DONE = 0, 1, 2
    state = {node_id: UNVISITED for node_id in node_ids}

    def has_cycle_from(start):
        state[start] = VISITING
        for neighbor in adjacency[start]:
            if state[neighbor] == VISITING:
                return True
            if state[neighbor] == UNVISITED and has_cycle_from(neighbor):
                return True
        state[start] = DONE
        return False

    return not any(
        has_cycle_from(node_id) for node_id in node_ids if state[node_id] == UNVISITED
    )


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    node_ids = [node.id for node in pipeline.nodes]
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': is_dag(node_ids, pipeline.edges),
    }
