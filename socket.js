const socket = io("YOUR_RENDER_BACKEND_URL");

let myId = null;

socket.on("connect", () => {
  myId = socket.id;
});

socket.on("roomUpdate", data => {
  document.getElementById("players").innerText =
    data.players.map(p => p.name).join(", ");
});

socket.on("startGame", data => {
  startRound(data);
});

socket.on("turnUpdate", id => {
  updateTurn(id);
});