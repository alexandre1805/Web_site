const app = require('./utils/app')
const db = require('./utils/DB')

const server = app()

// start the server
if (process.env.NODE_ENV !== 'test') {
  db.startDB()
  const port = process.env.PORT || 4000
  server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })
}
