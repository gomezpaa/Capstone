const mysql = require('mysql');
require('dotenv').config()

const testConnection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: process.env.user,
  password: process.env.password,
  database: 'test'
});

const nytConnection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: process.env.user,
  password: process.env.password,
  database: 'NYT'
});

testConnection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the test database!");
});

exports.getData = (function(callback) {
  testConnection.query('SELECT * FROM nyt_us', (err, results) => {
    if (err) throw err;
    callback(results);
  });
});

nytConnection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the NYT database!");
});

exports.getFullData = (function(callback) {
  nytConnection.query('SELECT news_title, news_description, news_link, article_text FROM news_items JOIN news_article ON news_items.article_id = news_article.article_id GROUP BY news_items.article_id', (err, results) =>{
    if(err) throw err;
    callback(results);
  });
});

