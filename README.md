
---

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

## Technologies Used
- **Frontend:** Built with React and styled using CSS, with Tailwind CSS support for responsive design and modern aesthetics.
- **Backend:** Currently temporarily disabled with FastAPI planned for future development to support data handling and processing.
- **Data Storage:** Utilizes JSON files for local saving and loading, enabling easy project sharing and backup.
- **Additional Tools:** Future updates will include WebSocket integrations for real-time collaboration and AI tools to assist scripting.

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

## Future Updates
- Integration of FastAPI for backend functionality to handle user requests and improve performance.
- Real-time collaboration through WebSockets, enabling multiple users to work on workflows simultaneously.
- Enhanced node customization and further layout options to cater to a wider range of user needs.
- AI-powered scripting assistance, providing tips and suggestions to optimize workflows and improve user efficiency.

## License
This is a private project. Please do not distribute without permission.

---