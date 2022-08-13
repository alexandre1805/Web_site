let games = new Map();

exports.create = function (io, id, users) {
  let game = { board: ["", "", "", "", "", "", "", "", ""] };
  game[users[0]] = "X";
  game[users[1]] = "O";
  game["current_player"] = users[Math.floor(Math.random() * 2)];
  game["winner"] = null;

  games.set(id, game);
  io.to(id).emit("Tic-tac-toe update", game);
};

exports.update = function (io, id, game) {
  games.set(id, game);
  io.to(id).emit("Tic-tac-toe update", game);
};
