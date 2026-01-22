function generateMap(round) {
  return {
    start: { x: 150, y: 100 },
    hole: { x: 150, y: 550 },
    maxShots: Math.max(3, 8 - round),
    obstacles: []
  };
}

module.exports = generateMap;