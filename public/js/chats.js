const socket = io();

//Elements
const $msgForm = document.getElementById("msgForm");
const $msgFormInput = document.getElementById("msgFormInput");
const $msgFormBtn = document.getElementById("msgFormBtn");
const $sendLocationBtn = document.getElementById("sendLocationBtn");
const $msgs = document.getElementById("msgs");

//Templates
const msgTemplate = document.getElementById("msgTemplate").innerHTML;
const locationTemplate = document.getElementById("locationTemplate").innerHTML;

$msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $msgFormBtn.setAttribute("disabled", "disabled");

  const msg = $msgFormInput.value;
  socket.emit("sendMessage", msg, (err) => {
    $msgFormBtn.removeAttribute("disabled");
    $msgFormInput.value = "";
    $msgFormInput.focus();

    if (err) return console.log(err);
    console.log("Deliverd!");
  });
});

socket.on("message", (msg) => {
  console.log(msg);
  const html = Mustache.render(msgTemplate, {
    msg: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  $msgs.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (msg) => {
  const html = Mustache.render(locationTemplate, {
    url: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  $msgs.insertAdjacentHTML("beforeend", html);
});

$sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert(`Sorry, your browser doesn't support Geolocation`);
  }

  $sendLocationBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((location) => {
    socket.emit(
      "sendLocation",
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      () => {
        $sendLocationBtn.removeAttribute("disabled");
        console.log("Location Shared");
      }
    );
  });
});
