// Sidebar.js
import React, { useState, useCallback } from "react";

const Sidebar = ({
  searchQuery,
  setSearchQuery,
  filteredNodeTypes,
  handleDrop,
  handleDragOver,
}) => {
  return (
    <aside className="sidebar">
      <h2>Toolbox</h2>
      <input
        type="text"
        placeholder="Search nodes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      {filteredNodeTypes.length ? (
        // Render buttons for each filtered node type
        filteredNodeTypes.map((node) => (
          <button
            key={node.type}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("application/reactflow", node.type);
            }}
          >
            {node.label}
          </button>
        ))
      ) : (
        <p>No nodes found.</p>
      )}
    </aside>
  );
};

export default Sidebar;
