const { MongoMemoryServer } = require("mongodb-memory-server");

class MemoryDatabaseServer {
  constructor() {
    this.mongod = new MongoMemoryServer();
  }

  start() {
    return this.mongod.start();
  }

  stop() {
    return this.mongod.stop();
  }

  getConnectionString() {
    return this.mongod.getUri();
  }
}

module.exports = new MemoryDatabaseServer();
