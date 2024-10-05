// Toolbar.js
import React, { useCallback, useRef } from "react";

// Button configuration array
const buttonsConfig = [
  { label: "Toggle Dark Mode", onClick: "toggleDarkMode" },
  { label: "Save to File", onClick: "saveToFile" },
  { label: "Load from File", onClick: "triggerFileInput", isFileInput: true },
  { label: "Copy", onClick: "copyNode" },
  { label: "Cut", onClick: "cutNode" },
  { label: "Paste", onClick: "pasteNode" },
  { label: "Delete", onClick: "deleteSelected" },
  { label: "Select All", onClick: "selectAllNodes" },
  { label: "Deselect All", onClick: "deselectAllNodes" },
  { label: "Undo", onClick: "undo" },
  { label: "Redo", onClick: "redo" },
];

const ToolbarButton = ({
  label,
  onClick,
  style,
  isFileInput,
  fileInputRef,
}) => {
  const handleClick = isFileInput
    ? () => fileInputRef.current.click()
    : onClick;

  return (
    <button onClick={handleClick} style={style}>
      {label}
    </button>
  );
};

const Toolbar = (props) => {
  const { fileInputRef } = props;

  return (
    <div className="toolbar">
      {buttonsConfig.map(({ label, onClick, isFileInput }, index) => (
        <ToolbarButton
          key={index}
          label={label}
          onClick={props[onClick]}
          isFileInput={isFileInput}
          fileInputRef={fileInputRef}
          style={{ margin: "8px" }}
        />
      ))}
      <input
        type="file"
        accept=".json"
        onChange={props.loadFromFile}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
    </div>
  );
};

export default Toolbar;
