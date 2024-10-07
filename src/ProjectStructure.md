# Codebase Structure and Functionality

## src/

### VisualScripting.js
- Main component for the visual scripting interface
- Manages the overall state and layout of the application
- Integrates React Flow for node-based editing
- Handles user interactions and updates to the flow

### useUserSettings.js
- Custom hook for managing user settings and actions
- Implements functions for copying, cutting, pasting, and deleting nodes
- Handles undo/redo functionality
- Manages keyboard shortcuts for various actions


### hooks/useNodeCreation.js
- Custom hook for creating new nodes
- Handles the logic for adding new nodes to the flow

### NodeTypes.js
- Defines custom node types (ProcessNode and ForLoopNode)
- Implements the rendering logic for each node type

### Sidebar.js
- Renders the sidebar component
- Displays available node types for dragging into the canvas
- Implements search functionality for node types

### Toolbar.js
- Renders the toolbar component
- Provides buttons for various actions (save, load, undo, redo, etc.)

### Notification.js
- Renders notification messages
- Handles the display and dismissal of notifications

### clipboard.js
- Implements clipboard functionality for copying and pasting nodes
- Handles serialization and deserialization of node data

### styles.css
- Contains global styles for the application

## public/

### index.html
- Main HTML file for the React application
- Includes necessary meta tags and the root element for React rendering

### manifest.json
- Web app manifest file
- Defines app metadata for Progressive Web App functionality

### favicon.ico
- Favicon for the application

### robots.txt
- Provides instructions for web crawlers
