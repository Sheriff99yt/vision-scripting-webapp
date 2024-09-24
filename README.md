
# Vision Visual Scripting Web App

This project is a web-based implementation of the Vision Visual Scripting application, allowing users to create visual programming workflows through a node-based interface. The app is designed with a focus on simplicity, functionality, and user-friendly UI/UX.

## Features
- **Node-Based Scripting:** Create, edit, and connect nodes to design custom logic workflows.
- **Dark Mode and Light Mode Support:** Choose between eye-comforting dark and light themes.
- **Save/Load Functionality:** Save your visual scripting workflows to your local machine as JSON files and reload them at any time.
- **Customizable Node Design:** Nodes feature a clean, soft-shadow design with rounded corners for a modern look.
- **Real-Time Node Interaction:** Drag and drop nodes, link them together, and visualize the logic flow in real-time.
- **Toolbox Layout:** The toolbox from the previous version has been reimplemented for an intuitive design.
- **Dynamic Ports:** Flexible port assignments to avoid conflicts during development.

## Technologies Used
- **Frontend:** React, CSS (Tailwind CSS optional)
- **Backend:** Temporarily disabled (FastAPI planned for server-side logic)
- **Data Storage:** Local JSON files for save/load functionality
- **Additional Tools:** WebSockets for real-time features (planned), OpenAI's API integration (planned)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sheriff99yt/vision-scripting-webapp.git
   ```
2. Navigate to the project folder:
   ```bash
   cd D:/Important/Programming/code_gpt/vision-scripting-webapp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   The app will be accessible at `http://localhost:3000`.

## Future Plans
- Re-enable FastAPI backend to handle server-side logic.
- Expand node functionality with additional scripting options.
- Implement real-time collaboration using WebSockets.
- Add more customization options for node and toolbox layouts.

## License
This project is licensed under the MIT License.


