const socket = io();

document.getElementById("msgForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit("sendMessage", msg, (err) => {
    if (err) return console.log(err);
    console.log("Deliverd!");
  });
});

socket.on("message", (msg) => {
  console.log(msg);
});

document.getElementById("sendLocation").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert(`Sorry, your browser doesn't support Geolocation`);
  }
  navigator.geolocation.getCurrentPosition((location) => {
    socket.emit(
      "sendLocation",
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      () => {
        console.log("Location Shared");
      }
    );
  });
});
