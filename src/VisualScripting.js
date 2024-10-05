import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "react-flow-renderer";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import { ProcessNode, ForLoopNode } from "./NodeTypes";
import { useUserSettings } from "./useUserSettings";
import Notification from './Notification';
import "./styles.css";
import { useNodeCreation } from './hooks/useNodeCreation';

const VisualScripting = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [history, setHistory] = useState([{ nodes: [], edges: [] }]);
  const [futureHistory, setFutureHistory] = useState([]);
  const [copiedNodes, setCopiedNodes] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);
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

  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
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

  const manageHistory = useCallback(
    (newNodes, newEdges) => {
      setNodes(newNodes);
      setEdges(newEdges);
      setHistory([...history, { nodes: newNodes, edges: newEdges }]);
      setFutureHistory([]);
    },
    [history, setNodes, setEdges]
  );

  const {
    handleKeyDown,
    pasteNode,
    copyNode,
    cutNode,
    deleteSelected,
    selectAllNodes,
    deselectAllNodes,
    undo,
    redo,
  } = useUserSettings({
    nodes,
    edges,
    setNodes,
    setEdges,
    manageHistory,
    history,
    setHistory,
    futureHistory,
    setFutureHistory,
    copiedNodes,
    setCopiedNodes,
    mousePosition,
    viewport,
    showNotification,
    saveToFile,
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
            manageHistory(loadedData.nodes, loadedData.edges);
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

  const createNode = useNodeCreation(setNodes, manageHistory, () => edges);

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

    // Check if the dropped element is valid
    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    
    createNode(type, position);
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const nodeTypes = useMemo(() => ({
    process: ProcessNode,
    forLoop: ForLoopNode,
  }), []);

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
          undo={undo}
          redo={redo}
          showNotification={showNotification}
        />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          fitView
          nodeTypes={nodeTypes}
          nodesDraggable
          onMove={(event, viewport) => setViewport(viewport)}
          snapToGrid={true}
          snapGrid={[15, 15]}
          defaultZoom={1}
          minZoom={0.1}
          maxZoom={4}
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