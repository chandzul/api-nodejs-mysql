const mysql      = require('mysql');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

// const connection = mysql.createConnection({
//   host     : config.dbHost,
//   user     : USER,
//   password : PASSWORD,
//   database: DB_NAME,
//   port: config.dbPort
// });

// connection.connect((err) => {
//   if (err) {
//     console.log('Error Connecting to Mysql');
//     return;
//   }

//   console.log('Connected succesfully to Mysql');
// });

// connection.query('SELECT * FROM authors', function(err, rows, fields) {
//   if (err) throw err;
//   console.log('The solution is: ', rows[0].solution);
// });

// connection.end();

class MysqlLib {
  constructor() {

    this.client = mysql.createConnection({
      host     : config.dbHost,
      user     : USER,
      password : PASSWORD,
      database: DB_NAME,
      port: config.dbPort
    });

    this.dbName = DB_NAME;
  }

  // patron singleton | Conectamos a la instacia de MYSQL
  connect() {
    if (!MysqlLib.connection) {
      MysqlLib.connection = new Promise((resolve, reject) => {
        this.client.connect( err => {
          if (err) {
            reject(err);
          }

          console.log('Connected succesfully to Mysql');
          resolve(this.client);
        });
      });
    }

    return MysqlLib.connection;
  }

  // Retornamos todos los recursos de la coleccion
  getAll(collection, query) {
    return this.connect().then( db => {
      return new Promise(function(resolve, reject){
        db.query(`SELECT * FROM ${collection}`, function(err, result, fields){
          if (!err) resolve(JSON.parse(JSON.stringify(result))); // Hacky solution
          else reject(err);
        });
      });
    })
  }

  // Retornamos la data de un solo recurso de la coleccion
  get(collection, id) {
    return this.connect().then( db => {
      return new Promise(function(resolve, reject){
        db.query(`SELECT * FROM ${collection} where id=${id}`, function(err, result, fields){
          if (!err) resolve(JSON.parse(JSON.stringify(result))); // Hacky solution
          else reject(err);
        });
      });
    })
  }
}

module.exports = MysqlLib;