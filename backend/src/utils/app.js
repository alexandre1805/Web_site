const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const authentification = require('../controllers/Authentification')
const gameConnection = require('../controllers/Game-Connection')
const message = require('../controllers/Message')
const room = require('../controllers/Room')
const userData = require('../controllers/User-Data')

const socketIO = require('./socket-io')

function app () {
  // Server creation
  const app = express()
  const server = require('http').Server(app)

  // Middleware configuration
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(cors())

  // Routes
  app.use('/', authentification.router)
  app.use('/', gameConnection.router)
  app.use('/', message.router)
  app.use('/', room.router)
  app.use('/', userData.router)

  // socket-io
  socketIO.initIO(server)

  return server
}

module.exports = app
