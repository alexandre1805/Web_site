const jwt = require("jsonwebtoken");
const userModel = require("../models/users");
const userAuth = require("./userAuth");
const notificationModel = require("../models/notification");

exports.getFriends = async function (req, res) {
  var username = userAuth.checkAuth(req, res);
  const user = await userModel.findOne({ username: username });
  let friends = [];
  for (const friend in user.friends) {
    const f = await userModel.findOne({ username: user.friends[friend] });
    friends.push(f);
  }
  res.status(200).json({ friends: friends });
};

exports.getNotif = async function (req, res) {
  var username = userAuth.checkAuth(req, res);
  const notifs = await notificationModel.find({ username: username });
  res.status(200).json(notifs);
};

exports.addFriend = async (socket, friend) => {
  const db_user = await userModel.findOne({
    username: socket.handshake.query.username,
  });

  if (db_user.friends.includes(friend)) {
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
    from: db_user.username,
    message: db_user.username + " wants to add you as friend !",
  });

  await new_notification.save();

  socket.emit("add Friend return", "Demand sended");
  return new_notification;
};

exports.acceptInvation = async (args) => {
  const user = await userModel.findOne({ username: args.username });
  const friend = await userModel.findOne({ username: args.from });

  user.friends.push(friend.username);
  friend.friends.push(user.username);

  await user.save();
  await friend.save();
  await notificationModel.deleteOne({ _id: args._id });
};
