const socket = io();

//Elements
const $msgForm = document.getElementById("msgForm");
const $msgFormInput = document.getElementById("msgFormInput");
const $msgFormBtn = document.getElementById("msgFormBtn");
const $sendLocationBtn = document.getElementById("sendLocationBtn");
const $msgs = document.getElementById("msgs");
const $sideBar = document.getElementById("sideBar");

//Templates
const msgTemplate = document.getElementById("msgTemplate").innerHTML;
const locationTemplate = document.getElementById("locationTemplate").innerHTML;
const sideBarTemplate = document.getElementById("sideBarTemplate").innerHTML;
//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

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

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, { room, users });
  $sideBar.innerHTML = html;
});

const autoScroll = () => {
  const $newMsg = $msgs.lastElementChild;

  const newMsgStyles = getComputedStyle($newMsg);
  const newMsgMargin = parseInt(newMsgStyles.marginBottom);
  const newMsgHeight = $newMsg.offsetHeight + newMsgMargin;

  const visibleHeight = $msgs.offsetHeight;

  const containerHeight = $msgs.scrollHeight;

  //How far have I scrolled?
  const scrollOffset = $msgs.scrollTop + visibleHeight;

  if (containerHeight - newMsgHeight <= scrollOffset) {
    $msgs.scrollTop = containerHeight;
  }
};

socket.on("message", (msg) => {
  console.log(msg);
  const html = Mustache.render(msgTemplate, {
    username: msg.username,
    msg: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  $msgs.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", (msg) => {
  const html = Mustache.render(locationTemplate, {
    username: msg.username,
    url: msg.url,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  $msgs.insertAdjacentHTML("beforeend", html);
  autoScroll();
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

socket.emit("join", { username, room }, (error) => {
  if (error) {
    location.href = "/";

    alert(error);
  }
});
