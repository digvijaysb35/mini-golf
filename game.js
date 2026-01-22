const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ball = { x: 150, y: 100, vx: 0, vy: 0 };
let myTurn = false;

function startRound(data) {
  lobby.classList.add("hidden");
  canvas.classList.remove("hidden");
  ball.x = data.map.start.x;
  ball.y = data.map.start.y;
}

function updateTurn(id) {
  myTurn = id === myId;
  turnInfo.innerText = myTurn ? "Your Turn" : "Waiting...";
}

canvas.addEventListener("touchend", e => {
  if (!myTurn) return;
  socket.emit("shoot", { roomId, vx: 3, vy: 5 });
});

socket.on("ballUpdate", data => {
  ball.vx = data.vx;
  ball.vy = data.vy;
});

function update() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vx *= 0.98;
  ball.vy *= 0.98;
}

function draw() {
  ctx.clearRect(0,0,300,600);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 8, 0, Math.PI*2);
  ctx.fill();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();