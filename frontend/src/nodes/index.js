// nodes/index.js
// Builds ReactFlow's nodeTypes map from nodeConfigs, so adding a node type
// to the config is all that's needed to make it available on the canvas.

import { createNode } from './createNode';
import { nodeConfigs } from './nodeConfigs';

export const nodeTypes = Object.fromEntries(
  nodeConfigs.map((config) => [config.type, createNode(config)])
);

export { nodeConfigs };
