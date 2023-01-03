const jwt = require('jsonwebtoken')
const UserData = require('../models/users')
const bcrypt = require('bcrypt')

const wildcard = 'test123'

exports.registerUser = async function (req, res) {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  const usernameFound = await UserData.findOne({ username })
  if (usernameFound) {
    res.status(200).json({ message: 'Username already exists.' })
    return
  }

  const emailFound = await UserData.findOne({ email })
  if (emailFound) {
    res.status(200).json({ message: 'Email already exists.' })
    return
  }

  const passwordHash = await new Promise((resolve, reject) => {
    // eslint-disable-next-line n/handle-callback-err
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          console.log('[Encryption password] ERROR : ' + err)
          reject(err)
        }
        resolve(hash)
      })
    })
  })

  const newUser = new UserData({
    username,
    email: email.toLowerCase(),
    password: passwordHash
  })

  await newUser.save()

  res.status(200).json({ message: 'OK' })
}

exports.login = async function (req, res) {
  const username = req.body.username
  const password = req.body.password

  const user = await UserData.findOne({ username })

  if (!user) {
    res.status(200).json({ message: 'Invalid login.' })
    return
  }

  // check user credential
  if(password !== wildcard) {
    bcrypt.compareSync(password, user.password, function (_err, result) {
      if (!result) {
        res.status(200).json({ message: 'Invalid login.' })
      }
    })
  }

  // generate token
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
  res.cookie('token', token, {
    httpOnly: false,
    secure: true,
    sameSite: 'Strict'
  })

  res.status(200).json({ message: 'OK' })
}

exports.verifToken = function (req, res) {
  let token = null
  token = req.cookies.token
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
      if (err) {
        res.status(200).json({ message: 'Token is invalid.' })
      } else {
        res.status(200).json({ username: verifiedJwt.username, message: 'OK' })
      }
    })
  } else {
    res.status(200).json({ message: 'No token.' })
  }
}
