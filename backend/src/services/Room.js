const RoomModel = require('../models/rooms')
const userModel = require('../models/users')
const userMsg = require('../models/messages')

// set the name if it is a PM
function convertNameForPM (room, username) {
  if (room.type === 'PM') {
    room.name =
      room.users[0] === username
        ? (room.name = room.users[1])
        : (room.name = room.users[0])
  }
  return room
}

exports.createRoom = async (io, socket, connectedUsers, args) => {
  // verifications
  const roomUsers = args.sort()
  const existingRoom = await RoomModel.findOne({ users: roomUsers })
  if (existingRoom) {
    socket.emit('Room:Create:Return', 'Room already exists.')
    return
  }

  // creation
  const newRoom = {
    type: roomUsers.length > 2 ? 'group' : 'PM',
    name: roomUsers.join(', '),
    users: roomUsers
  }

  // database save
  const databaseSave = new RoomModel(newRoom)
  newRoom.id = await databaseSave.save().then((obj) => {
    return obj.id
  })
  newRoom.unread = 0

  newRoom.users.forEach((roomUser) => {
    userModel.updateOne({ username: roomUser },
      { $push: { rooms: newRoom.id } })
  })

  // real-time socket io conection
  newRoom.users.forEach((roomUser) => {
    if (connectedUsers.get(roomUser) !== undefined) {
      const userID = connectedUsers.get(roomUser)
      const userSocket = io.sockets.sockets.get(userID)
      const tmpRoomName = convertNameForPM(newRoom, roomUser)

      userSocket.join(tmpRoomName.id)
      io.to(userSocket.id).emit('Room:New', tmpRoomName)
    }
  })

  socket.emit('Room:Create:Return', 'Room created')
}

exports.getRooms = async (req, res) => {
  const userRooms = await userModel.findOne({ username: req.username }, 'rooms')

  const rooms = await RoomModel.find({ id: userRooms }).lean()
  for (const room of rooms) {
    room.id = room._id
    convertNameForPM(room, req.username)

    // get the last message
    if (room.lastMessage !== undefined) {
      const query = await userMsg.findById(room.lastMessage, 'message')
      room.lastMessage = query.message
    }
    // get number of unread message
    room.unread = (
      await userMsg.find({ room: room.id, read: { $ne: req.username } })
    ).length
  }

  res.status(200).json({ rooms })
}

exports.getRoomsTab = async (username) => {
  const query = await userModel.findOne({ username }).select('rooms')
  return query.rooms
}

exports.updateLastMessage = async (roomID, msgID) => {
  await RoomModel.findByIdAndUpdate(
    roomID,
    { $set: { lastMessage: msgID } }
  )
}
