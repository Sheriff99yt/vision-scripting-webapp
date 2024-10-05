# Vision Visual Scripting Web App Documentation

## Introduction

Vision Visual Scripting Web App is an advanced, web-based visual scripting tool that allows users to design and connect workflows through an intuitive node-based interface. This project is the successor to the original Vision Visual Scripting (VVS) graduation project, now reimagined as a powerful web application.

## Features

- **Node-Based Design:** Easily create, edit, and link nodes to develop workflows. Users can drag nodes from a toolbox and connect them with lines to define logic and data flow.
- **Dark/Light Mode Toggle:** Switch between dark and light modes for optimal viewing, ensuring comfort during prolonged use and accommodating user preferences.
- **Local Save/Load Functionality:** Save and load scripts from local JSON files, allowing users to work offline and manage their projects efficiently.
- **Customizable Nodes:** Input, process, and output nodes designed with flexibility in mind, featuring clean designs and soft shadows to enhance visibility and organization.
- **Real-Time Node Management:** Drag and drop nodes to design workflows interactively, with immediate updates and feedback provided by the UI.
- **Toolbox Search:** An intuitive search function to quickly find and add different node types, streamlining the workflow creation process.
- **Dynamic Ports:** Ensuring flexible port management for real-time connections, allowing users to add or remove connections seamlessly as workflows evolve.

## Technology Stack

### Frontend
- React (v18.3.1)
- react-flow-renderer (v10.3.17) for node-based interface
- CSS for styling (with plans to incorporate Tailwind CSS)

### Backend
- Currently using local storage and file system
- Future plans include integrating FastAPI for enhanced data handling and processing

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone <private-repo-link>
   ```
2. Navigate to the project folder:
   ```bash
   cd /path/to/your/local/project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`. You can access it via your web browser and begin designing your workflows immediately.

## Project Structure

The project follows a standard React application structure:

- `public/`: Contains the HTML template and public assets
- `src/`: Contains the React components and application logic
  - `App.js`: The main application component
  - `VisualScripting.js`: Core component for the visual scripting interface
  - `NodeTypes.js`: Defines custom node types (Process and For Loop)
  - `Sidebar.js`: Component for the sidebar with node selection
  - `Toolbar.js`: Component for the toolbar with action buttons
  - `useUserSettings.js`: Custom hook for user interactions and settings
  - `hooks/useNodeCreation.js`: Custom hook for node creation
  - `Notification.js`: Component for displaying notifications
  - `styles.css`: Global styles for the application

## Key Components

### VisualScripting

The main component that orchestrates the visual scripting interface.

Key functionalities:
- Node and edge management
- Dark/Light mode toggle
- File saving and loading
- Clipboard operations (copy, cut, paste)
- Undo/Redo functionality
- Drag and drop node creation

### NodeTypes

Defines custom node types used in the application.

Currently supported node types:
- Process Node
- For Loop Node

### Sidebar

Implements the sidebar component with a searchable list of available node types.

### Toolbar

Implements the toolbar component with various action buttons for common operations.

### useUserSettings

A custom hook that manages user interactions and settings.

Key functionalities:
- Keyboard shortcut handling
- Clipboard operations
- Node selection and deselection
- Undo and Redo operations

### useNodeCreation

A custom hook that manages the creation of new nodes in the workflow.

### Notification

A component that displays non-intrusive notifications to provide user feedback.

## Styling

The `styles.css` file contains the global styles for the application, including dark and light mode themes. It uses CSS variables for easy theme switching and maintains a consistent look and feel across the application.

## Next Steps

1. Implement more node types to expand the functionality of the visual scripting tool.
2. Enhance the UI/UX of the sidebar and toolbar for better user interaction.
3. Begin planning for backend integration with FastAPI.
4. Start writing unit tests for existing components and functions.
5. Implement TypeScript for improved type safety and developer experience.
6. Optimize performance for large workflows, potentially implementing virtualization for node rendering.
7. Enhance error handling and validation for node connections.

For more detailed information about specific components and their implementations, please refer to the inline comments in the respective source files.