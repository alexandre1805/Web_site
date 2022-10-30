const userModel = require('../models/users')
const NotificationModel = require('../models/notification')

exports.getFriends = async function (req, res) {
  const user = await userModel.findOne({ username: req.username })

  const friends = await userModel.find(
    { username: { $in: user.friends } },
    'id username'
  )

  res.status(200).json({ friends })
}

exports.getNotif = async function (req, res) {
  const notifs = await NotificationModel
    .find({ username: req.username })
    .lean()
  notifs.forEach((elt) => {
    elt.id = elt._id
    delete elt._id
  })
  res.status(200).json(notifs)
}

exports.addFriend = async (socket, friend) => {
  const dbUser = await userModel.findOne({
    username: socket.handshake.query.username
  })

  if (dbUser.friends.includes(friend)) {
    socket.emit('add Friend return', friend + ' is already your friend.')
    return
  }

  const dbFriend = await userModel.findOne({ username: friend })
  if (dbFriend === null) {
    socket.emit('add Friend return', 'The user does not exist')
    return
  }

  const newNotification = new NotificationModel({
    type: 'add_friend',
    username: dbFriend.username,
    from: dbUser.username,
    message: dbUser.username + ' wants to add you as friend !'
  })

  await newNotification.save()

  socket.emit('add Friend return', 'Invitation sended.')
  return newNotification
}

exports.acceptInvation = async (args) => {
  await userModel.updateOne(
    { username: args.username },
    { $push: { friends: args.from } }
  )
  await userModel.updateOne(
    { username: args.from },
    { $push: { friends: args.username } }
  )

  await NotificationModel.deleteOne({ id: args.id })
}

exports.deleteNotifications = async (id) => {
  await NotificationModel.deleteOne({ id })
}
