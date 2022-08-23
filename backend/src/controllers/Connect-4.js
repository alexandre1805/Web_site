const game_connection = require("./games-connection");
let games = new Map();

exports.create = function (io, id, users) {
  let game = {};
  game["board"] = [
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
  ];
  game[users[0]] = "R";
  game[users[1]] = "Y";
  game["current_player"] = users[Math.floor(Math.random() * 2)];
  game["winner"] = null;

  games.set(id, game);
  io.to(id).emit("Connect-4 update", game);
};

exports.update = async function (io, id, game) {
  games.set(id, game);
  io.to(id).emit("Connect-4 update", game);
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
