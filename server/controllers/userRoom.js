const roomModel = require("../models/rooms");
const userModel = require("../models/users");
const userAuth = require("./userAuth");

exports.createRoom = async (args) => {
  const newRoom = new roomModel({
    name: args.search,
    users: [args.username],
  });

  var id = await newRoom.save().then((obj) => {
    return obj._id;
  });

  userModel.findOne({ username: args.username }).then((user) => {
    user.rooms.push(id);
    user.save();
  });
};

exports.getRooms = async (req, res) => {
  var username = userAuth.checkAuth(req, res);
  var user_rooms = await userModel.find({ username: username }).then((user) => {
    return user[0].rooms;
  });

  var rooms = await roomModel.find({ _id: user_rooms });
  res.status(200).json({ rooms: rooms });
};
