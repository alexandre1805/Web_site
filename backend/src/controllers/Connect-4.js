const Connect4 = require('../services/Connect-4')

exports.socketIO = function (io, socket, _users) {
  // =========================== UPDATE GAME ===================================
  socket.on('Connect-4:UpdateClient', async (args) => {
    await Connect4.update(io, args.id, args.game)
  })
}
