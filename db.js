const mysql = require('mysql')
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
    console.log("Connected to test database");
});

nytConnection.connect((err) => {
    if (err) throw err;
    console.log("Connected to NYT database");
});

exports.getData = (function(callback) {
    testConnection.query('SELECT * FROM nyt_us', (err, results) => {
	if (err) throw err;
	callback(results);
    });
});

exports.nytHome = (function(callback) {
    testConnection.query('SELECT * FROM nytHome_US', (err, results) => {
	if (err) throw err;
	callback(results);
    });
});

exports.nytNY = (function(callback) {
    testConnection.query('SELECT * FROM nytToday_NY', (err, results) => {
	if (err) throw err;
	callback(results);
    });
});

exports.nytUS = (function(callback) {
    testConnection.query('SELECT * FROM nytToday_US', (err, results) => {
	if (err) throw err;
	callback(results);
    });
});


exports.getFullData = (function(callback) {
    nytConnection.query('SELECT news_items.news_title, news_items.news_description, news_items.news_link, news_article.article_text FROM news_items JOIN news_article ON news_items.article_id = news_article.article_id GROUP BY news_items.news_title, news_items.news_description, news_items.news_link, news_article.article_text', (err, results) =>{
	if(err) throw err;
	callback(results);
    });
});

exports.getFavorite = (function(callback) {
    testConnection.query('SELECT nyt_us.id, nyt_us.title, nyt_us.description, nyt_us.link, nyt_us.pubDate FROM nyt_us INNER JOIN favorites ON nyt_us.id = favorites.nyt_us_id WHERE favorites.user_id = 1 ORDER BY nyt_us.pubDate DESC;', (err, results) => {
	if (err) throw err;
	callback(results);
    });
});
