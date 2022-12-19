const MessagesModel = require('../models/messages')
const gameService = require('./Games-Connection')
const roomService = require('./Room')

exports.handleMsg = async function (socket, args) {
  if (args.type === 'game' && gameService.checkRunningGame(args.room) >= 2) {
    socket.emit(
      'Message:Error',
      'Two games are already running, please wait...'
    )
    return
  }

  if (args.type === 'game') {
    args.game_id = await gameService.createGame(args)
  }

  const newMessage = new MessagesModel(args)
  newMessage.id = await newMessage.save().then((obj) => {
    return obj.id
  })

  await roomService.updateLastMessage(newMessage.room, newMessage.id)

  return newMessage
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
    { game_id: gameID },
    { message, state },
    { new: true }
  )

  io.to(gameID).emit('Message:Update', msg)
}

/**
 *
 * @param {object} data the data used to create the message
 * @param {string} data.author the author of the message
 * @param {string} data.type the type of message (regular|game)
 * @param {string} data.message the message itself
 * @param {string}  [data.game] the name of the game
 * @param {string}  [data.state] the state of the game
 * @param {string}  [data.game_id] the id of the game
 */
exports.createAutomaticMessage = async function (data) {
  const newMessage = new MessagesModel(data)
  newMessage.id = await newMessage.save().then((obj) => {
    return obj.id
  })

  await roomService.updateLastMessage(newMessage.room, newMessage.id)
}
