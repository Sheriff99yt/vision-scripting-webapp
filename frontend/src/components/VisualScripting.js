import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, MiniMap, Controls, addEdge } from 'react-flow-renderer';
import './VisualScripting.css'; // Create a CSS file for custom styles
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation
import { ProcessNode, ForLoopNode } from './NodeTypes'; // Import ProcessNode and ForLoopNode from NodeTypes.js

// Define node types outside the component to avoid redefinition
const nodeTypes = {
    process: ProcessNode,
    forLoop: ForLoopNode, // Add the ForLoopNode type
};

// Define initial nodes for the flow chart (only process)
const initialNodes = [
    {
        id: uuidv4(),
        type: 'process',
        data: { label: 'Process' },
        position: { x: 250, y: 100 },
    },
];

// Main component for visual scripting application
const VisualScripting = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);
    const [copiedNodes, setCopiedNodes] = useState([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // For capturing mouse position

    // Function to handle mouse movement
    const handleMouseMove = (event) => {
        setMousePosition({ x: event.clientX, y: event.clientY }); // Update mouse position
    };

    // Function to copy selected nodes
    const copyNode = useCallback(() => {
        const selectedNodes = nodes.filter(node => node.selected);
        setCopiedNodes(selectedNodes);
    }, [nodes]);

    // Function to cut selected nodes
    const cutNode = useCallback(() => {
        const selectedNodes = nodes.filter(node => node.selected);
        if (selectedNodes.length > 0) {
            setCopiedNodes(selectedNodes);
            setNodes((nds) => nds.filter((node) => !node.selected));
        }
    }, [nodes, setNodes]);

    // Function to paste copied nodes relative to the mouse cursor
    const pasteNode = useCallback(() => {
        if (copiedNodes.length > 0) {
            // First deselect all nodes
            const updatedNodes = nodes.map((node) => ({ ...node, selected: false }));
            setNodes(updatedNodes);

            // Create new nodes from copied nodes
            const newNodes = copiedNodes.map((node) => ({
                ...node,
                id: uuidv4(),
                position: {
                    x: mousePosition.x, // Directly place under mouse cursor
                    y: mousePosition.y, // Directly place under mouse cursor
                },
                selected: true, // Select newly pasted nodes
            }));

            // Update nodes state with new pasted nodes
            setNodes((nds) => nds.concat(newNodes));
        }
    }, [copiedNodes, mousePosition, nodes, setNodes]);

    // Function to delete selected nodes and edges
    const deleteSelected = useCallback(() => {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
    }, [setNodes, setEdges]);

    // Function to select all nodes
    const selectAllNodes = useCallback(() => {
        const updatedNodes = nodes.map((node) => ({ ...node, selected: true }));
        setNodes(updatedNodes);
    }, [nodes, setNodes]);

    // Function to deselect all nodes
    const deselectAllNodes = useCallback(() => {
        const updatedNodes = nodes.map((node) => ({ ...node, selected: false }));
        setNodes(updatedNodes);
    }, [nodes, setNodes]);

    // Function to handle keyboard shortcuts
    const handleKeyDown = useCallback((event) => {
        switch (event.key) {
            case 'c':
                if (event.ctrlKey) {
                    copyNode(); // Copy action
                    event.preventDefault(); // Prevent default action
                }
                break;
            case 'x':
                if (event.ctrlKey) {
                    cutNode(); // Cut action
                    event.preventDefault(); // Prevent default action
                }
                break;
            case 'v':
                if (event.ctrlKey) {
                    pasteNode(); // Paste action under current mouse cursor position
                    event.preventDefault(); // Prevent default action
                }
                break;
            case 'Delete':
                deleteSelected(); // Delete action
                event.preventDefault(); // Prevent default action
                break;
            case 'a':
                if (event.ctrlKey) {
                    selectAllNodes(); // Select all action
                    event.preventDefault(); // Prevent default action
                }
                break;
            case 'd':
                if (event.ctrlKey) {
                    deselectAllNodes(); // Deselect all action
                    event.preventDefault(); // Prevent default action
                }
                break;
            default:
                break;
        }
    }, [copyNode, cutNode, deleteSelected, pasteNode, selectAllNodes, deselectAllNodes]); // Adding dependencies

    // Register mouse move event effect
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Empty dependency array to run once

    // Register keyboard shortcut effect
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]); // Depend on handleKeyDown

// Function to add a new node of specified type without additional labels
const addNode = (nodeType) => {
    const newNode = {
        id: uuidv4(),
        data: { label: nodeType === 'process' ? 'Process' : 'For Loop' }, // Only name based on type
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        type: nodeType,
    };

    setNodes((nds) => nds.concat(newNode));
};

    // Function to handle connecting nodes
    const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

    // Function to toggle between dark and light mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Function to save the current flow to a file
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

    // Function to load flow data from a file
    const loadFromFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const loadedData = JSON.parse(e.target.result);
                    if (Array.isArray(loadedData.nodes) && Array.isArray(loadedData.edges)) {
                        setNodes(loadedData.nodes);
                        setEdges(loadedData.edges);
                        alert('Flow loaded from file!');
                    } else {
                        alert('Invalid data format in the file.');
                    }
                } catch (error) {
                    console.error('Failed to load data:', error);
                    alert('Failed to load data: Invalid JSON format.');
                }
            };

            reader.readAsText(file);
        } else {
            console.warn('No file selected.');
        }
    };

    // Function to trigger file input for loading from file
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Array of available node types for selection (includes the new For Loop node)
    const nodeTypeArray = [
        { type: 'process', label: 'Process' },
        { type: 'forLoop', label: 'For Loop' }, // Add For Loop to node type selection
    ];

    // Filter node types based on search query
    const filteredNodeTypes = nodeTypeArray.filter((node) =>
        node.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Render the main component
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
                {filteredNodeTypes.length === 0 ? (
                    <p>No nodes found.</p>
                ) : (
                    filteredNodeTypes.map((node) => (
                        <button key={node.type} onClick={() => addNode(node.type)}>
                            {node.label}
                        </button>
                    ))
                )}
            </aside>
            <main className="main-canvas">
                <div className="toolbar">
                    <button onClick={toggleDarkMode} style={{ margin: '8px' }}>
                        Toggle to {isDarkMode ? 'Light' : 'Dark'} Mode
                    </button>
                    <button onClick={saveToFile} style={{ margin: '8px' }}>Save to File</button>
                    <input
                        type="file"
                        accept=".json"
                        onChange={loadFromFile}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                    <button onClick={triggerFileInput} style={{ margin: '8px' }}>Load from File</button>
                    <button onClick={copyNode} style={{ margin: '8px' }}>Copy</button>
                    <button onClick={cutNode} style={{ margin: '8px' }}>Cut</button>
                    <button onClick={pasteNode} style={{ margin: '8px' }}>Paste</button>
                    <button onClick={deleteSelected} style={{ margin: '8px' }}>Delete</button>
                    <button onClick={selectAllNodes} style={{ margin: '8px' }}>Select All</button>
                    <button onClick={deselectAllNodes} style={{ margin: '8px' }}>Deselect All</button>
                </div>

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

// Export the VisualScripting component as the default export
export default VisualScripting;
