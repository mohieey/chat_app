const socket = io();

document.getElementById("msgForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = document.getElementById("msgField").value;
  socket.emit("sendMessage", msg);
});

socket.on("message", (msg) => {
  console.log(msg);
});
