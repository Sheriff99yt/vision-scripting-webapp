import React from 'react';
import { Handle } from 'react-flow-renderer';

// Custom node component for process type
export const ProcessNode = ({ data }) => (
    <div className={`custom-node process-node ${data.selected ? 'selected' : ''}`}>
        <Handle type="target" position="right" />
        <div>{data.label}</div> {/* This will show "Process" */}
        <Handle type="source" position="left" />
    </div>
);

// Custom node component for For Loop
export const ForLoopNode = ({ data }) => (
    <div className={`custom-node for-loop-node ${data.selected ? 'selected' : ''}`}>
        <Handle type="target" position="left" style={{ top: '10%' }} />
        <Handle type="target" position="left" style={{ top: '50%' }} />
        <Handle type="target" position="left" style={{ top: '90%' }} />
        <div>{data.label}</div> {/* This will show "For Loop" */}
        <Handle type="source" position="right" />
    </div>
);
