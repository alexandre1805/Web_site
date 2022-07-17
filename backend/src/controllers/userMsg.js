const messagesModel = require("../models/messages");
const gamesModel = require("../models/games");
const userAuth = require("./userAuth");
const games = require("./games");

exports.handleMsg = async function (args) {
  if (args.type === "game") {
    const response = await gamesModel.find({
      room: args.room,
      state: { $ne: "Finished" },
    });
    if (response !== null && response.length >= 2) return;
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
