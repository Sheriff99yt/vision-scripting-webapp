import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export const useUserSettings = ({
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
  mousePosition, // Add mousePosition to parameters
}) => {
  const copyNode = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    return selectedNodes; // Return the copied nodes
  }, [nodes]);

  const cutNode = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    if (selectedNodes.length) {
      manageHistory(
        nodes.filter((node) => !node.selected),
        edges
      );
      return selectedNodes; // Return the cut nodes which are copied
    }
  }, [nodes, edges, manageHistory]);

  const pasteNode = useCallback(
    (copiedNodes) => {
      if (!Array.isArray(copiedNodes) || copiedNodes.length === 0) return; // Ensure copiedNodes is an array and has items
      const newNodes = copiedNodes.map((node) => ({
        ...node,
        id: uuidv4(), // Generate new unique IDs
        position: {
          x: Math.max(0, mousePosition.x + 20), // Pasting position (adjusted with mouse position)
          y: Math.max(0, mousePosition.y + 20),
        },
        selected: true,
      }));
      manageHistory([...nodes, ...newNodes], edges);
    },
    [nodes, edges, manageHistory, mousePosition] // Include mousePosition in dependencies
  );

  const deleteSelected = useCallback(() => {
    manageHistory(
      nodes.filter((node) => !node.selected),
      edges.filter((edge) => !edge.selected)
    );
  }, [nodes, edges, manageHistory]);

  const selectAllNodes = useCallback(() => {
    const updatedNodes = nodes.map((node) => ({ ...node, selected: true }));
    manageHistory(updatedNodes, edges);
  }, [nodes, edges, manageHistory]);

  const deselectAllNodes = useCallback(() => {
    const updatedNodes = nodes.map((node) => ({ ...node, selected: false }));
    manageHistory(updatedNodes, edges);
  }, [nodes, edges, manageHistory]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setFutureHistory((prev) => [...prev, { nodes, edges }]);
    setNodes(lastState.nodes);
    setEdges(lastState.edges);
    setHistory(history.slice(0, -1));
  }, [history, setNodes, setEdges, setHistory, setFutureHistory]);

  const redo = useCallback(() => {
    if (futureHistory.length === 0) return;
    const nextState = futureHistory[futureHistory.length - 1];
    setHistory((prev) => [...prev, { nodes, edges }]);
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
    setFutureHistory(futureHistory.slice(0, -1));
  }, [futureHistory, setNodes, setEdges, setHistory, setFutureHistory]);

  const keyActions = {
    c: () => {
      const copiedNodes = copyNode(); // Trigger copyNode
      if (copiedNodes.length > 0) {
        setCopiedNodes(copiedNodes); // Store the copied nodes
      }
      return copiedNodes;
    },
    x: () => {
      const cutNodes = cutNode(); // Trigger cutNode
      if (cutNodes) {
        setCopiedNodes(cutNodes); // Store cut nodes as copied
      }
      return cutNodes;
    },
    v: (event) => {
      if (copiedNodes.length > 0) {
        pasteNode(copiedNodes); // Use stored copied nodes for pasting
        event.preventDefault();
      }
    },
    Delete: deleteSelected,
    a: selectAllNodes,
    d: deselectAllNodes,
    z: undo,
    y: redo,
  };

  const handleKeyDown = useCallback(
    (event) => {
      const action = keyActions[event.key];
      if (action && event.ctrlKey) {
        action(event); // Call the action if valid
        event.preventDefault(); // Prevent default if a valid action is taken
      }
    },
    [keyActions]
  );

  return {
    handleKeyDown,
    pasteNode,
    copyNode,
    cutNode,
    deleteSelected,
    selectAllNodes,
    deselectAllNodes,
    undo,
    redo,
  };
};
