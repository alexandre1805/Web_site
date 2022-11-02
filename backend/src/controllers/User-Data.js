const helper = require('../utils/helper')
const userData = require('../services/User-Data')
const router = require('express').Router()

// ============================== GET FRIEND ===================================

router.get('/getFriends', async (req, res) => {
  req.username = helper.checkToken(req, res)
  if (req.username === undefined) return

  await userData.getFriends(req, res)
})

// ============================= GET NOTIFICATIONS =============================

router.get('/getNotifs', async (req, res) => {
  req.username = helper.checkToken(req, res)
  if (req.username === undefined) return

  await userData.getNotif(req, res)
})

exports.router = router

exports.socketIO = function (io, socket, users) {
  // ======================== ADD FRIEND =======================================
  const checkAddFriend = (socket, friend) => {
    if (friend === '' || friend === undefined) {
      socket.emit('add Friend return', 'You must specify a friend.')
      return false
    }
    return true
  }
  socket.on('add Friend', async (friendName) => {
    if (!checkAddFriend(socket, friendName)) return
    const newNotif = await userData.addFriend(socket, friendName)

    // send invitation to user
    const friend = users.get(friendName)
    io.to(friend).emit('notification', newNotif)
  })

  // ====================== ACCEPT INVITATION ==================================
  const checkAcceptInvitation = (args) => {
    if (args.username === '' || args.username === undefined) return false
    if (args._id === '' || args._id === undefined) return false
    if (args.from === '' || args.from === undefined) return false

    return true
  }

  socket.on('accept invitation', async (args) => {
    if (!checkAcceptInvitation(args)) return
    await userData.acceptInvation(args)
  })

  // ===================== DELETE NOTIFICATIONS ================================
  const checkDeleteNotifications = (id) => {
    if (id === '' || id === undefined) return false
    return true
  }

  socket.on('delete notification', async (id) => {
    if (!checkDeleteNotifications(id)) return
    await userData.deleteNotifications(id)
  })
}
