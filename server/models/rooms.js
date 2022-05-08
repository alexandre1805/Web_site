const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: [
    {
      type: String,
    },
  ],
});
const Messages = mongoose.model("Messages", MessagesSchema);
module.exports = Messages;
