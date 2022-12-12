const cards = require('../utils/cards.json')
const helper = require('../utils/helper')

function distribute (game, users) {
  const gameCards = helper.shuffle(cards)
  let i = 0
  gameCards.forEach(card => {
    game[users[i]].cards.push(card)
    i++
    if (i === users.length) { i = 0 }
  })

  users.forEach(user => {
    game[user].cards = helper.cards_sort(game[user].cards)
  })
}

exports.create = function (io, id, users) {
  const game = {}
  // create the user
  users.forEach(user => {
    game[user] = {}
    game[user].cards = []
  })

  distribute(game, users)

  game.currentPlayer = users[Math.floor(Math.random() * users.length)]
  game.playZoneCards = []

  io.to(id).emit('President:Update', game)
}
