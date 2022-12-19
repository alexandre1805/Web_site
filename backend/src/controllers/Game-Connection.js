const gameConnection = require('../services/Games-Connection')
const router = require('express').Router()

// ============================== GET GAMES ====================================
router.get('/getGames', async (req, res) => {
  await gameConnection.getGames(req, res)
})

exports.router = router

exports.socketIO = function (io, socket, users) {
  // =========================== JOIN GAME =====================================
  const checkJoinGame = (args) => {
    if (args.id === '' || args.id === undefined) return false
    if (args.username === '' || args.username === undefined) return false
    return true
  }

  socket.on('GameConnection:join', async (args) => {
    if (!checkJoinGame(args)) return
    socket.join(args.id)
    await gameConnection.join(io, args, users)
  })

  // =========================== LEAVE GAME ====================================
  const checkLeaveGame = (args) => {
    if (args.id === '' || args.id === undefined) return false
    if (args.username === '' || args.username === undefined) return false
    return true
  }

  socket.on('GameConnection:leave', async (args) => {
    if (!checkLeaveGame(args)) return
    socket.leave(args.id)
    await gameConnection.leave(io, args)
  })

  // =========================== START GAME ====================================
  const checkStartGame = (id) => {
    if (id === '' || id === undefined) return false
    return true
  }

  socket.on('GameConnection:start', async (id) => {
    if (!checkStartGame(id)) return
    await gameConnection.start(io, id, users)
  })

  // =========================== RESTART GAME ==================================
  const checkRestartGame = (request) => {
    if (request.id === '' || request.id === undefined) return false
    if (request.username === '' || request.username === undefined) return false
    return true
  }

  socket.on('GameConnection:start', async (request) => {
    if (!checkRestartGame(request)) return
    await gameConnection.start(io, users, request)
  })
}
