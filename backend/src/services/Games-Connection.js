const GameModel = require('../models/games')
const Tictactoe = require('./Tic-tac-toe')
const Connect4 = require('./Connect-4')
const userMsg = require('./Message')
const gameInfo = [
  { name: 'Tic-tac-toe', max_players: 2 },
  { name: 'Connect 4', max_players: 2 }
]

function convertID (id) {
  return id.split('-')[1]
}

exports.getGames = async function (_req, res) {
  res.status(200).json({ games: gameInfo })
}

exports.createGame = async function (args) {
  const curGameInfo = gameInfo.find((val) => val.name === args.game)
  const newGame = new GameModel({
    name: args.game,
    state: args.state,
    room: args.room,
    nb_players: 0,
    max_players: curGameInfo.max_players
  })

  const id = await newGame.save().then((obj) => {
    return obj._id
  })
  return 'game-' + id
}

exports.join = async function (io, args) {
  await GameModel.updateOne(
    { _id: convertID(args.id) },
    { $push: { players: args.username }, $inc: { nb_players: 1 } }
  )
  await update(io, args.id, 'join')
}

exports.leave = async function (io, args) {
  await GameModel.updateOne(
    { _id: convertID(args.id) },
    { $pull: { players: args.username }, $inc: { nb_players: -1 } }
  )
  await update(io, args.id, 'leave')
}

/* Update : send update of connection to the user :
 * - if the game is finshed, do not need to send any update
 * - update database when joining game and send message to all connected users
 * - handle when user disconnected in game
 */
async function update (io, id, type) {
  const game = await GameModel.findById(convertID(id))

  if (game.state === 'Finished') return
  let msg = ''
  if (
    game.state === 'Not started' &&
    type === 'join' &&
    game.nb_players === game.max_players
  ) {
    await GameModel.updateOne(
      { _id: convertID(id) },
      { $set: { state: 'Running' } }
    )
    await userMsg.updateGameMsg(io, id, 'Running')
    if (game.name === 'Tic-tac-toe') Tictactoe.create(io, id, game.players)
    else Connect4.create(io, id, game.players)
  } else if (game.state === 'Not started') {
    msg =
      'Waiting for other player ... (' +
      game.nb_players +
      '/' +
      game.max_players +
      ')'
  } else if (game.state === 'Running' && type === 'join') { console.error('[' + game.id + ']: ERROR: player joins running game') } else if (game.state === 'Running' && type === 'leave') {
    await GameModel.updateOne(
      { _id: convertID(id) },
      { $set: { state: 'Cancelled' } }
    )
    msg = 'Someone has been disconnected, game cancelled'
    await userMsg.updateGameMsg(io, id, 'Cancelled')
  } else if (game.state === 'Cancelled') return
  io.to(id).emit('Status update', msg)
}

exports.finish = async function (io, id, msg) {
  await GameModel.updateOne(
    { _id: convertID(id) },
    { $set: { state: 'Finished' } }
  )

  await userMsg.updateGameMsg(io, id, msg)

  io.to(id).emit('Status update', msg)
}
