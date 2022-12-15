const cards = require('../utils/cards.json')
const helper = require('../utils/helper')

const games = new Map()

/**
 * @function distribute shuffle and distrubute cards to all players
 * @param {Array<String>} users Array containing the names of users
 * @returns {object} object that contains each properties per users that contains their cards
 */
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

/**
 * @param {Array} cards the concatantion of the current play and the previous one
 * @returns {boolean} return if the player make a square
 */
function checkSquare (cards) {
  let emptyStack = false
  if (cards.length === 4) {
    emptyStack = true
    for (let i = 1; i < cards.length; i++) {
      if (cards[i - 1].value !== cards[i].value) {
        emptyStack = false
      }
    }
  }
  return emptyStack
}

/**
 * @function create Create the object game, distribute card and send cards to players
 * @param {Object} io the instace of socket io
 * @param {String} id the id of the game
 * @param {Array<String>} users array of usernames of players
 * @param {Map<String, String>} connectedUsers contains a link between the username and the socket io id of users
 */
exports.create = function (io, id, users, connectedUsers) {
  const cards = distribute(users)

  // search the first player and define the order
  let currrentPlayer
  const order = []
  users.forEach((user) => {
    if (cards[user].find((e) => e.suite === 'hearts' && e.value === 'Q')) {
      currrentPlayer = user
    } else {
      order.push(user)
    }
  })
  order.unshift(currrentPlayer)

  const handLength = {}
  users.forEach(user => {
    handLength[user] = cards[user].length
  })

  const response = { currrentPlayer, handLength }
  users.forEach((user) => {
    response.cards = cards[user]
    const userID = connectedUsers.get(user)
    io.to(userID).emit('President:Create', response)
  })

  games.set(id, {
    playZoneCards: [],
    currrentPlayer,
    handLength,
    order,
    stack: []
  })
}
/**
 * @function cancel delete the game of map
 * @param {String} id the id of the game
 */
exports.cancel = function (id) {
  games.delete(id)
}

/**
 *
 * @param {object} request the data given by the player
 * @param {String} request.id the id of game
 * @param {object} request.cards the id of game
 */
exports.updateClient = async function (io, request) {
  const game = games.get(request.id)
  console.log(game)
  game.handLength[game.currrentPlayer] -= request.cards.length

  const emptyStack = checkSquare(game.stack.concat(request.cards))

  const nextPlayerIndex = game.order.indexOf(game.currrentPlayer) + 1
  game.currrentPlayer =
     nextPlayerIndex === game.order.length
       ? game.order[0]
       : game.order[nextPlayerIndex]

  const response = {
    stack: request.cards,
    currrentPlayer: game.currrentPlayer,
    handLength: game.handLength,
    emptyStack
  }

  games.set(request.id, game)
  io.to(request.id).emit('President:Update', response)
}
