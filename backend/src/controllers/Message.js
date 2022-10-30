const helper = require('../utils/helper')
const message = require('../services/Message')
const router = require('express').Router()

// ============================ GET MESSAGES ===================================

router.get('/getMsg', async (req, res) => {
  req.username = helper.checkToken(req, res)
  if (req.username === undefined) return
  await message.getMessages(req, res)
})

exports.router = router

exports.socketIO = function (io, socket, _users) {
  // ======================== SEND MESSAGE =====================================
  socket.on('message', async (args) => {
    const obj = await message.handleMsg(socket, args)
    if (obj !== null) io.to(args.room).emit('new message', obj)
  })

  // ======================= READ MESSAGE ======================================
  socket.on('read', (args) => {
    message.handleRead(args)
  })
}
