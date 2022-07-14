const messagesModel = require("../models/messages");
const userAuth = require("./userAuth");

exports.handleMsg = async function (args) {
  const newMessage = new messagesModel(args);
  var id = await newMessage.save().then((obj) => {
    return obj._id;
  });

  args["_id"] = id;
  return args;
};

exports.getMessages = async function (req, res) {
  userAuth.checkAuth(req, res);
  const messages = await messagesModel.find({ room: req.query.room });
  res.status(200).json({ messages: messages });
};
