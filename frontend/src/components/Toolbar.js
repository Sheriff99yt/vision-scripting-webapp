// Toolbar.js
import React, { useCallback, useRef } from "react";

const Toolbar = ({
  toggleDarkMode,
  saveToFile,
  loadFromFile,
  copyNode,
  cutNode,
  pasteNode,
  deleteSelected,
  selectAllNodes,
  deselectAllNodes,
  undo,
  redo,
  fileInputRef,
}) => {
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="toolbar">
      <button onClick={toggleDarkMode} style={{ margin: "8px" }}>
        Toggle Dark Mode
      </button>
      <button onClick={saveToFile} style={{ margin: "8px" }}>
        Save to File
      </button>
      <input
        type="file"
        accept=".json"
        onChange={loadFromFile}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
      <button onClick={triggerFileInput} style={{ margin: "8px" }}>
        Load from File
      </button>
      <button onClick={copyNode} style={{ margin: "8px" }}>
        Copy
      </button>
      <button onClick={cutNode} style={{ margin: "8px" }}>
        Cut
      </button>
      <button onClick={pasteNode} style={{ margin: "8px" }}>
        Paste
      </button>
      <button onClick={deleteSelected} style={{ margin: "8px" }}>
        Delete
      </button>
      <button onClick={selectAllNodes} style={{ margin: "8px" }}>
        Select All
      </button>
      <button onClick={deselectAllNodes} style={{ margin: "8px" }}>
        Deselect All
      </button>
      <button onClick={undo} style={{ margin: "8px" }}>
        Undo
      </button>
      <button onClick={redo} style={{ margin: "8px" }}>
        Redo
      </button>
    </div>
  );
};

export default Toolbar;
