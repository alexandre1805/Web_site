const mongoose = require('mongoose')

const GamesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    },
    players: [{ type: String }],
    nb_players: { type: Number, required: true },
    max_players: { type: Number, required: true }
  },
  {
    timestamps: true
  }
)

const Games = mongoose.model('Games', GamesSchema)
module.exports = Games
