import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  addEdge,
} from "react-flow-renderer";
import "./VisualScripting.css";
import { v4 as uuidv4 } from "uuid";
import { ProcessNode, ForLoopNode } from "./NodeTypes";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import { useUserSettings } from "./userSettings";

const initialNodes = [
  {
    id: uuidv4(),
    type: "process",
    data: { label: "Process" },
    position: { x: 250, y: 100 },
  },
];

const nodeTypes = {
  process: ProcessNode,
  forLoop: ForLoopNode,
};

const VisualScripting = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [history, setHistory] = useState([]);
  const [futureHistory, setFutureHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const [copiedNodes, setCopiedNodes] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const manageHistory = (newNodes, newEdges) => {
    const currentState = { nodes, edges };
    setHistory((prev) => [...prev, currentState]);
    setFutureHistory([]);
    setNodes(newNodes);
    setEdges(newEdges);
  };

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
  });

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const saveToFile = async () => {
    const flowData = { nodes, edges };
    const blob = new Blob([JSON.stringify(flowData)], {
      type: "application/json",
    });

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "visualScriptingFlow.json",
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      const writableStream = await handle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
      alert("Flow saved to file!");
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save file.");
    }
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
            alert("Flow loaded from file!");
          } else {
            alert("Invalid data format in the file.");
          }
        } catch (error) {
          console.error("Failed to load data:", error);
          alert("Failed to load data: Invalid JSON format.");
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
  };

  const filteredNodeTypes = [
    { type: "process", label: "Process" },
    { type: "forLoop", label: "For Loop" },
  ].filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`app-container ${isDarkMode ? "dark" : "light"}`}>
      <Sidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredNodeTypes={filteredNodeTypes}
        createNode={createNode}
      />
      <main
        className="main-canvas"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Toolbar
          toggleDarkMode={toggleDarkMode}
          saveToFile={saveToFile}
          loadFromFile={loadFromFile}
          copyNode={() => {
            const nodesCopied = copyNode();
            setCopiedNodes(nodesCopied);
          }}
          cutNode={() => {
            const nodesCut = cutNode();
            if (nodesCut) {
              setCopiedNodes(nodesCut);
            }
          }}
          pasteNode={() => pasteNode(copiedNodes)}
          deleteSelected={deleteSelected}
          selectAllNodes={selectAllNodes}
          deselectAllNodes={deselectAllNodes}
          undo={undo}
          redo={redo}
          fileInputRef={fileInputRef}
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
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </main>
    </div>
  );
};

export default VisualScripting;
