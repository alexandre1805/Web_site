const app = require("./utils/app");

const server = app();
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
