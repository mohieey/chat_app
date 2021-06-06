const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const Filter = require("bad-words");

const publicDirectoryPath = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("Connected to the WebSocket");

  socket.emit("message", "Welcome");
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (msg, callback) => {
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback("Profanity isn't allowed");
    }

    io.emit("message", msg);
    callback();
  });

  socket.on("sendLocation", (location, callback) => {
    io.emit(
      "locationMessage",
      `https://google.com/maps?q=${location.latitude},${location.longitude}`
    );
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });
});
app.get("/", async (req, res) => {
  res.render("index.html");
});

module.exports = server;
