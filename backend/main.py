from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",  # React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    data: dict
    position: dict

nodes_list = []

@app.post("/nodes/", response_model=Node)
async def create_node(node: Node):
    nodes_list.append(node)
    return node

@app.get("/nodes/", response_model=List[Node])
async def get_nodes():
    return nodes_list
