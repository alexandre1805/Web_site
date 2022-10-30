const MessagesModel = require('../models/messages')
const gamesModel = require('../models/games')
const roomModel = require('../models/rooms')
const games = require('./Games-Connection')

async function handleMsgGame (socket, args) {
  const response = await gamesModel.find({
    room: args.room,
    state: { $nin: ['Finished', 'Cancelled'] }
  })
  if (response !== null && response.length >= 2) {
    socket.emit(
      'error message',
      'Two games are already running, please wait...'
    )
    return false
  }
  args.game_id = await games.createGame(args)
  return true
}

exports.handleMsg = async function (socket, args) {
  // check if already two games exists
  if (args.type === 'game' && !(await handleMsgGame(socket, args))) return null

  const newMessage = new MessagesModel(args)
  args.id = await newMessage.save().then((obj) => {
    return obj.id
  })
  roomModel.findByIdAndUpdate(
    args.room,
    { $set: { lastMessage: args.id } },
    (err, _doc) => {
      if (err) {
        console.log(err)
      }
    }
  )

  args.read = []
  return args
}

exports.handleRead = async function (args) {
  await MessagesModel.updateMany(
    {
      room: args.room,
      read: { $nin: args.username }
    },
    { $push: { read: args.username } }
  )
}

exports.getMessages = async function (req, res) {
  const messages = await MessagesModel.find({ room: req.query.room })
  res.status(200).json({ messages })
}

exports.updateGameMsg = async function (io, gameID, state) {
  let message
  if (state === 'Running') message = 'Game running ...'
  else if (state === 'Cancelled') message = 'Game cancelled'
  else message = state

  const msg = await MessagesModel.findOneAndUpdate(
    { gameID },
    { message, state },
    { new: true }
  )

  io.to(gameID).emit('update message', msg)
}
