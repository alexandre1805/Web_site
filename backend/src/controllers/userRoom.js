const roomModel = require("../models/rooms");
const userModel = require("../models/users");
const userMsg = require("../models/messages");
const userAuth = require("./userAuth");

//set the name if it is a PM
function convert_name_for_PM(room, username) {
  if (room.type === "PM") {
    room.name =
      room.users[0] === username
        ? (room.name = room.users[1])
        : (room.name = room.users[0]);
  }
  return room;
}

exports.createRoom = async (io, socket, connected_users, args) => {
  //verifications
  let room_users = args.sort();
  var existing_room = await roomModel.findOne({ users: room_users });
  if (existing_room) {
    socket.emit("create Room return", "Room already exists.");
    return;
  }

  //creation
  let new_room = {
    type: room_users.length > 2 ? "group" : "PM",
    name: room_users.join(", "),
    users: room_users,
  };

  //database save
  const database_save = new roomModel(new_room);
  new_room.id = await database_save.save().then((obj) => {
    return obj.id;
  });
  new_room.unread = 0;

  new_room.users.forEach((room_user) => {
    userModel.findOne({ username: room_user }).then((user) => {
      user.rooms.push(new_room.id);
      user.save();
    });
  });

  //real-time socket io conection
  new_room.users.forEach((room_user) => {
    if (connected_users.get(room_user) !== undefined) {
      let user_id = connected_users.get(room_user);
      let user_socket = io.sockets.sockets.get(user_id);
      let tmp_room = convert_name_for_PM(new_room, room_user);

      user_socket.join(tmp_room.id);
      io.to(user_socket.id).emit("new room", tmp_room);
    }
  });

  socket.emit("create Room return", "Room created");
};

exports.getRooms = async (req, res) => {
  var username = userAuth.checkAuth(req, res);
  if(username === undefined) return;
  var user_rooms = await userModel
    .findOne({ username: username })
    .then((user) => {
      return user.rooms;
    });

  var rooms = await roomModel.find({ id: user_rooms }).lean();
  for (const room of rooms) {
    room.id = room._id.valueOf();
    delete room._id;

    convert_name_for_PM(room, username);

    //get the last message
    if (room.lastMessage !== undefined) {
      let lastMsg = await userMsg.findById(room.lastMessage);
      room.lastMessage = lastMsg.message;
    }
    //get number of unread message
    room.unread = (
      await userMsg.find({ room: room.id, read: { $ne: username } })
    ).length;
  }

  res.status(200).json({ rooms: rooms });
};

exports.getRoomsTab = async (username) => {
  return await userModel.findOne({ username: username }).then((user) => {
    if (!user) return [];
    else return user.rooms;
  });
};
