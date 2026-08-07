// submit.js

import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';
import { ResultModal } from './ResultModal';
import './submit.css';

const PARSE_ENDPOINT = 'http://localhost:8000/pipelines/parse';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(PARSE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      setResult(await response.json());
    } catch (err) {
      setError(err.message || 'Could not reach the backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-bar">
      <button
        type="button"
        className="submit-button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Pipeline'}
      </button>
      {(result || error) && (
        <ResultModal
          result={result}
          error={error}
          onClose={() => {
            setResult(null);
            setError(null);
          }}
        />
      )}
    </div>
  );
}
