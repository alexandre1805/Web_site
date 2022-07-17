const gameModel = require("../models/games");
const game_info = [{ name: "tic-tac-toe", max_players: 2 }];

function convert_id(id) {
  return id.split("-")[1];
}

exports.getGames = async function (req, res) {
  res.status(200).json({ games: game_info });
};

exports.createGame = async function (args) {
  let cur_game_info = game_info.find((val) => val.name === args.game);
  const newGame = new gameModel({
    name: args.game,
    state: args.state,
    room: args.room,
    nb_players: 0,
    max_players: cur_game_info.max_players,
  });

  let id = await newGame.save().then((obj) => {
    return obj._id;
  });
  return "game-" + id;
};

exports.join = async function (io, args) {
  const game = await gameModel.findById(convert_id(args.id));
  game.players.push(args.username);
  game.nb_players++;
  await game.save();
  update(io, "Connection_status", args.id, game);
};

exports.leave = async function (io, args) {
  const game = await gameModel.findById(convert_id(args.id));
  if ((game.state = "Not started")) {
    game.nb_players--;
    game.players = game.players.filter((elm) => elm !== args.username);
    await game.save();
    update(io, "Connection_status", args.id, game);
  }
};

async function update(io, type, id, game) {
  let msg = { type: type };
  if (type === "Connection_status") {
    if (game.nb_players === game.max_players) msg["message"] = "";
    else
      msg["message"] =
        "Waiting for other player ... (" +
        game.nb_players +
        "/" +
        game.max_players +
        ")";
  }

  io.to(id).emit("update", msg);
}
