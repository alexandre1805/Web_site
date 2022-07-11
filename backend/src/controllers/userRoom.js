const roomModel = require("../models/rooms");
const userModel = require("../models/users");
const userAuth = require("./userAuth");

exports.createRoom = async (socket, args) => {
  var room = await roomModel.findOne({ users: args });
  if (room) {
    socket.emit("new Room return", "Room already created");
    return;
  }
  const newRoom = new roomModel({
    name: args.join(),
    users: args,
  });

  var id = await newRoom.save().then((obj) => {
    return obj._id;
  });

  for (const index in args) {
    userModel.findOne({ username: args[index] }).then((user) => {
      user.rooms.push(id);
      user.save();
    });
  }
  socket.emit("new Room return", "Room created");
};

exports.getRooms = async (req, res) => {
  var username = userAuth.checkAuth(req, res);
  var user_rooms = await userModel.find({ username: username }).then((user) => {
    return user[0].rooms;
  });

  var rooms = await roomModel.find({ _id: user_rooms });
  res.status(200).json({ rooms: rooms });
};

exports.getRoomsTab = async (username) => {
  return await userModel.find({ username: username }).then((user) => {
    if (user.length == 0) return [];
    else return user[0].rooms;
  });
};
