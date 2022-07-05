const roomModel = require("../models/rooms");
const userModel = require("../models/users");
const userAuth = require("./userAuth");

exports.createRoom = async (socket, args) => {
  var room = roomModel.find({ users: args });
  console.log(room);
  if (room !== null) {
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

  args.foreach((username) => {
    userModel.findOne({ username: username }).then((user) => {
      user.rooms.push(id);
      user.save();
    });
  });

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
