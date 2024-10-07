import { useCallback } from "react";
import { copy, cut, paste } from "./clipboard";

export const useUserSettings = ({
  nodes,
  edges,
  updateFlow,
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
      showNotification('Nodes copied');
    } else {
      showNotification('Failed to copy nodes');
    }
  }, [nodes, edges, showNotification]);

  const cutNode = useCallback(async () => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const success = await cut(selectedNodes, edges, updateFlow);
    if (success) {
      showNotification('Nodes cut');
    } else {
      showNotification('Failed to cut nodes');
    }
  }, [nodes, edges, updateFlow, showNotification]);

  const pasteNode = useCallback(async () => {
    const success = await paste(mousePosition, viewport, updateFlow);
    if (success) {
      showNotification('Nodes pasted');
    } else {
      showNotification('Failed to paste nodes');
    }
  }, [mousePosition, viewport, updateFlow, showNotification]);

  const deleteSelected = useCallback(() => {
    const updatedNodes = nodes.filter((node) => !node.selected);
    const updatedEdges = edges.filter(
      (edge) =>
        !nodes.some(
          (node) => node.selected && (node.id === edge.source || node.id === edge.target)
        )
    );
    updateFlow(updatedNodes, updatedEdges);
    showNotification('Selected nodes deleted');
  }, [nodes, edges, updateFlow, showNotification]);

  const selectAllNodes = useCallback(() => {
    const updatedNodes = nodes.map((node) => ({ ...node, selected: true }));
    updateFlow(updatedNodes, edges);
    showNotification('All nodes selected');
  }, [nodes, edges, updateFlow, showNotification]);

  const deselectAllNodes = useCallback(() => {
    const updatedNodes = nodes.map((node) => ({ ...node, selected: false }));
    updateFlow(updatedNodes, edges, false, false);
    showNotification('All nodes deselected');
  }, [nodes, edges, updateFlow, showNotification]);

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
        event.preventDefault();
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
      saveToFile,
    ]
  );

  const selectNode = useCallback((nodeId) => {
    const updatedNodes = nodes.map((node) => ({
      ...node,
      selected: node.id === nodeId,
    }));
    updateFlow(updatedNodes, edges, false);
  }, [nodes, edges, updateFlow]);

  return {
    handleKeyDown,
    pasteNode,
    copyNode,
    cutNode,
    deleteSelected,
    selectAllNodes,
    deselectAllNodes,
    selectNode,
  };
};