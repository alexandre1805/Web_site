const jwt = require("jsonwebtoken");
const userModel = require("../models/users");
const userAuth = require("./userAuth");
const notificationModel = require("../models/notification");

exports.getFriends = async function (req, res) {
  var username = userAuth.checkAuth();
  console.log(username);
  const user = await userModel.findOne({ username });
  res.status(200).json(user.friends);
};

exports.addFriend = async (socket, friend) => {
  const db_user = await userModel.findOne({
    username: socket.handshake.query.username,
  });

  if (db_user.friends.includes[friend]) {
    socket.emit("add Friend return", "the user is already your friend");
    return;
  }

  const db_friend = await userModel.findOne({ username: friend });
  if (db_friend === null) {
    socket.emit("add Friend return", "the user does not exist");
    return;
  }

  const new_notification = new notificationModel({
    type: "add_friend",
    username: db_friend.username,
    message: db_user.username + " wants to add you as friend !",
  });

  await new_notification.save();

  socket.emit("add Friend return", "Demand sended");
  return new_notification;
};
