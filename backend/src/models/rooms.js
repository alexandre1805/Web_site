const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: {
    type: String,
    required: true,
  },
  users: [
    {
      type: String,
    },
  ],
  lastMessage: { type: String },
});
const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;
