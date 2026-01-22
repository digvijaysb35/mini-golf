let playerName = "";
let roomId = "";

function createRoom() {
  playerName = nameInput.value;
  socket.emit("createRoom", playerName);
}

function joinRoom() {
  playerName = nameInput.value;
  roomId = roomInput.value;
  socket.emit("joinRoom", { roomId, name: playerName });
}

socket.on("roomCreated", id => {
  roomId = id;
  showLobby();
});

socket.on("joinedRoom", id => {
  roomId = id;
  showLobby();
});

function showLobby() {
  home.classList.add("hidden");
  lobby.classList.remove("hidden");
  roomCode.innerText = "Room: " + roomId;
}