const mongoose = require('mongoose')

exports.startDB = function () {
  mongoose.connect(process.env.MONGO_URL)
  mongoose.connection.on('error', (err) => {
    console.error('[DB connection] error : ' + err)
  })
}
