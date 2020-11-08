const MysqlLib = require('../lib/mysql');

class AuthorsService {

  constructor() {
    this.collection = 'authors';
    this.mysqlDB = new MysqlLib();
  }

  async getAuthors() {
    const query = '';
    const authors = await this.mysqlDB.getAll(this.collection, query);
    return authors || [];
  }

  async getAuthor({ authorId }) {
    const author = await this.mysqlDB.get(this.collection, authorId);;
    return author || {};
  }
  
}

module.exports = AuthorsService;