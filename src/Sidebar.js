import React, { useEffect } from "react";

const Sidebar = ({
  searchQuery,
  setSearchQuery,
  filteredNodeTypes,
  createNode,
}) => {
  const handleDragStart = (event, type) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type })
    );
  };

  const handleClick = (type) => {
    createNode(type, { x: 100, y: 100 }); // Spawn node at default position
  };

  useEffect(() => {
    // This effect will run whenever searchQuery changes
    console.log("Search query changed:", searchQuery);
  }, [searchQuery]);

  return (
    <aside className="sidebar">
      <input
        type="text"
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