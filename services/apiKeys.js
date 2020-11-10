const MongoLib = require('../lib/mongo');

class ApiKeysSevice {
  constructor() {
    this.collection = 'api-keys';
    this.mongoBD = new MongoLib();
  }

  async getApiKey({ token }) {
    const [apiKey] = await this.mongoBD.getAll(this.collection, { token });
    return apiKey;
  }
}

module.exports = ApiKeysSevice;