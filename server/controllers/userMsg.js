const messagesModel = require("../models/messages");
const jwt = require("jsonwebtoken");

exports.handleMsg = async function (args) {
  const newMessage = new messagesModel({
    message: args.msg,
    user: args.client,
  });

  var id = await newMessage.save().then((obj) => {
    return obj._id;
  });

  var obj = {
    _id: id,
    message: args.msg,
    user: args.client,
  };

  return obj;
};

exports.getMessages = async function (req, res) {
  const messages = await messagesModel.find({});
  res.json({ messages: messages });
  res.status(200);
};
