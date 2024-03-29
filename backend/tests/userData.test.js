/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
const app = require('../src/utils/app')
const request = require('supertest')
const mongoose = require('mongoose')
const NotificationModel = require('../src/models/notification')
const helper = require('./lib/helper')
const MemoryDatabaseServer = require('./lib/MemoryDatabaseServer')

let server
const port = 4002
let user1 = { username: 'test1', email: 'test1@gmail.com', password: 'toto' }
let user2 = { username: 'test2', email: 'test2@gmail.com', password: 'toto' }

beforeAll(async () => {
  await MemoryDatabaseServer.start()
  server = app()
  mongoose.set('strictQuery', true)
  await mongoose.connect(MemoryDatabaseServer.getConnectionString())
  server.listen(port)
})

beforeEach(async () => {
  user1 = await helper.createUser(server, port, user1, true)
  user2 = await helper.createUser(server, port, user2, true)
})

afterEach(async () => {
  await helper.deleteUser(user1, true)
  await helper.deleteUser(user2, true)
  await NotificationModel.deleteMany({})
})

describe('User Data', () => {
  describe('Friends', () => {
    describe('/getFriends', () => {
      test('Get Friends without token', async () => {
        const response = await request(server).get('/getFriends').expect(200)
        expect(response.body.hasOwnProperty('message'))
        expect(response.body).toMatchObject({
          message: 'No token'
        })
      })
      test('Get Notification without token', async () => {
        const response = await request(server).get('/getNotifs').expect(200)
        expect(response.body.hasOwnProperty('message'))
        expect(response.body).toMatchObject({
          message: 'No token'
        })
      })

      test('Get Friends with no friends', async () => {
        const response = await request(server)
          .get('/getFriends')
          .set('Cookie', [user1.cookie])
          .expect(200)
        expect(response.body.hasOwnProperty('friends'))
        expect(response.body).toMatchObject({
          friends: []
        })
      })
    })
    describe('Add friend', () => {
      test('Add friend with empty username', (done) => {
        user1.socket.emit('User:Friend:Add', '')
        user1.socket.on('User:Friend:Add:Return', (arg) => {
          expect(arg).toMatch('You must specify a friend.')
          done()
        })
      })

      test('Add friend with unknown username', (done) => {
        user1.socket.emit('User:Friend:Add', 'unknwon_user')
        user1.socket.on('User:Friend:Add:Return', (arg) => {
          expect(arg).toMatch('The user does not exist')
          done()
        })
      })

      test('Add friend with empty username', (done) => {
        user1.socket.emit('User:Friend:Add', '')
        user1.socket.on('User:Friend:Add:Return', (arg) => {
          expect(arg).toMatch('You must specify a friend.')
          done()
        })
      })

      test('Add friend, with expect return for the sender', (done) => {
        user1.socket.emit('User:Friend:Add', user2.username)
        user1.socket.on('User:Friend:Add:Return', (arg) => {
          expect(arg).toMatch('Invitation sended.')
          done()
        })
      })

      test('Add friend, with expect return for the receiver (test on socket)',
        (done) => {
          user2.socket.on('User:Notification:New', (arg) => {
            expect(arg).toMatchObject({
              type: 'add_friend',
              username: 'test2',
              message: 'test1 wants to add you as friend !',
              from: 'test1'
            })
            done()
          })
          user1.socket.emit('User:Friend:Add', user2.username)
        })

      test('Add friend, with expect return for the receiver (test on api route)'
        , async () => {
          user1.socket.emit('User:Friend:Add', user2.username)
          await helper.timeout(500)
          const response = await request(server)
            .get('/getNotifs')
            .set('Cookie', [user2.cookie])
            .expect(200)
          expect(response.body).toMatchObject([
            {
              type: 'add_friend',
              username: 'test2',
              message: 'test1 wants to add you as friend !',
              from: 'test1'
            }
          ])
        })

      test('Add friend : with the username of the user', (done) => {
        user1.socket.on('User:Friend:Add:Return', (arg) => {
          expect(arg).toMatch('You cannot add yourself as a friend')
          done()
        })
        user1.socket.emit('User:Friend:Add', user1.username)
      })

      test('Add friend : multiple invitation (must be stopped)', (done) => {
        user1.socket.once('User:Friend:Add:Return', (arg) => {
          expect(arg).toMatch('Invitation sended.')
          user1.socket.once('User:Friend:Add:Return', (arg) => {
            expect(arg).toMatch('You cannot send multiple invitations')
            done()
          })
          user1.socket.emit('User:Friend:Add', user2.username)
        })
        user1.socket.emit('User:Friend:Add', user2.username)
      })
    })
    describe("Friend's invatation", () => {
      test('Accept invitation (check notif of user)', async () => {
        user1.socket.emit('User:Friend:Add', user2.username)
        await helper.timeout(500)
        const response = await request(server)
          .get('/getNotifs')
          .set('Cookie', [user2.cookie])
        user2.socket.emit('User:Notification:Accept', response.body[0])

        await helper.timeout(500)
        const response2 = await request(server)
          .get('/getNotifs')
          .set('Cookie', [user2.cookie])
          .expect(200)
        expect(response2.body.length).toBe(0)
      })

      test('Accept invitation (check friend of users)', (done) => {
        user1.socket.emit('User:Friend:Add', user2.username)
        setTimeout(async () => {
          const response = await request(server)
            .get('/getNotifs')
            .set('Cookie', [user2.cookie])
          user2.socket.emit('User:Notification:Accept', response.body[0])
          setTimeout(async () => {
            const response = await request(server)
              .get('/getFriends')
              .set('Cookie', [user2.cookie])
              .expect(200)
            expect(response.body).toMatchObject({
              friends: [{ username: 'test1' }]
            })

            const response2 = await request(server)
              .get('/getFriends')
              .set('Cookie', [user1.cookie])
              .expect(200)
            expect(response2.body).toMatchObject({
              friends: [{ username: 'test2' }]
            })
            done()
          }, 500)
        }, 500)
      })

      test('Send invitation to a user who is already a friend', (done) => {
        user1.socket.emit('User:Friend:Add', user2.username)
        setTimeout(async () => {
          const response = await request(server)
            .get('/getNotifs')
            .set('Cookie', [user2.cookie])
          user2.socket.emit('User:Notification:Accept', response.body[0])
          setTimeout(async () => {
            user1.socket.emit('User:Friend:Add', user2.username)
            user1.socket.on('User:Friend:Add:Return', (arg) => {
              expect(arg).toMatch(user2.username + ' is already your friend.')
              done()
            })
          }, 500)
        }, 500)
      })
    })
  })
  describe('Notifications', () => {
    test('Delete Notification', (done) => {
      const newNotification = new NotificationModel({
        type: 'add_friend',
        username: user1.username,
        from: user2.username,
        message: user1.username + ' wants to add you as friend !'
      })
      setTimeout(async () => {
        await newNotification.save()
        await NotificationModel.findOne({}, 'id')
        user1.socket.emit('User:Notification:Delete', newNotification)
        setTimeout(async () => {
          expect(await NotificationModel.find({})).toMatchObject([])
          done()
        }, 500)
      }, 500)
    })
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await server.close()
  await MemoryDatabaseServer.stop()
})
