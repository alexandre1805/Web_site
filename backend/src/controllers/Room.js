const helper = require('../utils/helper')
const room = require('../services/Room')
const router = require('express').Router()

// ============================== GET ROOMS ====================================

router.get('/getRooms', async (req, res) => {
  req.username = helper.checkToken(req, res)
  if (req.username === undefined) return
  await room.getRooms(req, res)
})

exports.router = router

exports.socketIO = function (io, socket, users) {
  const checkCreateRoom = (args) => {
    if (args === '' || args === undefined) return false
    return true
  }

  // =========================== Room:create ===================================
  socket.on('Room:create', async (arg) => {
    if (!checkCreateRoom(arg)) return
    await room.createRoom(io, socket, users, arg)
  })
}
