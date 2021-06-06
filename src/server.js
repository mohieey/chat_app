const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const publicDirectoryPath = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("Connected to the WebSocket");

  socket.emit("message", "Welcome");

  socket.on("sendMessage", (msg) => {
    io.emit("message", msg);
  });
});
app.get("/", async (req, res) => {
  res.render("index.html");
});

module.exports = server;
