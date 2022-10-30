const jwt = require('jsonwebtoken')

exports.checkToken = (req, res) => {
  const token = req.cookies.token

  if (token === undefined) {
    res.status(200).json({ message: 'No token' })
    return
  }
  return jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
    if (err) {
      res.status(500)
      return
    }
    return verifiedJwt.username
  })
}
