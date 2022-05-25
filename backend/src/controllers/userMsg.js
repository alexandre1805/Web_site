const messagesModel = require("../models/messages");
const userAuth = require("./userAuth");

exports.handleMsg = async function (args) {
  const newMessage = new messagesModel({
    message: args.msg,
    user: args.client,
    room: args.room,
  });

  var id = await newMessage.save().then((obj) => {
    return obj._id;
  });

  var obj = {
    _id: id,
    message: args.msg,
    user: args.client,
    room: args.room,
  };

  return obj;
};

exports.getMessages = async function (req, res) {
  userAuth.checkAuth(req, res);
  const messages = await messagesModel.find({ room: req.query.room });
  res.status(200).json({ messages: messages });
};
