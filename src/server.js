const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const Filter = require("bad-words");

const { generateMsg, generateLocationMsg } = require("./utils/messages");

const publicDirectoryPath = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("Connected to the WebSocket");

  socket.on("join", ({ username, room }) => {
    socket.join(room);
    socket.emit("message", generateMsg("Welcome!"));
    socket.broadcast
      .to(room)
      .emit("message", generateMsg(`${username} has joined!`));
  });

  socket.on("sendMessage", (msg, callback) => {
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback("Profanity isn't allowed");
    }

    io.emit("message", generateMsg(msg));
    callback();
  });

  socket.on("sendLocation", (location, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMsg(
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMsg("A user has left"));
  });
});
app.get("/", async (req, res) => {
  res.render("index.html");
});

module.exports = server;
