/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
const app = require('../src/utils/app')
const request = require('supertest')
const mongoose = require('mongoose')
const RoomModel = require('../src/models/rooms')
const messageModel = require('../src/models/messages')
const helper = require('./lib/helper')
const MemoryDatabaseServer = require('./lib/MemoryDatabaseServer')

let server
const port = 4005
let roomID
let user1
let user2
let user3

beforeAll(async () => {
  await MemoryDatabaseServer.start()
  server = app()
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

describe('Game connection', () => {
  describe('/getGames', () => {
    test('/getGames regular', async () => {
      const response = await request(server).get('/getGames').expect(200)
      expect(response.body).toMatchObject({
        games: [
          { name: 'Tic-tac-toe', min_players: 2, max_players: 2 },
          { name: 'Connect 4', min_players: 2, max_players: 2 },
          { name: 'Le président', min_players: 3, max_players: 6 }
        ]
      })
    })
  })

  test('Game connection : message when connection', (done) => {
    user1.socket.on('Message:New', (args) => {
      expect(args).toMatchObject({
        type: 'game',
        room: roomID,
        message: user1.username + ' want to start a game : ',
        user: user1.username,
        game: 'Connect 4',
        state: 'Not started'
      })
      user1.socket.on('GameConnection:update', (args) => {
        expect(args.message).toMatch('Waiting for other player ... (1/2)')
        done()
      })
      user1.socket.emit('GameConnection:join',
        { id: args.game_id, username: user1.username })
    })
    user1.socket.emit('Message:newClient', {
      type: 'game',
      room: roomID,
      message: user1.username + ' want to start a game : ',
      user: user1.username,
      game: 'Connect 4',
      state: 'Not started'
    })
  })

  test('Game connection : game start', (done) => {
    user1.socket.on('Message:New', (args) => {
      expect(args).toMatchObject({
        type: 'game',
        room: roomID,
        message: user1.username + ' want to start a game : ',
        user: user1.username,
        game: 'Connect 4',
        state: 'Not started'
      })
      user1.socket.once('GameConnection:update', (arg) => {
        user2.socket.emit('GameConnection:join', {
          id: args.game_id,
          username: user2.username
        })
        user2.socket.on('Message:Update', (msg) => {
          expect(msg).toMatchObject({
            type: 'game',
            message: 'Game running ...',
            user: user1.username,
            room: roomID,
            game: 'Connect 4',
            state: 'Running',
            game_id: args.game_id
          })
          done()
        })
      })
      user1.socket.emit('GameConnection:join',
        { id: args.game_id, username: user1.username })
    })
    user1.socket.emit('Message:newClient', {
      type: 'game',
      room: roomID,
      message: user1.username + ' want to start a game : ',
      user: user1.username,
      game: 'Connect 4',
      state: 'Not started'
    })
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await server.close()
  await MemoryDatabaseServer.stop()
})
