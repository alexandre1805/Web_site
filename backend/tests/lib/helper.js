const mongoose = require('mongoose')
const UserModel = require('../../src/models/users')
const request = require('supertest')
const io = require('socket.io-client')

async function createUser (
  server,
  port,
  user,
  logged = false,
  friends = [],
  rooms = []
) {
  if (mongoose.connection.readyState !== 1) {
    console.error('DB not connected')
    return
  }

  try {
    user.friends = friends
    user.rooms = rooms
    const newUser = new UserModel(user)
    await newUser.save()
  } catch (error) {
    console.error(error)
  }

  if (logged) {
    const response = await request(server).post('/login').send({
      username: user.username,
      password: user.password
    })
    user.cookie = response.headers['set-cookie'][0]

    user.socket = await io('http://localhost:' + port, {
      query: {
        username: user.username
      }
    })

    const connection = () => {
      return new Promise(function (resolve, reject) {
        user.socket.once('connect', () => { resolve('done') })
      })
    }

    await connection()
  }

  return user
}

async function deleteUser (user, logged = false) {
  if (mongoose.connection.readyState !== 1) {
    console.error('DB not connected')
    return
  }

  await UserModel.deleteOne({ username: user.username, email: user.email })
  if (logged) user.socket.close()
}

function timeout (ms) {
  return new Promise((resolve) => {
    const t = setTimeout(resolve, ms)
    t.unref()
    return t
  })
}

module.exports = {
  createUser,
  deleteUser,
  timeout
}
