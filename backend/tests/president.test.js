/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
const app = require('../src/utils/app')
const mongoose = require('mongoose')
const RoomModel = require('../src/models/rooms')
const messageModel = require('../src/models/messages')
const helper = require('./lib/helper')
const MemoryDatabaseServer = require('./lib/MemoryDatabaseServer')
const { checkSquare } = require('../src/services/President')

let server
const port = 4006
let roomID
let user1
let user2
let user3

beforeAll(async () => {
  await MemoryDatabaseServer.start()
  server = app()
  mongoose.set('strictQuery', true)
  await mongoose.connect(MemoryDatabaseServer.getConnectionString())
  server.listen(port)

  user1 = { username: 'test1', email: 'test1@gmail.com', password: 'toto' }
  user2 = { username: 'test2', email: 'test2@gmail.com', password: 'toto' }
  user3 = { username: 'test3', email: 'test3@gmail.com', password: 'toto' }
})

beforeEach(async () => {
  const room = new RoomModel({
    type: 'group',
    name: user1.username + ', ' + user2.username + ', ' + user3.username,
    users: [user1.username, user2.username, user3.username]
  })
  roomID = await room.save().then((obj) => {
    return obj.id
  })
  user1 = await helper.createUser(
    server,
    port,
    user1,
    true,
    [user2.username, user3.usernames],
    [roomID]
  )
  user2 = await helper.createUser(
    server,
    port,
    user2,
    true,
    [user1.username, user3.usernames],
    [roomID]
  )
  user3 = await helper.createUser(
    server,
    port,
    user3,
    true,
    [user2.username, user1.usernames],
    [roomID]
  )
})

afterEach(async () => {
  await helper.deleteUser(user1, true)
  await helper.deleteUser(user2, true)
  await helper.deleteUser(user3, true)
  await RoomModel.deleteMany({})
  await messageModel.deleteMany({})
})

describe('The President', () => {
  describe('End-to-end tests', () => {
    test('Game start', (done) => {
      user1.socket.once('Message:New', (args) => {
        expect(args).toMatchObject({
          type: 'game',
          room: roomID,
          message: user1.username + ' want to start a game : ',
          user: user1.username,
          game: 'Le président',
          state: 'Not started'
        })
        user1.socket.once('GameConnection:update', (_arg) => {
          user2.socket.once('GameConnection:update', (_msg) => {
            user3.socket.once('GameConnection:update', (msg) => {
              expect(msg).toMatchObject({
                state: 'Ready',
                message: 'Waiting for other player ... (3/6)'
              })
              user2.socket.once('President:Create', (obj) => {
                expect(obj).toHaveProperty('cards')
                expect(obj).toHaveProperty('currrentPlayer')
                expect(obj).toHaveProperty('handLength')
                let totalCards = 0
                for (const [, value] of Object.entries(obj.handLength)) {
                  totalCards += value
                }
                expect(totalCards).toBe(52)
                done()
              })
              user1.socket.emit('GameConnection:start', args.game_id)
            })
            user3.socket.emit('GameConnection:join', {
              id: args.game_id,
              username: user3.username
            })
          })

          user2.socket.emit('GameConnection:join', {
            id: args.game_id,
            username: user2.username
          })
        })
        user1.socket.emit('GameConnection:join', {
          id: args.game_id,
          username: user1.username
        })
      })
      user1.socket.emit('Message:newClient', {
        type: 'game',
        room: roomID,
        message: user1.username + ' want to start a game : ',
        user: user1.username,
        game: 'Le président',
        state: 'Not started'
      })
    })

    test('First move', (done) => {
      user1.socket.once('Message:New', (args) => {
        user1.socket.once('GameConnection:update', (_arg) => {
          user2.socket.once('GameConnection:update', (_msg) => {
            user3.socket.once('GameConnection:update', (_msg) => {
              const users = [user1, user2, user3]
              users.forEach((user) => {
                user.socket.once('President:Create', (obj) => {
                  if (obj.currrentPlayer === user.username) {
                    user.socket.once('President:Update', (data) => {
                      expect(data.cardsPlayed).toMatchObject([obj.cards[0]])
                      expect(data.emptyStack).toBe(false)
                      expect(data).toHaveProperty('currrentPlayer')
                      expect(data).toHaveProperty('handLength')
                      done()
                    })
                    user.socket.emit('President:UpdateClient', {
                      id: args.game_id,
                      cards: [obj.cards[0]]
                    })
                  }
                })
              })
              user1.socket.emit('GameConnection:start', args.game_id)
            })
            user3.socket.emit('GameConnection:join', {
              id: args.game_id,
              username: user3.username
            })
          })
          user2.socket.emit('GameConnection:join', {
            id: args.game_id,
            username: user2.username
          })
        })
        user1.socket.emit('GameConnection:join', {
          id: args.game_id,
          username: user1.username
        })
      })
      user1.socket.emit('Message:newClient', {
        type: 'game',
        room: roomID,
        message: user1.username + ' want to start a game : ',
        user: user1.username,
        game: 'Le président',
        state: 'Not started'
      })
    })
  })
  describe('CheckSquare', () => {
    test('isSquare', () => {
      const cards = [{
        suite: 'clubs',
        value: '2',
        file: '2_of_hearts.png'
      },
      {
        suite: 'diamonds',
        value: '2',
        file: '2_of_hearts.png'
      },
      {
        suite: 'spades',
        value: '2',
        file: '2_of_hearts.png'
      },
      {
        suite: 'hearts',
        value: '2',
        file: '2_of_hearts.png'
      }]
      expect(checkSquare(cards)).toBe(true)
    })
    test('isSquare', () => {
      const cards = [{
        suite: 'clubs',
        value: '3',
        file: '2_of_hearts.png'
      },
      {
        suite: 'diamonds',
        value: '2',
        file: '2_of_hearts.png'
      },
      {
        suite: 'spades',
        value: '2',
        file: '2_of_hearts.png'
      },
      {
        suite: 'hearts',
        value: '2',
        file: '2_of_hearts.png'
      }]
      expect(checkSquare(cards)).toBe(false)
    })
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await server.close()
  await MemoryDatabaseServer.stop()
})
