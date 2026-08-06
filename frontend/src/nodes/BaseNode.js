// BaseNode.js
// The generic renderer every node type is built from: a title, a list of
// fields, and a list of connector Handles (auto-spaced per side). Handles
// can also be computed live from field values via spec.getExtraHandles.

import { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
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
const getPositionPercent = (index, total) => ((index + 1) / (total + 1)) * 100;

const getHandleStyle = (side, percent) =>
  isVerticalSide(side) ? { top: `${percent}%` } : { left: `${percent}%` };

const getLabelStyle = (side, percent) =>
  isVerticalSide(side) ? { top: `${percent}%` } : { left: `${percent}%` };

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
  const removeStaleEdges = useStore((state) => state.removeStaleEdges);
  const updateNodeInternals = useUpdateNodeInternals();

  const fieldValues = {};
  spec.fields.forEach((field) => {
    const defaultValue =
      typeof field.default === 'function' ? field.default(id) : field.default;
    fieldValues[field.key] = data?.[field.key] ?? defaultValue;
  });

  const extraHandles = spec.getExtraHandles ? spec.getExtraHandles(fieldValues) : [];
  const handles = [...spec.handles, ...extraHandles];
  const handlesBySide = groupHandlesBySide(handles);

  // ReactFlow caches handle positions per node - if the handle set changes
  // after the first render (e.g. a new {{variable}} was typed), it must be
  // told explicitly or existing connection lines won't reposition.
  const handleKey = handles.map((handle) => `${handle.side}:${handle.id}`).join('|');
  useEffect(() => {
    updateNodeInternals(id);
    const validHandleIds = handles.map((handle) => `${id}-${handle.id}`);
    removeStaleEdges(id, validHandleIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, handleKey, updateNodeInternals, removeStaleEdges]);

  return (
    <div className="node">
      <div className="node-header">{spec.label}</div>
      {spec.description && <div className="node-description">{spec.description}</div>}
      {spec.fields.length > 0 && (
        <div className="node-fields">
          {spec.fields.map((field) => (
            <NodeField
              key={field.key}
              field={field}
              value={fieldValues[field.key]}
              onChange={(newValue) => updateNodeField(id, field.key, newValue)}
            />
          ))}
        </div>
      )}
      {Object.entries(handlesBySide).map(([side, sideHandles]) =>
        sideHandles.map((handle, index) => {
          const percent = getPositionPercent(index, sideHandles.length);
          return (
            <div key={handle.id}>
              <Handle
                type={handle.type}
                position={SIDE_TO_POSITION[side]}
                id={`${id}-${handle.id}`}
                style={getHandleStyle(side, percent)}
              />
              <span
                className={`handle-label handle-label-${side}`}
                style={getLabelStyle(side, percent)}
              >
                {handle.label ?? handle.id}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};
