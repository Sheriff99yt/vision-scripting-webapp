// userSettings.js
import { useCallback } from "react";

export const useUserSettings = ({
  copyNode,
  cutNode,
  pasteNode,
  deleteSelected,
  selectAllNodes,
  deselectAllNodes,
  undo,
  redo,
  nodes,
  edges,
}) => {
  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "c":
          if (event.ctrlKey) {
            copyNode();
            event.preventDefault();
          }
          break;
        case "x":
          if (event.ctrlKey) {
            cutNode();
            event.preventDefault();
          }
          break;
        case "v":
          if (event.ctrlKey) {
            pasteNode();
            event.preventDefault();
          }
          break;
        case "Delete":
          deleteSelected();
          event.preventDefault();
          break;
        case "a":
          if (event.ctrlKey) {
            selectAllNodes();
            event.preventDefault();
          }
          break;
        case "d":
          if (event.ctrlKey) {
            deselectAllNodes();
            event.preventDefault();
          }
          break;
        case "z":
          if (event.ctrlKey) {
            undo();
            event.preventDefault();
          }
          break;
        case "y":
          if (event.ctrlKey) {
            redo();
            event.preventDefault();
          }
          break;
        default:
          break;
      }
    },
    [
      copyNode,
      cutNode,
      deleteSelected,
      pasteNode,
      selectAllNodes,
      deselectAllNodes,
      undo,
      redo,
    ]
  );

  return { handleKeyDown };
};
