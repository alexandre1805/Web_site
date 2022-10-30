const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: false
  }
})
const Notification = mongoose.model('Notification', NotificationSchema)
module.exports = Notification
