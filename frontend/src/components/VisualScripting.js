import React, { useState, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState, MiniMap, Controls, Handle, addEdge } from 'react-flow-renderer';
import './VisualScripting.css'; // Create a CSS file for custom styles

// Custom Node Components
const InputNode = ({ data }) => (
    <div className="custom-node input-node">
        <Handle type="target" position="right" />
        <div>{data.label}</div>
        <Handle type="source" position="left" />
    </div>
);

const ProcessNode = ({ data }) => (
    <div className="custom-node process-node">
        <Handle type="target" position="right" />
        <div>{data.label}</div>
        <Handle type="source" position="left" />
    </div>
);

const OutputNode = ({ data }) => (
    <div className="custom-node output-node">
        <Handle type="target" position="right" />
        <div>{data.label}</div>
        <Handle type="source" position="left" />
    </div>
);

// Define node types outside the component to avoid redefinition
const nodeTypes = {
    input: InputNode,
    process: ProcessNode,
    output: OutputNode,
};

// Define initial nodes
const initialNodes = [
    {
        id: '1',
        type: 'input', // Specify type to use defined custom node
        data: { label: 'Input Node' },
        position: { x: 100, y: 100 },
    },
    {
        id: '2',
        type: 'process', // Specify type to use defined custom node
        data: { label: 'Process Node' },
        position: { x: 250, y: 100 },
    },
    {
        id: '3',
        type: 'output', // Specify type to use defined custom node
        data: { label: 'Output Node' },
        position: { x: 400, y: 100 },
    },
];

const VisualScripting = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);

    const addNode = (nodeType) => {
        const newNode = {
            id: `${nodes.length + 1}`,
            data: { label: `Node ${nodes.length + 1}` },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            type: nodeType,
        };

        setNodes((nds) => nds.concat(newNode));
    };

    const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const saveToFile = async () => {
        const flowData = {
            nodes,
            edges,
        };
        const blob = new Blob([JSON.stringify(flowData)], { type: 'application/json' });

        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'visualScriptingFlow.json',
                types: [
                    {
                        description: 'JSON Files',
                        accept: {
                            'application/json': ['.json'],
                        },
                    },
                ],
            });
            const writableStream = await handle.createWritable();
            await writableStream.write(blob);
            await writableStream.close();
            alert('Flow saved to file!');
        } catch (error) {
            console.error('Error saving file:', error);
            alert('Failed to save file.');
        }
    };

    const loadFromFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const loadedData = JSON.parse(e.target.result);
                    setNodes(loadedData.nodes);
                    setEdges(loadedData.edges);
                    alert('Flow loaded from file!');
                } catch (error) {
                    console.error('Failed to load data:', error);
                    alert('Failed to load data: Invalid JSON format.');
                }
            };

            const originalWarn = console.warn; // Store the original console.warn
            console.warn = () => {}; // Override console.warn to suppress warnings

            reader.readAsText(file);

            // Restore console.warn after reading
            reader.onloadend = () => {
                console.warn = originalWarn; // Restore the original console.warn
            };
        } else {
            console.warn('No file selected.');
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const nodeTypeArray = [
        { type: 'input', label: 'Input Node' },
        { type: 'process', label: 'Process Node' },
        { type: 'output', label: 'Output Node' },
    ];

    const filteredNodeTypes = nodeTypeArray.filter((node) =>
        node.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
            <aside className="sidebar">
                <h2>Toolbox</h2>
                <input
                    type="text"
                    placeholder="Search nodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: '10px', width: '100%' }}
                />
                {filteredNodeTypes.map((node) => (
                    <button key={node.type} onClick={() => addNode(node.type)}>
                        {node.label}
                    </button>
                ))}
                <button onClick={toggleDarkMode}>
                    Toggle to {isDarkMode ? 'Light' : 'Dark'} Mode
                </button>
                <button onClick={saveToFile}>Save to File</button>
                <input
                    type="file"
                    accept=".json"
                    onChange={loadFromFile}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                <button onClick={triggerFileInput}>Load from File</button>
            </aside>
            <main className="main-canvas">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    nodeTypes={nodeTypes}
                    nodesDraggable={true}
                >
                    <MiniMap />
                    <Controls />
                </ReactFlow>
            </main>
        </div>
    );
};

export default VisualScripting;
