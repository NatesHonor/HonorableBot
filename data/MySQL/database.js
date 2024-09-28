const mysql = require('mysql2');
const config = require('../../config.json');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
});

pool.on('acquire', () => {
});
  

module.exports = pool;
