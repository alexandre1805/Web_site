const userData = require('../controllers/User-Data')
const room = require('../controllers/Room')
const message = require('../controllers/Message')
const gameConnection = require('../controllers/Game-Connection')
const connect4 = require('../controllers/Connect-4')
const ticTacToe = require('../controllers/Tic-Tac-Toe')
const president = require('../controllers/President')

const roomService = require('../services/Room')
const gameConnectionService = require('../services/Games-Connection')

let io

exports.initIO = function (server) {
  io = require('socket.io')(server)

  function onConnection (socket, users) {
    userData.socketIO(io, socket, users)
    room.socketIO(io, socket, users)
    message.socketIO(io, socket, users)
    gameConnection.socketIO(io, socket, users)
    ticTacToe.socketIO(io, socket, users)
    connect4.socketIO(io, socket, users)
    president.socketIO(io, socket, users)
  }

  const users = new Map()
  io.on('connection', async (socket) => {
    // ==================== SOCKET INITIALISATION ============================
    const rooms = await roomService.getRoomsTab(socket.handshake.query.username)
    rooms.forEach(async (element) => {
      await socket.join(element)
    })
    users.set(socket.handshake.query.username, socket.id)
    // =======================================================================

    onConnection(socket, users)

    // ==================== SOCKET DECONNECTION ==============================
    socket.on('disconnecting', async () => {
      // leave if the user is in game
      Array.from(socket.rooms).map(async (elm) => {
        if (elm.startsWith('game-')) {
          await gameConnectionService.leave(io, {
            id: elm,
            username: socket.handshake.query.username
          })
        }
      })
      users.delete(socket.handshake.query.username)
    })
    // =======================================================================
  })
}
