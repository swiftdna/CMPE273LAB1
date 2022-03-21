const dbConfig = require("./mysql");
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

module.exports = connection;