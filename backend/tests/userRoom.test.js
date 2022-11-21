/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
const app = require('../src/utils/app')
const request = require('supertest')
const mongoose = require('mongoose')
const RoomModel = require('../src/models/rooms')
const helper = require('./lib/helper')
const MemoryDatabaseServer = require('./lib/MemoryDatabaseServer')

let server
const port = 4003
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
  user1 = await helper.createUser(server, port, user1, true, [
    user2.username,
    user3.usernames
  ])
  user2 = await helper.createUser(server, port, user2, true, [
    user1.username,
    user3.usernames
  ])
  user3 = await helper.createUser(server, port, user3, true, [
    user2.username,
    user1.usernames
  ])
})

afterEach(async () => {
  await helper.deleteUser(user1, true)
  await helper.deleteUser(user2, true)
  await helper.deleteUser(user3, true)
  await RoomModel.deleteMany({})
})

describe('User Room', () => {
  test('Room already exists', async () => {
    const room = new RoomModel({
      type: 'PM',
      name: 'test',
      users: [user1.username, user2.username, user3.username]
    })
    await room.save()
    user1.socket.emit('Room:create', [
      user1.username,
      user2.username,
      user3.username
    ])
    await helper.timeout(500)
    user1.socket.on('Room:Create:Return', (arg) => {
      expect(arg).toMatch('Room already exists.')
    })
  })

  describe('Groups', () => {
    test('Room creation : check DB', async () => {
      user1.socket.emit('Room:create', [
        user1.username,
        user2.username,
        user3.username
      ])
      await helper.timeout(500)
      const room = await RoomModel.find({
        users: [user1.username, user2.username, user3.username]
      })
      expect(room).toMatchObject([
        {
          type: 'group',
          name: user1.username + ', ' + user2.username + ', ' + user3.username,
          users: [user1.username, user2.username, user3.username]
        }
      ])
    })

    test('Room creation : check return for the creator', (done) => {
      user1.socket.on('Room:Create:Return', (arg) => {
        expect(arg).toMatch('Room created')
        done()
      })
      user1.socket.emit('Room:create', [
        user1.username,
        user2.username,
        user3.username
      ])
    })

    test('Room creation : check return for all users', (done) => {
      user1.socket.on('Room:New', (arg) => {
        expect(arg).toMatchObject({
          name: user1.username + ', ' + user2.username + ', ' + user3.username,
          type: 'group',
          unread: 0,
          users: [user1.username, user2.username, user3.username]
        })
        done()
      })
      user1.socket.emit('Room:create', [
        user1.username,
        user2.username,
        user3.username
      ])
    })
  })

  describe('Private message', () => {
    test('Room creation : check DB', async () => {
      user1.socket.emit('Room:create', [user1.username, user2.username])
      await helper.timeout(500)
      const room = await RoomModel.find({
        users: [user1.username, user2.username]
      })
      expect(room).toMatchObject([
        {
          type: 'PM',
          name: user1.username + ', ' + user2.username,
          users: [user1.username, user2.username]
        }
      ])
    })

    test('Room creation : check return for the creator', (done) => {
      user1.socket.on('Room:Create:Return', (arg) => {
        expect(arg).toMatch('Room created')
        done()
      })
      user1.socket.emit('Room:create', [user1.username, user2.username])
    })

    test('Room creation : check return for all users', (done) => {
      user1.socket.on('Room:New', (arg) => {
        expect(arg).toMatchObject({
          name: user2.username,
          type: 'PM',
          unread: 0,
          users: [user1.username, user2.username]
        })
        done()
      })
      user1.socket.emit('Room:create', [user1.username, user2.username])
    })
  })

  describe('/getRooms', () => {
    test('Get Rooms without token', async () => {
      const response = await request(server).get('/getRooms').expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'No token'
      })
    })

    test('Get Rooms normal', (done) => {
      setTimeout(async () => {
        const response = await request(server)
          .get('/getRooms')
          .set('Cookie', [user2.cookie])
          .expect(200)
        expect(response.body.hasOwnProperty('message'))
        expect(response.body).toMatchObject({
          rooms: [
            {
              name: user1.username,
              type: 'PM',
              unread: 0,
              users: [user1.username, user2.username]
            }
          ]
        })
        done()
      }, 200)

      user1.socket.emit('Room:create', [user1.username, user2.username])
    })
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await server.close()
  await MemoryDatabaseServer.stop()
})
