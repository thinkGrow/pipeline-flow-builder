// ResultModal.js
// Shows the /pipelines/parse response (or a submission error) in a small
// on-brand popup instead of a stock browser alert().

import { useState } from 'react';
import './ResultModal.css';

const CLOSE_ANIMATION_MS = 150;

export const ResultModal = ({ result, error, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, CLOSE_ANIMATION_MS);
  };

  return (
    <div className={`modal-overlay ${isClosing ? 'modal-closing' : ''}`} onClick={handleClose}>
      <div
        className={`modal-panel ${isClosing ? 'modal-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {error ? (
          <>
            <div className="modal-title">Submission failed</div>
            <p className="modal-body">{error}</p>
          </>
        ) : (
          <>
            <div className="modal-title">Pipeline Summary</div>
            <div className="modal-stats">
              <div className="modal-stat">
                <span className="modal-stat-value">{result.num_nodes}</span>
                <span className="modal-stat-label">Nodes</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-value">{result.num_edges}</span>
                <span className="modal-stat-label">Edges</span>
              </div>
            </div>
            <div className={`modal-dag-badge ${result.is_dag ? 'valid' : 'invalid'}`}>
              {result.is_dag ? 'This pipeline has no cycles' : 'This pipeline contains a cycle'}
            </div>
          </>
        )}
        <button className="modal-close-button" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};
