const gameModel = require("../models/games");
const Tictactoe = require("./Tic-tac-toe");
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
  await gameModel.updateOne(
    { _id: convert_id(args.id) },
    { $push: { players: args.username }, $inc: { players: 1 } }
  );
  update(io, args.id);
};

exports.leave = async function (io, args) {
  const game = await gameModel.findById(convert_id(args.id));
  if ((game.state = "Not started")) {
    await gameModel.updateOne(
      { _id: convert_id(args.id) },
      { $pull: { players: args.username }, $inc: { players: -1 } }
    );
    update(io, args.id);
  }
};

async function update(io, id) {
  let game = await gameModel.findById(convert_id(args.id));
  let msg;
  if (game.nb_players === game.max_players) {
    msg = "";
    Tictactoe.create(io, id, game.players);
  } else
    msg =
      "Waiting for other player ... (" +
      game.nb_players +
      "/" +
      game.max_players +
      ")";

  io.to(id).emit("Satus update", msg);
}
