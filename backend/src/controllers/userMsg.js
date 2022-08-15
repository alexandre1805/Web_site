const messagesModel = require("../models/messages");
const gamesModel = require("../models/games");
const userAuth = require("./userAuth");
const games = require("./games-connection");

exports.handleMsg = async function (socket, args) {
  if (args.type === "game") {
    const response = await gamesModel.find({
      room: args.room,
      state: { $nin: ["Finished", "Cancelled"] },
    });
    if (response !== null && response.length >= 2) {
      socket.emit(
        "error message",
        "Two games are already running, please wait..."
      );
      return null;
    }
    args["game_id"] = await games.createGame(args);
  }

  const newMessage = new messagesModel(args);
  var id = await newMessage.save().then((obj) => {
    return obj._id;
  });
  args["_id"] = id;
  return args;
};

exports.getMessages = async function (req, res) {
  var username = userAuth.checkAuth(req, res);
  if (username === undefined) return;
  const messages = await messagesModel.find({ room: req.query.room });
  res.status(200).json({ messages: messages });
};

exports.updateGameMsg = async function (io, game_id, state) {
  const msg = await messagesModel.findOne({ game_id: game_id });
  msg.state = state;
  if (state == "Running") msg.message = "Game running ...";
  else if (state == "Cancelled") msg.message = "Game cancelled";
  else msg.message = state;
  await msg.save();

  io.to(game_id).emit("update message", msg);
};
