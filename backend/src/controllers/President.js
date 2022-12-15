const President = require('../services/President')

exports.socketIO = function (io, socket, _users) {
  // =========================== UPDATE GAME ===================================
  socket.on('President:UpdateClient', async (data) => {
    President.updateClient(io, data)
  })
}
