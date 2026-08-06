// toolbar.js

import { DraggableNode } from './draggableNode';
import { nodeConfigs } from './nodes/nodeConfigs';
import './toolbar.css';

export const PipelineToolbar = () => {

    return (
        <div className="toolbar">
            <div className="toolbar-inner">
                {nodeConfigs.map((config) => (
                    <DraggableNode key={config.type} type={config.type} label={config.label} />
                ))}
            </div>
        </div>
    );
};
