const express = require('express');
const path = require('path');
const db = require('./db')

require('dotenv').config()

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res){
  db.getData(function(data) {
    res.render('home', {news:data});
  });
});

app.get('/about', function(req, res){
  console.log("About Page")
  res.render('about');
});

app.listen(PORT, function(err){
  if (err) console.log(err);
  console.log("Website listening on port: ", PORT);
})
