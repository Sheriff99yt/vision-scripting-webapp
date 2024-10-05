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

## Development Guidelines
1. Follow React best practices and hooks for state management.
2. Maintain a consistent coding style across the project.
3. Write clear, concise comments for complex logic.
4. Ensure cross-browser compatibility.
5. Optimize performance, especially for large workflows.

## To-Do List
- [ ] Implement more node types (e.g., conditional, input/output nodes)
- [ ] Enhance the UI/UX of the sidebar and toolbar
- [ ] Add a node properties panel for detailed customization
- [ ] Implement zoom and pan controls for the main canvas
- [ ] Create a user guide or tutorial for new users
- [ ] Add keyboard shortcuts for common actions
- [ ] Implement error handling and validation for node connections
- [ ] Optimize performance for large workflows
- [ ] Add unit tests for critical components and functions

## Future Enhancements
1. Backend Integration:
   - Develop a FastAPI backend for handling user requests and improving performance.
   - Implement user authentication and authorization.

2. Collaboration Features:
   - Add real-time collaboration using WebSockets.
   - Implement version control for workflows.

3. AI Integration:
   - Develop AI-powered scripting assistance for workflow optimization.
   - Implement natural language processing for node creation and connection.

4. Advanced Customization:
   - Allow users to create and save custom node types.
   - Implement a theming system for more visual customization options.

5. Performance Optimization:
   - Implement lazy loading for large workflows.
   - Optimize rendering for complex node structures.

## Known Issues
- Performance may degrade with very large workflows (100+ nodes).
- Some browser-specific CSS inconsistencies in the light mode.

## References
- React Flow documentation: [https://reactflow.dev/docs/](https://reactflow.dev/docs/)
- React hooks documentation: [https://reactjs.org/docs/hooks-intro.html](https://reactjs.org/docs/hooks-intro.html)

## Project Structure

The `src` folder contains the main components and logic for the visual scripting interface:

- `VisualScripting.js`: This file contains the main component for the visual scripting interface. It manages the overall state and interactions of the application, including:
  - Node and edge management
  - Dark/Light mode toggle
  - File saving and loading
  - Clipboard operations (copy, cut, paste)
  - Undo/Redo functionality

- `NodeTypes.js`: Defines custom node types used in the application, such as Process and For Loop nodes.

- `Sidebar.js`: Implements the sidebar component with a searchable list of available node types.

- `useUserSettings.js`: A custom hook that manages user interactions and settings.

- `styles.css`: Contains global styles for the application, including dark and light mode themes.

These files work together to create a comprehensive visual scripting environment, handling everything from the user interface to the core logic of node management and workflow creation.

## Styling
startLine: 1
endLine: 116

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

Remember to update this file regularly as the project progresses and new features are implemented or planned.