/* eslint-disable no-undef */
const app = require('../src/utils/app')
const request = require('supertest')
const mongoose = require('mongoose')
const RoomModel = require('../src/models/rooms')
const messageModel = require('../src/models/messages')
const helper = require('./lib/helper')
const MemoryDatabaseServer = require('./lib/MemoryDatabaseServer')

let server
const port = 4004
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

describe('User Msg', () => {
  describe('Real-time Msg', () => {
    describe('Regular', () => {
      test('Regular message when user1 connected', (done) => {
        user1.socket.on('Message:New', (args) => {
          expect(args).toMatchObject({
            message: 'test',
            read: [],
            type: 'regular',
            user: user1.username
          })
          done()
        })
        user1.socket.emit('Message:newClient', {
          type: 'regular',
          room: roomID,
          message: 'test',
          user: user1.username
        })
      })

      test('Regular message when user2 connected', (done) => {
        user2.socket.on('Message:New', (args) => {
          expect(args).toMatchObject({
            message: 'test',
            read: [],
            type: 'regular',
            user: user1.username
          })
          done()
        })
        user1.socket.emit('Message:newClient', {
          type: 'regular',
          room: roomID,
          message: 'test',
          user: user1.username
        })
      })
    })
    describe('Games Msg', () => {
      test('Game message when user1 connected', (done) => {
        user2.socket.on('Message:New', (args) => {
          expect(args).toMatchObject({
            type: 'game',
            room: roomID,
            message: user1.username + ' want to start a game : ',
            user: user1.username,
            game: 'Connect 4',
            state: 'Not started'
          })
          done()
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
  })

  describe('Msg reading', () => {
    test('Message read', async () => {
      user1.socket.emit('Message:newClient', {
        type: 'regular',
        room: roomID,
        message: 'test',
        user: user1.username
      })
      await helper.timeout(200)
      user1.socket.emit('Message:read',
        { room: roomID, username: user1.username })
      await helper.timeout(200)
      const response = await messageModel.findOne({ message: 'test' })
      expect(response).toMatchObject({
        message: 'test',
        read: ['test1'],
        room: roomID,
        type: 'regular',
        user: 'test1'
      })
    })
  })
  describe('/getMsg', () => {
    test('/getMsg regular', async () => {
      user1.socket.emit('Message:newClient', {
        type: 'regular',
        room: roomID,
        message: 'test',
        user: user1.username
      })
      await helper.timeout(200)
      const response = await request(server)
        .get('/getMsg')
        .set('Cookie', [user1.cookie])
        .query({ room: roomID })
        .expect(200)
      expect(response.body).toMatchObject({
        messages: [
          {
            message: 'test',
            read: [],
            room: roomID,
            type: 'regular',
            user: user1.username
          }
        ]
      })
    })

    test('/getMsg no token', async () => {
      user1.socket.emit('Message:newClient', {
        type: 'regular',
        room: roomID,
        message: 'test',
        user: user1.username
      })
      await helper.timeout(200)
      const response = await request(server)
        .get('/getMsg')
        .query({ room: roomID })
        .expect(200)
      expect(response.body).toMatchObject({
        message: 'No token'
      })
    })
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await server.close()
  await MemoryDatabaseServer.stop()
})
