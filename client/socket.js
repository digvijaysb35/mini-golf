const socket = io("https://mini-golf-88v0.onrender.com");

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
