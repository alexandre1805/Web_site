const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
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
  },
  game: { type: String },
  state: { type: String },
});
const Messages = mongoose.model("Messages", MessagesSchema);
module.exports = Messages;
