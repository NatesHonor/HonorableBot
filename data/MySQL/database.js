require('dotenv').config
const mysql = require('mysql2');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MySQL_HOST,
  user: process.env.MySQL_USERNAME,
  password: process.env.MySQL_PASSWORD,
  database: process.env.MySQL_DATABASE,
});

pool.on('acquire', () => {
});
  

module.exports = pool;
