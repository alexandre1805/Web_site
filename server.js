const express = require("express");
const app = express();
const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
