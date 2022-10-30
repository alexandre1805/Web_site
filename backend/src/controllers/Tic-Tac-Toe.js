const ticTacToe = require('../services/Tic-tac-toe')

exports.socketIO = function (io, socket, _users) {
  // =========================== UPDATE GAME ===================================
  socket.on('Tic-tac-toe update-client', async (args) => {
    await ticTacToe.update(io, args.id, args.game)
  })
}
