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

  async createAuthor({ author }) {
    const createdAuthorId = await this.mysqlDB.create(this.collection, author);
    return createdAuthorId || {};
  }

  async updateAuthor({ authorId, author } = {}) {
    const updateAuthorId = await this.mysqlDB.updated(this.collection, authorId, author);
    return updateAuthorId;
  }

  async deletedAuthor({ authorId }) {
    const deletedAuthorId = await this.mysqlDB.delete(this.collection, authorId);
    return deletedAuthorId;
  }
  
}

module.exports = AuthorsService;