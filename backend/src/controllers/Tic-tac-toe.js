const game_connection = require("./games-connection");
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

exports.update = async function (io, id, game) {
  games.set(id, game);
  io.to(id).emit("Tic-tac-toe update", game);
  if (game.winner !== null) {
    if (game.winner === undefined) await game_connection.finish(io, id, "Draw");
    else {
      let winner;
      for (const [key, value] of Object.entries(game))
        if (key !== "winner" && value == game.winner) winner = key;

      await game_connection.finish(io, id, "The winner is " + winner);
    }
  }
};