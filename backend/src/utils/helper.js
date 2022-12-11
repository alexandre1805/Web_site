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

exports.shuffle = (array) => {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ]
  }

  return array
}

exports.cards_sort = (array) => {
  return array.sort((a, b) => {
    if (a.value === b.value) {
      return 0
    }
    const order = [
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K',
      'A',
      '2'
    ]
    if (order.indexOf(a.value) > order.indexOf(b.value)) {
      return 1
    } else {
      return -1
    }
  })
}
