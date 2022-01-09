const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/website/style.css'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/website/index.html')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})