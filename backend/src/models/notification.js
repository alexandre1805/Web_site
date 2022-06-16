const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
