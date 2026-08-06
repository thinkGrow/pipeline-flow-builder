// NodeField.js
// Renders one field inside a node, based on its config (text/select/number/textarea).

import { useLayoutEffect, useRef } from 'react';

const MIN_WIDTH = 160;
const MAX_WIDTH = 360;
const CHAR_WIDTH = 7;

export const NodeField = ({ field, value, onChange }) => {
  const textareaRef = useRef(null);

  // Auto-grow a textarea field to fit its content - height from scrollHeight,
  // width from the longest line. The node box itself has no fixed size, so
  // it passively wraps around whatever size this element becomes.
  useLayoutEffect(() => {
    if (field.type !== 'textarea') return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    const longestLine = Math.max(...String(value).split('\n').map((line) => line.length), 1);
    el.style.width = `${Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, longestLine * CHAR_WIDTH + 24))}px`;
  }, [field.type, value]);

  const handleChange = (e) => {
    const raw = e.target.value;
    onChange(field.type === 'number' ? Number(raw) : raw);
  };

  return (
    <label className="node-field">
      <span className="node-field-label">{field.label}</span>
      {field.type === 'select' ? (
        <select className="node-field-input" value={value} onChange={handleChange}>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          ref={textareaRef}
          className="node-field-input node-field-textarea"
          value={value}
          onChange={handleChange}
          rows={1}
        />
      ) : (
        <input
          className="node-field-input"
          type={field.type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={handleChange}
        />
      )}
    </label>
  );
};
