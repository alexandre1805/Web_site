const GameModel = require('../models/games')
const messageService = require('./Message')
const Tictactoe = require('./Tic-tac-toe')
const Connect4 = require('./Connect-4')
const President = require('./President')
const userMsg = require('./Message')
const gameInfo = [
  { name: 'Tic-tac-toe', min_players: 2, max_players: 2 },
  { name: 'Connect 4', min_players: 2, max_players: 2 },
  { name: 'Le président', min_players: 3, max_players: 6 }
]

/**
 * GameConnection:update response :
 * param {string} state
 * param {string} message
 */

function convertID (id) {
  return id.split('-')[1]
}

exports.getGames = async function (_req, res) {
  res.status(200).json({ games: gameInfo })
}

exports.checkRunningGame = async function (roomID) {
  const response = await GameModel.find({
    room: roomID,
    state: { $nin: ['Finished', 'Cancelled'] }
  })

  return response.length
}
/**
 * @function create a game and save it in db
 * @param {object} request data send by client
 * @param {string} request.game the name of the game
 * @param {string} request.state the state of the game, here 'Not started'
 * @param {string} request.room the id of the room
 * @returns {string} the id of the game created
 */
exports.createGame = async function (request) {
  const curGameInfo = gameInfo.find((val) => val.name === request.game)
  const newGame = new GameModel({
    name: request.game,
    state: request.state,
    room: request.room,
    nb_players: 0,
    min_players: curGameInfo.min_players,
    max_players: curGameInfo.max_players
  })

  const id = await newGame.save().then((obj) => {
    return obj._id
  })
  return 'game-' + id
}

/**
 * @function handle join request of a player
 * @param {object} args arguements given by the request
 * @param {string} args.id the id of the game
 * @param {string} args.username the player
 * @param {object} io the instance of websocket
 * @param {Map} connectedUsers contains links between users and their socketIO ids
 */
exports.join = async function (io, args, connectedUsers) {
  let game = await GameModel.findById(convertID(args.id))

  if (game.state !== 'Running') {
    game = await GameModel.findByIdAndUpdate(
      convertID(args.id),
      {
        $push: { players: args.username },
        $inc: { nb_players: 1 },
        $set: {
          state:
            game.nb_players + 1 >= game.min_players ? 'Ready' : 'Not started'
        }
      },
      { new: true }
    )

    if (game.nb_players === game.max_players) {
      handleStartGame(io, args.id, connectedUsers)
    } else {
      io.to(args.id).emit('GameConnection:update', {
        state: game.state,
        message:
          // eslint-disable-next-line max-len
          `Waiting for other player ... (${game.nb_players}/${game.max_players})`
      })
    }
  } else {
    console.error('Someone try to join but the game started')
  }
}

/**
 * @function handle leave request of a player
 * @param {object} args arguements given by the request
 * @param {string} args.id the id of the game
 * @param {string} args.username the player
 * @param {object} io the instance of websocket
 */
exports.leave = async function (io, args) {
  let game = await GameModel.findById(convertID(args.id))
  if (game.state === 'Not started' || game.state === 'Ready') {
    game = await GameModel.findByIdAndUpdate(
      convertID(args.id),
      {
        $pull: { players: args.username },
        $inc: { nb_players: -1 },
        $set: {
          state:
            game.nb_players - 1 >= game.min_players ? 'Ready' : 'Not started'
        }
      },
      { new: true }
    )
    io.to(args.id).emit('GameConnection:update', {
      state: game.state,
      message:
        // eslint-disable-next-line max-len
        `Waiting for other player ... (${game.nb_players}/${game.max_players})`
    })
  } else if (game.state === 'Running') {
    await handleCancelGame(io, args)
  }
}

exports.finish = async function (io, id, msg) {
  await GameModel.updateOne(
    { _id: convertID(id) },
    { $set: { state: 'Finished' } }
  )

  await userMsg.updateGameMsg(io, id, msg)

  io.to(id).emit('GameConnection:update', { state: 'Finished', message: msg })
}

/**
 * @function handleStartGame handle the start of the game, create it and update status
 * for all players
 * @param {object} io the websocket instance
 * @param {string} gameID the id of the game
 * @param {Map} connectedUsers contains links between users and their socketIO ids
 */
async function handleStartGame (io, gameID, connectedUsers) {
  const game = await GameModel.findByIdAndUpdate(
    convertID(gameID),
    { $set: { state: 'Running' } },
    { new: true }
  )

  if (game.name === 'Tic-tac-toe') Tictactoe.create(io, gameID, game.players)
  else if (game.name === 'Connect 4') Connect4.create(io, gameID, game.players)
  else President.create(io, gameID, game.players, connectedUsers)

  io.to(gameID).emit('GameConnection:update', { state: 'Running', message: '' })

  await userMsg.updateGameMsg(io, gameID, 'Running')
}

/**
 * @function send message to all player to inform that the game is cancelled,
 * update the database and update the message of the game
 * @param {object} params the parameters gived by the socket
 * @param {string} params.id the id of the game
 * @param {string} params.username the name of the player who left the game
 * @param {object} io  the instance of websocket
 */
async function handleCancelGame (io, params) {
  const game = await GameModel.findByIdAndUpdate(convertID(params.id), {
    $set: { state: 'Cancelled' }
  })
  io.to(params.id).emit('GameConnection:update', {
    state: 'Cancelled',
    message: 'Someone has been disconnected, game cancelled'
  })
  if (game.name === 'Le président') {
    President.cancel(params.id)
  }
  await userMsg.updateGameMsg(io, params.id, 'Cancelled')
}

/**
 * @function function triggered by "GameConnection:start"
 * @param {object} io the websocket instance
 * @param {string} id the id of the game
 * @param {Map} connectedUsers contains links between users and their socketIO ids
 */
exports.start = async (io, id, connectedUsers) => {
  const game = await GameModel.findById(convertID(id))
  if (game.state !== 'Ready') return
  handleStartGame(io, id, connectedUsers)
}

/**
 *
 * @param {object} io the instance of socket IO
 * @param {Map} connectedUsers link between users and their socket ID
 * @param {object} request the request
 * @param {string} request.id the id of the game finished
 * @param {string} request.username the name of the player who trigger the request
 */
exports.restart = async (io, connectedUsers, request) => {
  const gameFinished = await GameModel.findById(convertID(request.id))

  // create the game
  const createArgs = {
    game: gameFinished.name,
    state: 'Not started',
    room: gameFinished.room
  }
  const newGameID = this.createGame(createArgs)

  // switch player to the new game
  gameFinished.players.forEach((player) => {
    const socket = io.sockets.sockets.get(connectedUsers.get(player))
    if (socket.rooms.indexOf(request.id) >= 0) {
      socket.leave(request.id)
      this.leave(io, { id: request.id, username: player })
      socket.join(newGameID)
      this.leave(io, { id: newGameID, username: player })
    }
  })

  // create the message for users
  const messageArgs = {
    user: request.username,
    type: 'game',
    message: `${request.username} wants to start a new game`,
    room: gameFinished.room,
    game: gameFinished.name,
    state: 'Not started',
    game_id: newGameID
  }

  await messageService.createAutomaticMessage(messageArgs, io)
}
