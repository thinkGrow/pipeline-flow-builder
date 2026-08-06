// nodeConfigs.js
// One small config per node type: title, fields, and handles.
// This is the only place you touch to add/change a node type -
// BaseNode (via createNode) does the actual rendering.

export const nodeConfigs = [
  {
    type: 'customInput',
    label: 'Input',
    fields: [
      {
        key: 'inputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customInput-', 'input_'),
      },
      {
        key: 'inputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'File'],
        default: 'Text',
      },
    ],
    handles: [{ id: 'value', type: 'source', side: 'right' }],
  },
  {
    type: 'customOutput',
    label: 'Output',
    fields: [
      {
        key: 'outputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customOutput-', 'output_'),
      },
      {
        key: 'outputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'Image'],
        default: 'Text',
      },
    ],
    handles: [{ id: 'value', type: 'target', side: 'left' }],
  },
  {
    type: 'llm',
    label: 'LLM',
    description: 'This is a LLM.',
    fields: [],
    handles: [
      { id: 'system', type: 'target', side: 'left' },
      { id: 'prompt', type: 'target', side: 'left' },
      { id: 'response', type: 'source', side: 'right' },
    ],
  },
  {
    type: 'text',
    label: 'Text',
    fields: [{ key: 'text', label: 'Text', type: 'textarea', default: '{{input}}' }],
    handles: [{ id: 'output', type: 'source', side: 'right' }],
    // Scans the current text for {{variableName}} and adds one target
    // handle per unique variable found - this is the "escape hatch" that
    // lets a node's handles depend on its own live content.
    getExtraHandles: (fieldValues) => {
      const text = fieldValues.text ?? '';
      const variablePattern = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
      const seen = new Set();
      const handles = [];
      for (const match of text.matchAll(variablePattern)) {
        const variableName = match[1];
        if (!seen.has(variableName)) {
          seen.add(variableName);
          handles.push({
            id: `var-${variableName}`,
            type: 'target',
            side: 'left',
            label: variableName,
          });
        }
      }
      return handles;
    },
  },

  // --- 5 new node types demonstrating the abstraction ---

  {
    type: 'note',
    label: 'Note',
    fields: [{ key: 'content', label: 'Note', type: 'text', default: 'Add a note...' }],
    handles: [], // no connectors at all
  },
  {
    type: 'math',
    label: 'Math',
    fields: [
      {
        key: 'operation',
        label: 'Operation',
        type: 'select',
        options: ['+', '-', '*', '/'],
        default: '+',
      },
    ],
    handles: [
      { id: 'a', type: 'target', side: 'left' },
      { id: 'b', type: 'target', side: 'left' },
      { id: 'result', type: 'source', side: 'right' },
    ],
  },
  {
    type: 'filter',
    label: 'Filter',
    fields: [{ key: 'condition', label: 'Condition', type: 'text', default: 'value > 0' }],
    handles: [
      { id: 'input', type: 'target', side: 'left' },
      { id: 'pass', type: 'source', side: 'right' },
      { id: 'fail', type: 'source', side: 'right' },
    ],
  },
  {
    type: 'delay',
    label: 'Delay',
    fields: [{ key: 'ms', label: 'Delay (ms)', type: 'number', default: 1000 }],
    handles: [
      { id: 'input', type: 'target', side: 'left' },
      { id: 'output', type: 'source', side: 'right' },
    ],
  },
  {
    type: 'apiRequest',
    label: 'API Request',
    fields: [
      { key: 'url', label: 'URL', type: 'text', default: 'https://' },
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        default: 'GET',
      },
    ],
    handles: [
      { id: 'trigger', type: 'target', side: 'left' },
      { id: 'response', type: 'source', side: 'right' },
    ],
  },
];
