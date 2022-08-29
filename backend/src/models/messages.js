const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
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
    read: [{ type: String }],
    game: { type: String },
    state: { type: String },
    game_id: { type: String },
  },
  { timestamps: true }
);
const Messages = mongoose.model("Messages", MessagesSchema);
module.exports = Messages;
