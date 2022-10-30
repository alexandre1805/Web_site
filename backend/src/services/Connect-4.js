const gameConnection = require('./Games-Connection')
const games = new Map()

exports.create = function (io, id, users) {
  const game = {}
  game.board = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '']
  ]
  game[users[0]] = 'R'
  game[users[1]] = 'Y'
  game.current_player = users[Math.floor(Math.random() * 2)]
  game.winner = null

  games.set(id, game)
  io.to(id).emit('Connect-4 update', game)
}

exports.update = async function (io, id, game) {
  games.set(id, game)
  io.to(id).emit('Connect-4 update', game)
  if (game.winner !== null) {
    if (game.winner === undefined) await gameConnection.finish(io, id, 'Draw')
    else {
      let winner
      for (const [key, value] of Object.entries(game)) { if (key !== 'winner' && value === game.winner) winner = key }

      await gameConnection.finish(io, id, 'The winner is ' + winner)
    }
  }
}
