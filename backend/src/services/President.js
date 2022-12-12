const cards = require('../utils/cards.json')
const helper = require('../utils/helper')

function distribute (users) {
  const userCards = {}
  users.forEach((user) => {
    userCards[user] = []
  })

  const gameCards = helper.shuffle(cards)

  let i = 0
  gameCards.forEach((card) => {
    userCards[users[i]].push(card)
    i++
    if (i === users.length) {
      i = 0
    }
  })

  users.forEach((user) => {
    userCards[user] = helper.cards_sort(userCards[user])
  })

  return userCards
}

exports.create = function (io, _id, users, connectedUsers) {
  const cards = distribute(users)

  // search the first player
  let currrentPlayer
  users.forEach(user => {
    if (cards[user].find((e) => e.suite === 'hearts' && e.value === 'Q')) {
      currrentPlayer = user
    }
  })
  const game = { playZoneCards: [], currrentPlayer }
  users.forEach(user => {
    game.cards = cards[user]
    const userID = connectedUsers.get(user)
    io.to(userID).emit('President:Create', game)
  })
}
