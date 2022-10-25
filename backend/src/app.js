const app = require("./utils/app");
const mongoose = require("mongoose");

const server = app();

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
