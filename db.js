const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: process.env.user,
  password: process.env.password,
  database: 'test'
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

exports.getData = function(callback) {
  connection.query('SELECT * FROM nyt_us', (err, results) => {
    if (err) throw err;
    callback(results);
  });
};
