# Vision Visual Scripting Web App - Project Status

## Current Status
The Vision Visual Scripting Web App is a React-based application that provides a node-based interface for designing and connecting workflows. The project is currently in active development, with core functionalities implemented and ready for further enhancements.

## Key Features Implemented
- Node-based design interface
- Dark/Light mode toggle
- Local save/load functionality
- Customizable nodes (Process and For Loop)
- Real-time node management
- Toolbox search
- Undo/Redo functionality
- Clipboard operations (copy, cut, paste)
- Keyboard shortcuts for common actions
- Custom hook for node creation (useNodeCreation)
- Drag and drop functionality for node creation
- Notification system for user feedback

## Development Guidelines
1. Follow React best practices and hooks for state management.
2. Maintain a consistent coding style across the project.
3. Write clear, concise comments for complex logic.
4. Ensure cross-browser compatibility.
5. Optimize performance, especially for large workflows.

## To-Do List
- [ ] Fix issue where edges are deleted upon creating a new node
- [ ] Resolve animation not working for nodes and edges
- [ ] Implement more node types (e.g., conditional, input/output nodes)
- [ ] Enhance the UI/UX of the sidebar and toolbar
- [ ] Add a node properties panel for detailed customization
- [ ] Implement zoom and pan controls for the main canvas
- [ ] Create a user guide or tutorial for new users
- [x] Add keyboard shortcuts for common actions
- [ ] Implement error handling and validation for node connections
- [ ] Optimize performance for large workflows
- [ ] Add unit tests for critical components and functions
- [ ] Implement TypeScript for improved type safety
- [ ] Implement lazy loading for large workflows
- [ ] Optimize rendering for complex node structures

## Known Issues
- Performance may degrade with very large workflows (100+ nodes).
- Some browser-specific CSS inconsistencies in the light mode.

## References
- React Flow documentation: [https://reactflow.dev/docs/](https://reactflow.dev/docs/)
- React hooks documentation: [https://reactjs.org/docs/hooks-intro.html](https://reactjs.org/docs/hooks-intro.html)

## Project Structure
- `VisualScripting.js`: This file contains the main component for the visual scripting interface. It manages the overall state and interactions of the application, including:
  - Node and edge management
  - Dark/Light mode toggle
  - File saving and loading
  - Clipboard operations (copy, cut, paste)
  - Undo/Redo functionality
- `Sidebar.js`: Implements the sidebar component with a searchable list of available node types.
- `NodeTypes.js`: Defines custom node types used in the application, such as Process and For Loop nodes.
- `useUserSettings.js`: A custom hook that manages user interactions and settings.
- `styles.css`: Contains global styles for the application, including dark and light mode themes.
- `hooks/useNodeCreation.js`: A custom hook that manages the creation of new nodes in the workflow.
- `Toolbar.js`: Implements the toolbar component with various action buttons.
- `Notification.js`: Implements the notification component for user feedback.

These files work together to create a comprehensive visual scripting environment, handling everything from the user interface to the core logic of node management and workflow creation.

## Styling

The `styles.css` file contains the global styles for the application, including dark and light mode themes. Here's a brief overview of its contents:

- General app styles, including body background and font settings
- App container styles with dark and light mode transitions
- Sidebar and main canvas layout
- Custom node styles with background, color, and shadow properties
- Button styles with hover effects
- React Flow control and minimap styles

The file uses CSS variables for easy theme switching and maintains a consistent look and feel across the application. It also includes responsive design elements to ensure proper display on various screen sizes.

For more detailed information, refer to the `src/styles.css` file in the project directory.

## Next Steps
1. Implement more node types to expand the functionality of the visual scripting tool.
2. Enhance the UI/UX of the sidebar and toolbar for better user interaction.
3. Begin planning for backend integration with FastAPI.
4. Start writing unit tests for existing components and functions.
5. Implement TypeScript for improved type safety and developer experience.
6. Optimize performance for large workflows, potentially implementing virtualization for node rendering.
7. Enhance error handling and validation for node connections.

Remember to update this file regularly as the project progresses and new features are implemented or planned.