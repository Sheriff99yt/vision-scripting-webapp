# Vision Visual Scripting Web App

This project is a private implementation of a visual scripting web app, providing users with a node-based interface for designing and connecting workflows. The app emphasizes a user-friendly, visually appealing UI with customizable dark and light modes. It serves as a powerful tool for both beginners and advanced users, allowing seamless development of complex logic through an intuitive graphical interface.

## Features
- **Node-Based Design:** Easily create, edit, and link nodes to develop workflows. Users can drag nodes from a toolbox and connect them with lines to define logic and data flow.
- **Dark/Light Mode Toggle:** Switch between dark and light modes for optimal viewing, ensuring comfort during prolonged use and accommodating user preferences.
- **Local Save/Load Functionality:** Save and load scripts from local JSON files, allowing users to work offline and manage their projects efficiently.
- **Customizable Nodes:** Input, process, and output nodes designed with flexibility in mind, featuring clean designs and soft shadows to enhance visibility and organization.
- **Real-Time Node Management:** Drag and drop nodes to design workflows interactively, with immediate updates and feedback provided by the UI.
- **Toolbox Search:** An intuitive search function to quickly find and add different node types, streamlining the workflow creation process.
- **Dynamic Ports:** Ensuring flexible port management for real-time connections, allowing users to add or remove connections seamlessly as workflows evolve.
- **Undo/Redo Functionality:** Easily revert or reapply changes to your workflow.

## Technologies Used
- **Frontend:** Built with React 18 and styled using CSS, with plans to incorporate Tailwind CSS for responsive design and modern aesthetics.
- **Node Management:** Utilizes react-flow-renderer (v10.3.17) for the interactive node-based interface.
- **Data Storage:** Implements local storage and file system for saving and loading projects.
- **State Management:** Custom hooks for managing user settings and interactions.

## Installation

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
- `src/`: Contains the React components and application logic
  - `App.js`: The main application component
  - `VisualScripting.js`: Core component for the visual scripting interface
  - `NodeTypes.js`: Defines custom node types (Process and For Loop)
  - `Sidebar.js`: Component for the sidebar with node selection
  - `useUserSettings.js`: Custom hook for user interactions and settings
  - `styles.css`: Global styles for the application

## Usage
1. Use the sidebar to search and add nodes to your workspace.
2. Drag and connect nodes to create your workflow.
3. Utilize keyboard shortcuts for quick actions:
   - Ctrl/Cmd + C: Copy selected nodes
   - Ctrl/Cmd + X: Cut selected nodes
   - Ctrl/Cmd + V: Paste copied/cut nodes
   - Ctrl/Cmd + Z: Undo
   - Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
   - Delete: Remove selected nodes
   - Escape: Deselect all nodes
   - Ctrl/Cmd + S: Save the current flow to a file
   - Ctrl/Cmd + D: Deselect all nodes
4. Save your work using the "Save" button and load it later with the "Load" button.

## Future Updates
- Integration of FastAPI for backend functionality to handle user requests and improve performance.
- Real-time collaboration through WebSockets, enabling multiple users to work on workflows simultaneously.
- Enhanced node customization and further layout options to cater to a wider range of user needs.
- AI-powered scripting assistance, providing tips and suggestions to optimize workflows and improve user efficiency.

## License
This is a private project. Please do not distribute without permission.

## Documentation
For more detailed information about the project structure, components, and functionalities, please refer to the `DOCUMENTATION.md` file in the project root.

---