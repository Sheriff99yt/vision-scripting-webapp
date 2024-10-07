import React from "react";

const Sidebar = ({
  createNode,
  searchQuery,
  setSearchQuery,
  filteredNodeTypes,
}) => {
  const handleDragStart = (event, type) => {
    event.dataTransfer.setData("application/reactflow", type);
  };

  const handleClick = (type) => {
    createNode(type, { x: 100, y: 100 }); // Spawn node at default position
  };

  return (
    <aside className="sidebar">
      <input
        type="text"
        id="node-search"
        name="node-search"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="node-types">
        {filteredNodeTypes.map((node) => (
          <button
            key={node.type}
            draggable
            onDragStart={(event) => handleDragStart(event, node.type)}
            onClick={() => handleClick(node.type)}
          >
            {node.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;