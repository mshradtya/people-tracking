const { exec } = require("child_process");
const path = require("path");

// Set the paths to your project directories
const serverDir = path.join(__dirname, "server");
const clientDir = path.join(__dirname, "client");

// Function to start the server
function startServer() {
  exec("npm run dev", { cwd: serverDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Server error: ${error}`);
    } else {
      console.log("Server started successfully!");
    }
  });
}

// Function to start the client
function startClient() {
  exec("serve", { cwd: clientDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Client error: ${error}`);
    } else {
      console.log("Client started successfully!");
    }
  });
}

// Function to start both the server and the client
function startAll() {
  startServer();
  startClient();
  console.log("PEOPLE TRACKING APPLICATION RUNNING");
}

startAll();
