// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }

          return node;
        }),
      });
    },
    // Drops any edge attached to a handle that no longer exists on a node
    // (e.g. a {{variable}} was removed from a Text node's content), so a
    // stale connection doesn't get silently mis-rendered onto another handle.
    removeStaleEdges: (nodeId, validHandleIds) => {
      const validSet = new Set(validHandleIds);
      const edges = get().edges;
      const nextEdges = edges.filter((edge) => {
        const sourceOk = edge.source !== nodeId || validSet.has(edge.sourceHandle);
        const targetOk = edge.target !== nodeId || validSet.has(edge.targetHandle);
        return sourceOk && targetOk;
      });
      if (nextEdges.length !== edges.length) {
        set({ edges: nextEdges });
      }
    },
  }));
