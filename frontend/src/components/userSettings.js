import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { copy, paste } from "../utils/clipboard";

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
}) => {
  const copyNode = useCallback(async () => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => 
      selectedNodes.some(node => node.id === edge.source || node.id === edge.target)
    );
    const success = await copy(selectedNodes, selectedEdges);
    if (success) {
      setCopiedNodes(selectedNodes);
    }
    return selectedNodes;
  }, [nodes, edges, setCopiedNodes]);

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
      return selectedNodes;
    }
  }, [nodes, edges, manageHistory]);

  const pasteNode = useCallback(async () => {
    const clipboardData = await paste();
    if (!clipboardData) return;

    const { nodes: pastedNodes, edges: pastedEdges, boundingBox } = clipboardData;

    const offsetX = (mousePosition.x - viewport.x) / viewport.zoom - boundingBox.minX;
    const offsetY = (mousePosition.y - viewport.y) / viewport.zoom - boundingBox.minY;

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
  }, [nodes, edges, manageHistory, mousePosition, viewport]);

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
  }, [nodes, edges, manageHistory]);

  const selectAllNodes = useCallback(() => {
    const updatedNodes = nodes.map((node) => ({ ...node, selected: true }));
    setNodes(updatedNodes);
  }, [nodes, setNodes]);

  const deselectAllNodes = useCallback(() => {
    const updatedNodes = nodes.map((node) => ({ ...node, selected: false }));
    setNodes(updatedNodes);
  }, [nodes, setNodes]);

  const undo = useCallback(() => {
    if (history.length > 1) {
      const currentState = history[history.length - 1];
      const previousState = history[history.length - 2];
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setHistory(history.slice(0, -1));
      setFutureHistory([currentState, ...futureHistory]);
    }
  }, [history, futureHistory, setNodes, setEdges, setHistory, setFutureHistory]);

  const redo = useCallback(() => {
    if (futureHistory.length > 0) {
      const [nextState, ...remainingFuture] = futureHistory;
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistory([...history, nextState]);
      setFutureHistory(remainingFuture);
    }
  }, [history, futureHistory, setNodes, setEdges, setHistory, setFutureHistory]);

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
          default:
            break;
        }
      } else if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelected();
      } else if (event.key === "Escape") {
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