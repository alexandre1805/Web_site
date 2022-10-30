const jwt = require('jsonwebtoken')
const UserData = require('../models/users')

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

  const newUser = new UserData({
    username,
    email: email.toLowerCase(),
    password
  })

  await newUser.save()

  res.status(200).json({ message: 'OK' })
}

exports.login = async function (req, res) {
  const username = req.body.username
  const password = req.body.password

  const user = await UserData.findOne({ username })

  // check user credential
  if (!user || user.password !== password) {
    res.status(200).json({ message: 'Invalid login.' })
    return
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
