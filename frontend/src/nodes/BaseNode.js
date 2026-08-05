// BaseNode.js
// The generic renderer every node type is built from: a title, a list of
// fields, and a list of connector Handles (auto-spaced per side).

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { NodeField } from './NodeField';
import './nodes.css';

const SIDE_TO_POSITION = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

const isVerticalSide = (side) => side === 'left' || side === 'right';

// Spreads N handles evenly along the side instead of hand-typed percentages.
const getHandleStyle = (side, index, total) => {
  if (total <= 1) return undefined;
  const percent = ((index + 1) / (total + 1)) * 100;
  return isVerticalSide(side) ? { top: `${percent}%` } : { left: `${percent}%` };
};

const groupHandlesBySide = (handles) => {
  const groups = {};
  handles.forEach((handle) => {
    groups[handle.side] = groups[handle.side] || [];
    groups[handle.side].push(handle);
  });
  return groups;
};

export const BaseNode = ({ id, data, spec }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const handlesBySide = groupHandlesBySide(spec.handles);

  return (
    <div className="node">
      <div className="node-header">{spec.label}</div>
      {spec.description && <div className="node-description">{spec.description}</div>}
      {spec.fields.length > 0 && (
        <div className="node-fields">
          {spec.fields.map((field) => {
            const defaultValue =
              typeof field.default === 'function' ? field.default(id) : field.default;
            const value = data?.[field.key] ?? defaultValue;
            return (
              <NodeField
                key={field.key}
                field={field}
                value={value}
                onChange={(newValue) => updateNodeField(id, field.key, newValue)}
              />
            );
          })}
        </div>
      )}
      {Object.entries(handlesBySide).map(([side, handles]) =>
        handles.map((handle, index) => (
          <Handle
            key={handle.id}
            type={handle.type}
            position={SIDE_TO_POSITION[side]}
            id={`${id}-${handle.id}`}
            style={getHandleStyle(side, index, handles.length)}
          />
        ))
      )}
    </div>
  );
};
