import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "react-flow-renderer";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import { ProcessNode, ForLoopNode } from "./NodeTypes";
import { useUserSettings } from "./userSettings";
import Notification from './Notification';
import "./VisualScripting.css";

const nodeTypes = {
  process: ProcessNode,
  forLoop: ForLoopNode,
};

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

  const availableNodeTypes = [
    { type: "process", label: "Process" },
    { type: "forLoop", label: "For Loop" },
  ];

  const [filteredNodeTypes, setFilteredNodeTypes] = useState(availableNodeTypes);

  useEffect(() => {
    const filtered = availableNodeTypes.filter((node) =>
      node.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNodeTypes(filtered);
  }, [searchQuery]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    showNotification(`${isDarkMode ? 'Light' : 'Dark'} mode activated`);
  };

  const saveToFile = () => {
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

  const createNode = useCallback(
    (type, position) => {
      const newNode = {
        id: uuidv4(),
        type,
        data: { label: type === "process" ? "Process" : "For Loop" },
        position,
      };
      manageHistory([...nodes, newNode], edges);
      showNotification(`New ${type} node created`);
    },
    [nodes, edges, manageHistory]
  );

  const handleDrop = (event) => {
    event.preventDefault();

    const data = JSON.parse(
      event.dataTransfer.getData("application/reactflow")
    );
    if (data) {
      const { type } = data;
      createNode(type, { x: event.clientX, y: event.clientY });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

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
      <div className="main-canvas" onDrop={handleDrop} onDragOver={handleDragOver}>
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
          fitView
          nodeTypes={nodeTypes}
          nodesDraggable
          onMove={(event, viewport) => setViewport(viewport)}
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