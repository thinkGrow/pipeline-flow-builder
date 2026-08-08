# Pipeline Flow Builder

A drag-and-drop pipeline builder. Drag nodes onto a canvas, connect them into a flow, and submit the pipeline to a backend that checks whether it's a valid, cycle-free pipeline.

Built with React and ReactFlow on the frontend, and Python/FastAPI on the backend.

## Features

- **Config-driven node system**: every node type is a small declarative object (title, fields, connector handles). Adding a new node type is a few lines of data, no new component needed.
- **9 node types**: Input, Output, LLM, Text, Note, Math, Filter, Delay, and API Request.
- **Live variable detection**: the Text node scans its content for `{{variableName}}` and creates a connector handle per unique variable, live as you type.
- **Auto-resizing text field**: the Text node's box grows in width and height to fit its content.
- **Unified visual design**: one shared set of design tokens (colors, type, spacing) drives every component, loosely inspired by VectorShift's own visual language.
- **Backend pipeline validation**: counts nodes and edges, and checks whether the graph is a valid DAG (no cycles), returning the result to the frontend.

## Project structure

```
frontend/
  src/
    App.js, ui.js, toolbar.js, submit.js   # app shell, canvas, toolbar, submit button
    store.js                               # shared state (nodes, edges, field values)
    ResultModal.js                         # popup shown after submitting a pipeline
    nodes/
      nodeConfigs.js   # one small config per node type
      BaseNode.js      # generic renderer every node type is built from
      NodeField.js     # renders one field (text/select/number/textarea)
      createNode.js    # turns a config into a component
      index.js         # builds the nodeTypes map ReactFlow needs
backend/
  main.py              # FastAPI app: /pipelines/parse endpoint + DAG check
  requirements.txt
```

## Getting started

You'll need Node.js for the frontend and Python 3.9+ for the backend. Both servers need to be running at the same time for full functionality, since submitting a pipeline calls the backend.

### Frontend

```
cd frontend
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

### Backend

```
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Runs at [http://localhost:8000](http://localhost:8000).

## How it works

1. Drag a node type from the toolbar onto the canvas.
2. Connect nodes by dragging between their connector dots.
3. Click **Submit Pipeline**. The frontend sends the current nodes and edges to the backend.
4. The backend counts them and checks for cycles, returning `{ num_nodes, num_edges, is_dag }`.
5. The result is shown in a popup: node/edge counts, and whether the pipeline is valid (cycle-free) or not.
