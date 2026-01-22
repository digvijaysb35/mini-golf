const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ball = { x: 150, y: 100, vx: 0, vy: 0, r: 8 };
let myTurn = false;

let aiming = false;
let aimStart = null;
let aimEnd = null;

function startRound(data) {
  canvas.classList.remove("hidden");
  ball.x = data.map.start.x;
  ball.y = data.map.start.y;
  ball.vx = ball.vy = 0;
}

function updateTurn(id) {
  myTurn = id === myId;
  turnInfo.innerText = myTurn ? "Your Turn" : "Waiting...";
}

canvas.addEventListener("touchstart", e => {
  if (!myTurn) return;
  const t = e.touches[0];
  aiming = true;
  aimStart = { x: t.clientX - canvas.offsetLeft, y: t.clientY - canvas.offsetTop };
});

canvas.addEventListener("touchmove", e => {
  if (!aiming) return;
  const t = e.touches[0];
  aimEnd = { x: t.clientX - canvas.offsetLeft, y: t.clientY - canvas.offsetTop };
});

canvas.addEventListener("touchend", () => {
  if (!aiming || !aimEnd) return;

  const dx = aimStart.x - aimEnd.x;
  const dy = aimStart.y - aimEnd.y;

  socket.emit("shoot", {
    roomId,
    vx: dx * 0.1,
    vy: dy * 0.1
  });

  aiming = false;
  aimStart = aimEnd = null;
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // golf area
  ctx.fillStyle = "#7cb342";
  ctx.fillRect(40, 20, 220, 560);

  // aiming line
  if (aiming && aimEnd) {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(aimEnd.x, aimEnd.y);
    ctx.stroke();
  }

  // hole
ctx.fillStyle = "black";
ctx.beginPath();
ctx.arc(150, 550, 10, 0, Math.PI * 2);
ctx.fill();

// ball
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
ctx.fill();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
