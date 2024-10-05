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
  - `useUserSettings.js`: Custom hook for user interactions and settings
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

### NodeTypes

Defines custom node types used in the application.

Currently supported node types:
- Process Node
- For Loop Node

### Sidebar

Provides a searchable list of available node types for easy addition to the workflow.

### useUserSettings

A custom hook that manages user interactions and settings.

## Styling

The application uses CSS for styling, with support for both dark and light modes.

## Future Enhancements

- Integration of FastAPI for backend functionality to handle user requests and improve performance.
- Real-time collaboration through WebSockets, enabling multiple users to work on workflows simultaneously.
- Enhanced node customization and further layout options to cater to a wider range of user needs.
- AI-powered scripting assistance, providing tips and suggestions to optimize workflows and improve user efficiency.

## License

This is a private project and should not be distributed without permission.

## Conclusion

The Vision Visual Scripting Web App builds upon the foundation of the original VVS project, offering a more accessible and powerful platform for visual scripting. With its intuitive interface and robust feature set, it provides users with a versatile tool for designing complex workflows and logic systems.