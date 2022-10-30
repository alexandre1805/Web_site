const gameConnection = require('../services/Games-Connection')
const router = require('express').Router()

// ============================== GET GAMES ====================================
router.get('/getGames', async (req, res) => {
  await gameConnection.getGames(req, res)
})

exports.router = router

exports.socketIO = function (io, socket, _users) {
  // =========================== JOIN GAME ===================================
  const checkJoinGame = (args) => {
    if (args.id === '' || args.id === undefined) return false
    if (args.username === '' || args.username === undefined) return false
    return true
  }

  socket.on('join', async (args) => {
    if (!checkJoinGame(args)) return
    socket.join(args.id)
    await gameConnection.join(io, args)
  })

  // =========================== LEAVE GAME ===================================
  const checkLeaveGame = (args) => {
    if (args.id === '' || args.id === undefined) return false
    if (args.username === '' || args.username === undefined) return false
    return true
  }

  socket.on('leave', async (args) => {
    if (!checkLeaveGame(args)) return
    socket.leave(args.id)
    await gameConnection.leave(io, args)
  })
}
