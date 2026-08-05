// NodeField.js
// Renders one field inside a node, based on its config (text/select/number).

export const NodeField = ({ field, value, onChange }) => {
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
