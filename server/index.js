const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { rooms, createRoom } = require("./rooms");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", socket => {

  socket.on("createRoom", name => {
    const id = Math.random().toString(36).substr(2,6);
    createRoom(id, name, socket.id);
    socket.join(id);
    socket.emit("roomCreated", id);
    io.to(id).emit("roomUpdate", rooms[id]);
  });

  socket.on("joinRoom", data => {
    const room = rooms[data.roomId];
    if (!room || room.players.length >= 4) return;
    room.players.push({ id: socket.id, name: data.name });
    socket.join(data.roomId);
    socket.emit("joinedRoom", data.roomId);
    io.to(data.roomId).emit("roomUpdate", room);

    if (room.players.length >= 2) {
      io.to(data.roomId).emit("startGame", { map: room.map });
      io.to(data.roomId).emit(
        "turnUpdate",
        room.players[room.turn].id
      );
    }
  });

  socket.on("shoot", data => {
  const room = rooms[data.roomId];
  if (!room) return;

  const current = room.players[room.turn];
  if (current.id !== socket.id) return;

  // count shot
  current.shots = (current.shots || 0) + 1;

  // send velocity
  io.to(data.roomId).emit("ballUpdate", {
    vx: data.vx,
    vy: data.vy
  });

  // move turn after short delay (ball stops)
  setTimeout(() => {
    room.turn = (room.turn + 1) % room.players.length;
    io.to(data.roomId).emit(
      "turnUpdate",
      room.players[room.turn].id
    );
  }, 1200);
});

});

server.listen(3000);
