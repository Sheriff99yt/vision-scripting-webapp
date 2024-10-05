import React from 'react';
import { Handle } from 'react-flow-renderer';

// Custom node component for process type
export const ProcessNode = ({ data, style }) => (
    <div className={`custom-node process-node ${data.selected ? 'selected' : ''}`} style={style}>
        <Handle type="target" position="right" />
        <div>{data.label || 'Process'}</div> {/* Show type name; default is 'Process' */}
        <Handle type="source" position="left" />
    </div>
);

// Custom node component for For Loop
export const ForLoopNode = ({ data, style }) => (
    <div className={`custom-node for-loop-node ${data.selected ? 'selected' : ''}`} style={style}>
        <Handle type="target" position="right" />
        <div>{data.label || 'For Loop'}</div> {/* Show type name; default is 'For Loop' */}
        <Handle type="source" position="left" style={{ top: '10%' }} />
        <Handle type="source" position="left" style={{ top: '50%' }} />
        <Handle type="source" position="left" style={{ top: '90%' }} />
    </div>
);

// You can add more node components here in the future
