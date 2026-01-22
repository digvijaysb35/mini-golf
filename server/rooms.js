const generateMap = require("./mapGen");

const rooms = {};

function createRoom(id, name, socketId) {
  rooms[id] = {
    players: [{ id: socketId, name }],
    turn: 0,
    round: 1,
    map: generateMap(1)
  };
}

module.exports = { rooms, createRoom };