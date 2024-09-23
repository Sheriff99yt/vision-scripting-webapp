import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { addEdge, useNodesState, useEdgesState, MiniMap, Controls } from 'react-flow-renderer';
import axios from 'axios';

const initialNodes = [
    {
        id: '1',
        data: { label: 'Node 1' },
        position: { x: 250, y: 5 },
    },
];

const VisualScripting = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const addNode = async () => {
        const newNode = {
            id: `${nodes.length + 1}`,
            data: { label: `Node ${nodes.length + 1}` },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
        };

        try {
            const response = await axios.post('http://localhost:8000/nodes/', newNode);
            setNodes((nds) => nds.concat(response.data));
        } catch (error) {
            console.error('Error adding node:', error);
        }
    };

    return (
        <div style={{ height: '100vh' }}>
            <button onClick={addNode}>Add Node</button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            >
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default VisualScripting;
