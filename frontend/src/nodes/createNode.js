// createNode.js
// Factory: turns a config (see nodeConfigs.js) into a real component that
// ReactFlow's nodeTypes map can use.

import { BaseNode } from './BaseNode';

export const createNode = (spec) => {
  const NodeComponent = ({ id, data }) => <BaseNode id={id} data={data} spec={spec} />;
  NodeComponent.displayName = `Node(${spec.label})`;
  return NodeComponent;
};
