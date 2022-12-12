/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
const app = require('../src/utils/app')
const request = require('supertest')
const mongoose = require('mongoose')
const userModel = require('../src/models/users')
const helper = require('./lib/helper')
const MemoryDatabaseServer = require('./lib/MemoryDatabaseServer')

let server
const port = 4001
beforeAll(async () => {
  await MemoryDatabaseServer.start()
  server = app()
  mongoose.set('strictQuery', true)
  await mongoose.connect(MemoryDatabaseServer.getConnectionString())
})

describe('Authentification', () => {
  describe('Registration', () => {
    test('with undefined username', async () => {
      const response = await request(server)
        .post('/register')
        .send({ email: 'toto@gmail.com', password: 'tata' })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Username field is required not empty or undefined.'
      })
    })

    test('with empty username', async () => {
      const response = await request(server)
        .post('/register')
        .send({ username: '', email: 'toto@gmail.com', password: 'tata' })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Username field is required not empty or undefined.'
      })
    })

    test('with undefined email', async () => {
      const response = await request(server)
        .post('/register')
        .send({ username: 'toto', password: 'tata' })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Email field is required not empty or undefined.'
      })
    })

    test('with empty email', async () => {
      const response = await request(server)
        .post('/register')
        .send({ username: 'toto', email: '', password: 'tata' })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Email field is required not empty or undefined.'
      })
    })

    test('with undefined password', async () => {
      const response = await request(server)
        .post('/register')
        .send({ username: 'toto', email: 'toto@gmail.com' })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Password field is required not empty or undefined.'
      })
    })

    test('with empty password', async () => {
      const response = await request(server)
        .post('/register')
        .send({ username: 'toto', email: 'toto@gmail.com', password: '' })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Password field is required not empty or undefined.'
      })
    })

    test('a user with the same username already exist', async () => {
      const user = {
        username: 'username',
        email: 'email@test.com',
        password: 'password'
      }
      await helper.createUser(server, port, user)

      const response = await request(server)
        .post('/register')
        .send({
          username: user.username,
          email: 'toto@gmail.com',
          password: user.password
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Username already exists.'
      })
    })

    test('a user with the same email already exist', async () => {
      const user = {
        username: 'username',
        email: 'email@test.com',
        password: 'password'
      }
      await helper.createUser(server, port, user)
      const response = await request(server)
        .post('/register')
        .send({
          username: 'test',
          email: user.email,
          password: user.password
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Email already exists.'
      })

      await helper.deleteUser(user)
    })

    test('classic registration', async () => {
      const user = {
        username: 'test',
        email: 'test@gmail.com',
        password: 'password'
      }
      const response = await request(server)
        .post('/register')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'OK'
      })

      const dbUser = await userModel.find({
        username: user.username,
        email: user.email
      })
      expect(dbUser).not.toMatchObject({
        username: user.username,
        email: user.email
      })
      helper.deleteUser(user)
    })
  })

  describe('Login', () => {
    test('with undifined username', async () => {
      const response = await request(server)
        .post('/login')
        .send({
          password: 'toto'
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Username field is required not empty or undefined.'
      })
    })

    test('with empty username', async () => {
      const response = await request(server)
        .post('/login')
        .send({
          username: '',
          password: 'toto'
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Username field is required not empty or undefined.'
      })
    })

    test('with undifined password', async () => {
      const response = await request(server)
        .post('/login')
        .send({
          username: 'test'
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Password field is required not empty or undefined.'
      })
    })

    test('with empty password', async () => {
      const response = await request(server)
        .post('/login')
        .send({
          username: 'test',
          password: ''
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Password field is required not empty or undefined.'
      })
    })

    test('with invalid password', async () => {
      const response = await request(server)
        .post('/login')
        .send({
          username: 'test',
          password: 'test'
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Invalid login.'
      })
    })

    test('classic login', async () => {
      const user = {
        username: 'test',
        email: 'test@gmail.com',
        password: 'password'
      }
      helper.createUser(server, port, user)
      const response = await request(server)
        .post('/login')
        .send({
          username: user.username,
          password: user.password
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'OK'
      })
      expect(response.headers.hasOwnProperty('set-cookie'))

      helper.deleteUser(user)
    })
  })

  describe('Token verification', () => {
    test('No token', async () => {
      const response = await request(server)
        .get('/verifToken')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'No token.'
      })
    })

    test('Bad token', async () => {
      const response = await request(server)
        .get('/verifToken')
        .set('Cookie', ['token=12345667'])
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'Token is invalid.'
      })
    })

    test('Good token', async () => {
      const user = {
        username: 'test',
        email: 'test@gmail.com',
        password: 'password'
      }
      await helper.createUser(server, port, user)

      const login = await request(server).post('/login').send({
        username: user.username,
        password: user.password
      })

      const token = login.headers['set-cookie'][0]
      const response = await request(server)
        .get('/verifToken')
        .set('Cookie', [token])
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.hasOwnProperty('message'))
      expect(response.body).toMatchObject({
        message: 'OK'
      })
      await helper.deleteUser(user)
    })
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await MemoryDatabaseServer.stop()
})
