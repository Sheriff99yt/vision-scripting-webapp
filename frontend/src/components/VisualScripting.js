import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, MiniMap, Controls, addEdge } from 'react-flow-renderer';
import './VisualScripting.css';
import { v4 as uuidv4 } from 'uuid';
import { ProcessNode, ForLoopNode } from './NodeTypes';

// Define initial nodes for the flow chart
const initialNodes = [
    {
        id: uuidv4(),
        type: 'process',
        data: { label: 'Process' },
        position: { x: 250, y: 100 },
    },
];

const nodeTypes = {
    process: ProcessNode,
    forLoop: ForLoopNode,
};

// Main component for visual scripting interface
const VisualScripting = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [history, setHistory] = useState([]);
    const [futureHistory, setFutureHistory] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);
    const [copiedNodes, setCopiedNodes] = useState([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

    // Track mouse movement to update mouse position state
    const handleMouseMove = (event) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    // Manage history of nodes and edges for undo/redo functionality
    const manageHistory = (newNodes, newEdges) => {
        const currentState = { nodes, edges };
        setHistory((prev) => [...prev, currentState]);
        setFutureHistory([]);
        setNodes(newNodes);
        setEdges(newEdges);
    };

    // Copy selected nodes to clipboard
    const copyNode = useCallback(() => {
        const selectedNodes = nodes.filter((node) => node.selected);
        setCopiedNodes(selectedNodes);
    }, [nodes]);

    // Cut selected nodes, copying them to clipboard and removing from current nodes
    const cutNode = useCallback(() => {
        const selectedNodes = nodes.filter((node) => node.selected);
        if (selectedNodes.length) {
            setCopiedNodes(selectedNodes);
            manageHistory(nodes.filter((node) => !node.selected), edges);
        }
    }, [nodes, edges]);

    // Handle dropping new nodes onto the canvas
    const handleDrop = useCallback((event) => {
        event.preventDefault();
        const type = event.dataTransfer.getData('application/reactflow');
        if (type) {
            const position = calculatePosition(event);
            const newNode = createNode(type, position);
            manageHistory([...nodes, newNode], edges);
        }
    }, [nodes, edges]);

    // Prevent default drag over behavior
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // Paste copied nodes at calculated position on canvas
    const pasteNode = useCallback(() => {
        if (!copiedNodes.length) return;
        deselectAllNodes();

        const position = calculatePastePosition();
        const newNodes = copiedNodes.map((node) => createNodeWithNewPosition(node, position));
        manageHistory([...nodes, ...newNodes], edges);
    }, [copiedNodes, nodes, edges]);

    // Create a node with a new position based on an existing node
    const createNodeWithNewPosition = (node, position) => ({
        ...node,
        id: uuidv4(),
        position: {
            x: Math.max(0, position.x),
            y: Math.max(0, position.y),
        },
        selected: true,
    });

    // Create a new node of specified type at given position
    const createNode = (type, position) => ({
        id: uuidv4(),
        type,
        data: { label: type === 'process' ? 'Process' : 'For Loop' },
        position,
    });

    // Calculate position for new node based on mouse event
    const calculatePosition = (event) => {
        const canvas = document.querySelector('.react-flow');
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / viewport.zoom + viewport.x,
            y: (event.clientY - rect.top) / viewport.zoom + viewport.y,
        };
    };

    // Calculate position for pasting nodes based on mouse position
    const calculatePastePosition = () => {
        const canvas = document.querySelector('.react-flow');
        const rect = canvas.getBoundingClientRect();
        return {
            x: (mousePosition.x - rect.left) / viewport.zoom + viewport.x + 20,
            y: (mousePosition.y - rect.top) / viewport.zoom + viewport.y + 20,
        };
    };

    // Delete selected nodes and edges
    const deleteSelected = useCallback(() => {
        manageHistory(nodes.filter((node) => !node.selected), edges.filter((edge) => !edge.selected));
    }, [nodes, edges]);

    // Undo the last action by restoring from history
    const undo = useCallback(() => {
        setHistory((history) => {
            if (history.length) {
                const lastState = history[history.length - 1];
                setFutureHistory((prev) => [...prev, { nodes, edges }]);
                setNodes(lastState.nodes);
                setEdges(lastState.edges);
                return history.slice(0, -1);
            }
            return history;
        });
    }, [nodes, edges]);

    // Redo the last undone action
    const redo = useCallback(() => {
        setFutureHistory((future) => {
            if (future.length) {
                const nextState = future[future.length - 1];
                setHistory((prev) => [...prev, { nodes, edges }]);
                setNodes(nextState.nodes);
                setEdges(nextState.edges);
                return future.slice(0, -1);
            }
            return future;
        });
    }, [nodes, edges]);

    // Select all nodes in the current view
    const selectAllNodes = useCallback(() => {
        const updatedNodes = nodes.map((node) => ({ ...node, selected: true }));
        manageHistory(updatedNodes, edges);
    }, [nodes, edges]);

    // Deselect all nodes in the current view
    const deselectAllNodes = useCallback(() => {
        const updatedNodes = nodes.map((node) => ({ ...node, selected: false }));
        manageHistory(updatedNodes, edges);
    }, [nodes, edges]);

    // Handle keyboard shortcuts for various actions
    const handleKeyDown = useCallback((event) => {
        switch (event.key) {
            case 'c':
                if (event.ctrlKey) {
                    copyNode();
                    event.preventDefault();
                }
                break;
            case 'x':
                if (event.ctrlKey) {
                    cutNode();
                    event.preventDefault();
                }
                break;
            case 'v':
                if (event.ctrlKey) {
                    pasteNode();
                    event.preventDefault();
                }
                break;
            case 'Delete':
                deleteSelected();
                event.preventDefault();
                break;
            case 'a':
                if (event.ctrlKey) {
                    selectAllNodes();
                    event.preventDefault();
                }
                break;
            case 'd':
                if (event.ctrlKey) {
                    deselectAllNodes();
                    event.preventDefault();
                }
                break;
            case 'z':
                if (event.ctrlKey) {
                    undo();
                    event.preventDefault();
                }
                break;
            case 'y':
                if (event.ctrlKey) {
                    redo();
                    event.preventDefault();
                }
                break;
            default:
                break;
        }
    }, [copyNode, cutNode, deleteSelected, pasteNode, selectAllNodes, deselectAllNodes, undo, redo]);

    // Set up event listeners for mouse movement
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Set up event listeners for keydown events
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Handle the connection of nodes
    const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

    // Toggle between dark and light mode
    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    // Save the current flow to a file
    const saveToFile = async () => {
        const flowData = { nodes, edges };
        const blob = new Blob([JSON.stringify(flowData)], { type: 'application/json' });

        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'visualScriptingFlow.json',
                types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
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

    // Load flow data from a selected file
    const loadFromFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const loadedData = JSON.parse(e.target.result);
                    if (Array.isArray(loadedData.nodes) && Array.isArray(loadedData.edges)) {
                        manageHistory(loadedData.nodes, loadedData.edges);
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

    // Trigger file input dialog for loading a file
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Filter node types based on search query
    const filteredNodeTypes = [
        { type: 'process', label: 'Process' },
        { type: 'forLoop', label: 'For Loop' },
    ].filter((node) => node.label.toLowerCase().includes(searchQuery.toLowerCase()));

    // Render the main application component
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
                {filteredNodeTypes.length ? (
                    // Render buttons for each filtered node type
                    filteredNodeTypes.map((node) => (
                        <button
                            key={node.type}
                            draggable
                            onDragStart={(event) => {
                                event.dataTransfer.setData('application/reactflow', node.type);
                            }}
                        >
                            {node.label}
                        </button>
                    ))
                ) : (
                    <p>No nodes found.</p>
                )}
            </aside>
            <main className="main-canvas" onDrop={handleDrop} onDragOver={handleDragOver}>
                <div className="toolbar">
                    // Render toolbar buttons for various functionalities
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
                    <button onClick={undo} style={{ margin: '8px' }}>Undo</button>
                    <button onClick={redo} style={{ margin: '8px' }}>Redo</button>
                </div>

                // Render the ReactFlow component with nodes and edges
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onLoad={(instance) => {
                        const { x, y, zoom } = instance.getViewport();
                        setViewport({ x, y, zoom });
                    }}
                    fitView
                    nodeTypes={nodeTypes}
                    nodesDraggable
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