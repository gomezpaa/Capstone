const express = require('express');
const path = require('path');
const db = require('./db')

require('dotenv').config()

const app = express();
const PORT = process.env.node_port;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  console.log("Home Page")
  res.render('home')
});

app.get('/about', function(req, res){
  console.log("About Page")
  res.render('about');
});

app.get('/nyt', function(req, res){
  console.log("NYT")
  db.getData(function(data){  
    res.render('nyt', {news:data});
  });
});

app.listen(PORT, function(err){
  if (err) console.log(err);
  console.log("Website listening on port: ", PORT);
})
