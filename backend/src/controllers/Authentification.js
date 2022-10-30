const authService = require('../services/Authentification')
const router = require('express').Router()

// ============================== REGISTRATION =================================
function checkRegisterParma (req, res) {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  if (username === undefined || username === '') {
    res
      .status(200)
      .json({ message: 'Username field is required not empty or undefined.' })
    return false
  }

  if (email === undefined || email === '') {
    res
      .status(200)
      .json({ message: 'Email field is required not empty or undefined.' })
    return false
  }

  if (password === undefined || password === '') {
    res
      .status(200)
      .json({ message: 'Password field is required not empty or undefined.' })
    return false
  }

  return true
}

router.post('/register', (req, res) => {
  if (checkRegisterParma(req, res)) authService.registerUser(req, res)
})

// ================================= LOGIN =====================================
function checkLoginParma (req, res) {
  const username = req.body.username
  const password = req.body.password

  if (username === undefined || username === '') {
    res
      .status(200)
      .json({ message: 'Username field is required not empty or undefined.' })
    return false
  }

  if (password === undefined || password === '') {
    res
      .status(200)
      .json({ message: 'Password field is required not empty or undefined.' })
    return false
  }

  return true
}
router.post('/login', (req, res) => {
  if (checkLoginParma(req, res)) authService.login(req, res)
})

// ============================== VERIF TOKEN ==================================

function checkVerifTokenParma (req, res) {
  if (req.cookies.token === undefined) {
    res.status(200).json({ message: 'No token' })
    return false
  }

  return true
}
router.get('/verifToken', (req, res) => {
  if (checkVerifTokenParma) authService.verifToken(req, res)
})

exports.router = router
