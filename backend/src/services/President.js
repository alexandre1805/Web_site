const cards = require('../utils/cards.json')
const helper = require('../utils/helper')
const gameConnection = require('./Games-Connection')

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
  if (cards.length >= 4) {
    emptyStack = true
    for (let i = 1; i < cards.length; i++) {
      if (cards[i - 1].value !== cards[i].value) {
        emptyStack = false
      }
    }
  }
  return emptyStack
}
exports.checkSquare = checkSquare

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
  users.forEach((user) => {
    handLength[user] = cards[user].length
  })

  const response = { currrentPlayer, handLength }
  users.forEach((user) => {
    response.cards = cards[user]
    const userID = connectedUsers.get(user)
    io.to(userID).emit('President:Create', response)
  })

  games.set(id, {
    currrentPlayer,
    handLength,
    order,
    stack: [],
    pass: Array(order.length).fill(false)
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
  game.handLength[game.currrentPlayer] -= request.cards.length

  // check if the player win
  if (game.handLength[game.currrentPlayer] === 0) {
    await gameConnection.finish(
      io,
      request.id,
      `The winner is ${game.currrentPlayer}.`
    )
  }

  let emptyStack = false
  let allPass = false
  if (request.cards.length === 0) {
    game.pass[game.order.indexOf(game.currrentPlayer)] = true
    if (game.pass.every((element) => element === true)) {
      emptyStack = true
      allPass = true
      game.pass = Array(game.order.length).fill(false)
    }
  } else {
    game.pass[game.order.indexOf(game.currrentPlayer)] = false
    // check if the player uses a '2' or made a square
    game.stack = game.stack.concat(request.cards)
    emptyStack =
      request.cards.length !== 0 && request.cards[0].value === '2'
        ? true
        : checkSquare(game.stack)
  }

  // check who will play the next turn
  if (allPass || !emptyStack) {
    const nextPlayerIndex = game.order.indexOf(game.currrentPlayer) + 1
    game.currrentPlayer =
      nextPlayerIndex === game.order.length
        ? game.order[0]
        : game.order[nextPlayerIndex]
  }

  // build the answer
  const response = {
    cardsPlayed: game.stack,
    currrentPlayer: game.currrentPlayer,
    handLength: game.handLength,
    emptyStack,
    nbCards: emptyStack ? 0 : request.cards.length
  }

  io.to(request.id).emit('President:Update', response)
  if (emptyStack) game.stack = []
  games.set(request.id, game)
}
