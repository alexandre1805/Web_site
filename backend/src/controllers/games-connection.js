const gameModel = require("../models/games");
const Tictactoe = require("./Tic-tac-toe");
const userMsg = require("./userMsg");
const game_info = [{ name: "Tic-tac-toe", max_players: 2 }];

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
    { $push: { players: args.username }, $inc: { nb_players: 1 } }
  );
  update(io, args.id, "join");
};

exports.leave = async function (io, args) {
  await gameModel.updateOne(
    { _id: convert_id(args.id) },
    { $pull: { players: args.username }, $inc: { nb_players: -1 } }
  );
  update(io, args.id, "leave");
};

//send update to the users
async function update(io, id, type) {
  let game = await gameModel.findById(convert_id(id));
  if (game.state === "Finished") return;
  let msg = "";
  if (
    game.state === "Not started" &&
    type === "join" &&
    game.nb_players === game.max_players
  ) {
    await gameModel.updateOne(
      { _id: convert_id(id) },
      { $set: { state: "Running" } }
    );
    await userMsg.updateGameMsg(io, id, "Running");
    Tictactoe.create(io, id, game.players);
  } else if (game.state === "Not started")
    msg =
      "Waiting for other player ... (" +
      game.nb_players +
      "/" +
      game.max_players +
      ")";
  else if (game.state === "Running" && type === "join")
    console.log("[" + game.id + "]: ERROR: player joins running game");
  else if (game.state === "Running" && type === "leave") {
    await gameModel.updateOne(
      { _id: convert_id(id) },
      { $set: { state: "Cancelled" } }
    );
    msg = "Someone has been disconnected, game cancelled";
    await userMsg.updateGameMsg(io, id, "Cancelled");
  } else if (game.state === "Cancelled") return;
  io.to(id).emit("Status update", msg);
}

exports.finish = async function (io, id, msg) {
  await gameModel.updateOne(
    { _id: convert_id(id) },
    { $set: { state: "Finished" } }
  );

  await userMsg.updateGameMsg(io, id, msg);

  io.to(id).emit("Status update", msg);
};
