const President = require('../services/President')

exports.socketIO = function (io, socket, _users) {
  // =========================== UPDATE GAME ===================================
  socket.on('President:UpdateClient', async (data) => {
    await President.updateClient(io, data)
  })
}
