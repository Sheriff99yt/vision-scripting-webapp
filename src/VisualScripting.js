import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "react-flow-renderer";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import { ProcessNode, ForLoopNode } from "./NodeTypes";
import { useUserSettings } from "./useUserSettings";
import "./styles.css";
import { useNodeCreation } from './hooks/useNodeCreation';
import Notification from './Notification';

const VisualScripting = () => {
  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const updateFlow = useCallback((newNodes, newEdges) => {
    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  const createNode = useNodeCreation(updateFlow, nodes, edges);

  const onNodesChange = useCallback((changes) => {
    const newNodes = applyNodeChanges(changes, nodes);
    const isNodeMovement = changes.some(change => change.type === 'position');
    updateFlow(newNodes, edges, !isNodeMovement, !isNodeMovement);
  }, [nodes, edges, updateFlow]);

  const onEdgesChange = useCallback(
    (changes) => {
      const newEdges = applyEdgeChanges(changes, edges);
      updateFlow(nodes, newEdges, true, true);
    },
    [nodes, edges, updateFlow]
  );

  const onNodeDragStop = useCallback(() => {
    updateFlow(nodes, edges, true); // Record history after drag stops
  }, [nodes, edges, updateFlow]);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copiedNodes, setCopiedNodes] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const mainCanvasRef = useRef(null);

  const availableNodeTypes = useMemo(() => [
    { type: "process", label: "Process" },
    { type: "forLoop", label: "For Loop" },
  ], []);

  const [filteredNodeTypes, setFilteredNodeTypes] = useState(availableNodeTypes);

  useEffect(() => {
    const filtered = availableNodeTypes.filter((node) =>
      node.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNodeTypes(filtered);
  }, [searchQuery, availableNodeTypes]);

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(params, edges);
      updateFlow(nodes, newEdges);
    },
    [nodes, edges, updateFlow]
  );

  const saveToFile = useCallback(() => {
    const data = JSON.stringify({ nodes, edges });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flow.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Flow saved to file');
  }, [nodes, edges, showNotification]);

  const {
    handleKeyDown,
    pasteNode,
    copyNode,
    cutNode,
    deleteSelected,
    selectAllNodes,
    deselectAllNodes,
    selectNode,
  } = useUserSettings({
    nodes,
    edges,
    updateFlow,
    copiedNodes,
    setCopiedNodes,
    mousePosition,
    viewport,
    showNotification,
    saveToFile,
    createNode,
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    showNotification(`${isDarkMode ? 'Light' : 'Dark'} mode activated`);
  };

  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target.result);
          if (
            Array.isArray(loadedData.nodes) &&
            Array.isArray(loadedData.edges)
          ) {
            updateFlow(loadedData.nodes, loadedData.edges);
            showNotification("Flow loaded from file!");
          } else {
            showNotification("Invalid data format in the file.");
          }
        } catch (error) {
          console.error("Failed to load data:", error);
          showNotification("Failed to load data: Invalid JSON format.");
        }
      };

      reader.readAsText(file);
    } else {
      console.warn("No file selected.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    
    if (!mainCanvasRef.current || !reactFlowInstance) {
      console.error('Main canvas ref or React Flow instance is not available');
      return;
    }

    const reactFlowBounds = mainCanvasRef.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');

    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    
    createNode(type, position, true);  // Pass true to clear future array when user creates a node
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const nodeTypes = useMemo(() => ({
    process: ProcessNode,
    forLoop: ForLoopNode,
  }), []);

  const handleSelectionChange = useCallback((params) => {
    const selectedNodes = params.nodes;
    if (selectedNodes.length === 1) {
      selectNode(selectedNodes[0].id);
    } else if (selectedNodes.length > 1) {
      const updatedNodes = nodes.map((node) => ({
        ...node,
        selected: selectedNodes.some((n) => n.id === node.id),
      }));
      updateFlow(updatedNodes, edges, false);
    } else {
      deselectAllNodes();
    }
  }, [nodes, edges, updateFlow, selectNode, deselectAllNodes]);

  return (
    <div
      className={`app-container ${isDarkMode ? "dark" : "light"}`}
      onKeyDown={handleKeyDown}
      tabIndex="0"
      onMouseMove={handleMouseMove}
    >
      <Sidebar
        createNode={createNode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredNodeTypes={filteredNodeTypes}
      />
      <div 
        className="main-canvas" 
        ref={mainCanvasRef}
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
      >
        <Toolbar
          toggleDarkMode={toggleDarkMode}
          saveToFile={saveToFile}
          loadFromFile={loadFromFile}
          fileInputRef={fileInputRef}
          copyNode={copyNode}
          cutNode={cutNode}
          pasteNode={pasteNode}
          deleteSelected={deleteSelected}
          selectAllNodes={selectAllNodes}
          deselectAllNodes={deselectAllNodes}
          showNotification={showNotification}
        />
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            position: {
              x: isNaN(node.position.x) ? 0 : node.position.x,
              y: isNaN(node.position.y) ? 0 : node.position.y,
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          fitView
          nodeTypes={nodeTypes}
          nodesDraggable={true}
          onMove={setViewport}
          snapToGrid={true}
          snapGrid={[15, 15]}
          defaultZoom={1}
          minZoom={0.1}
          maxZoom={4}
          onSelectionChange={handleSelectionChange}
          onNodeDragStop={onNodeDragStop}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {notification && <Notification message={notification} />}
    </div>
  );
};

export default VisualScripting;