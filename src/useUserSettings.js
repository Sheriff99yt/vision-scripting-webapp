import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { copy, paste } from "./clipboard";

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
  mousePosition,
  viewport,
  showNotification,
  saveToFile,
}) => {
  const copyNode = useCallback(async () => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => 
      selectedNodes.some(node => node.id === edge.source || node.id === edge.target)
    );
    const success = await copy(selectedNodes, selectedEdges);
    if (success) {
      setCopiedNodes(selectedNodes);
      showNotification('Nodes copied');
    } else {
      showNotification('Failed to copy nodes');
    }
    return selectedNodes;
  }, [nodes, edges, setCopiedNodes, showNotification]);

  const cutNode = useCallback(async () => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => 
      selectedNodes.some(node => node.id === edge.source || node.id === edge.target)
    );
    const success = await copy(selectedNodes, selectedEdges);
    if (success) {
      manageHistory(
        nodes.filter((node) => !node.selected),
        edges.filter((edge) => !selectedNodes.some(node => node.id === edge.source || node.id === edge.target))
      );
      showNotification('Nodes cut');
      return selectedNodes;
    } else {
      showNotification('Failed to cut nodes');
    }
  }, [nodes, edges, manageHistory, showNotification]);

  const pasteNode = useCallback(async () => {
    const clipboardData = await paste();
    if (!clipboardData) {
      showNotification('No valid data to paste');
      return;
    }

    const { nodes: pastedNodes, edges: pastedEdges } = clipboardData;

    // Find the top-left corner of the pasted nodes
    const minX = Math.min(...pastedNodes.map(node => node.position.x));
    const minY = Math.min(...pastedNodes.map(node => node.position.y));

    // Calculate the offset to move the top-left corner to the mouse position
    const offsetX = (mousePosition.x - viewport.x) / viewport.zoom - minX;
    const offsetY = (mousePosition.y - viewport.y) / viewport.zoom - minY;

    const newNodes = pastedNodes.map(node => ({
      ...node,
      id: uuidv4(),
      position: {
        x: node.position.x + offsetX,
        y: node.position.y + offsetY,
      },
      selected: true,
    }));

    const idMap = pastedNodes.reduce((map, node, index) => {
      map[node.id] = newNodes[index].id;
      return map;
    }, {});

    const newEdges = pastedEdges.map(edge => ({
      ...edge,
      id: uuidv4(),
      source: idMap[edge.source],
      target: idMap[edge.target],
    }));

    manageHistory([...nodes, ...newNodes], [...edges, ...newEdges]);
    showNotification('Nodes pasted');
  }, [nodes, edges, manageHistory, mousePosition, viewport, showNotification]);

  const deleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const updatedNodes = nodes.filter((node) => !node.selected);
    const updatedEdges = edges.filter(
      (edge) =>
        !selectedNodes.some(
          (node) => node.id === edge.source || node.id === edge.target
        )
    );
    manageHistory(updatedNodes, updatedEdges);
    showNotification('Selected nodes deleted');
  }, [nodes, edges, manageHistory, showNotification]);

  const selectAllNodes = useCallback(() => {
    const updatedNodes = nodes.map((node) => ({ ...node, selected: true }));
    setNodes(updatedNodes);
    showNotification('All nodes selected');
  }, [nodes, setNodes, showNotification]);

  const deselectAllNodes = useCallback(() => {
    const updatedNodes = nodes.map((node) => ({ ...node, selected: false }));
    setNodes(updatedNodes);
    showNotification('All nodes deselected');
  }, [nodes, setNodes, showNotification]);

  const undo = useCallback(() => {
    if (history.length > 1) {
      const currentState = history[history.length - 1];
      const previousState = history[history.length - 2];
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setHistory(history.slice(0, -1));
      setFutureHistory([currentState, ...futureHistory]);
      showNotification('Undo');
    } else {
      showNotification('Nothing to undo');
    }
  }, [history, futureHistory, setNodes, setEdges, setHistory, setFutureHistory, showNotification]);

  const redo = useCallback(() => {
    if (futureHistory.length > 0) {
      const [nextState, ...remainingFuture] = futureHistory;
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistory([...history, nextState]);
      setFutureHistory(remainingFuture);
      showNotification('Redo');
    } else {
      showNotification('Nothing to redo');
    }
  }, [history, futureHistory, setNodes, setEdges, setHistory, setFutureHistory, showNotification]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "c":
            event.preventDefault();
            copyNode();
            break;
          case "x":
            event.preventDefault();
            cutNode();
            break;
          case "v":
            event.preventDefault();
            pasteNode();
            break;
          case "a":
            event.preventDefault();
            selectAllNodes();
            break;
          case "d":
            event.preventDefault();
            deselectAllNodes();
            break;
          case "z":
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "y":
            event.preventDefault();
            redo();
            break;
          case "s":
            event.preventDefault();
            saveToFile();
            break;
          default:
            break;
        }
      } else if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelected();
      } else if (event.key === "Escape") {
        event.preventDefault(); // Prevent default browser behavior
        deselectAllNodes();
      }
    },
    [
      copyNode,
      cutNode,
      pasteNode,
      deleteSelected,
      selectAllNodes,
      deselectAllNodes,
      undo,
      redo,
      saveToFile,
    ]
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