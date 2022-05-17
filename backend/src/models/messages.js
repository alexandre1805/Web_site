const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  }
});
const Messages = mongoose.model("Messages", MessagesSchema);
module.exports = Messages;
