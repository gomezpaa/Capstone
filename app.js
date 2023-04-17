const express = require('express');
const path = require('path');
const db = require('./db')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('express-session');
const {Console} = require('console');
const {request} = require('http');
const {strict} = require('assert');

require('dotenv').config()

const app = express();
const PORT = process.env.node_port;
const saltRounds = 10;

const userRegister = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: process.env.user,
  password: process.env.password,
  database: 'userDB'
});

userRegister.connect((err) => {
  if (err) throw err;
  console.log("Connected to the user database!");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUnintialized: true,
  cookie: {
    maxAge: 15 * 60 * 1000,
    secure: false,
    httpOnly: true,
    sameSite: 'strict'
  },
  rolling: true
}));

app.get('/', function(req, res){
  console.log("Home Page")
  res.render('home', { username: req.session.username });
});

app.get('/about', function(req, res){
  console.log("About Page")
  res.render('about', { username: req.session.username });
});

app.get('/nyt', function(req, res){
  console.log("NYT")
  db.getData(function(data){  
    db.getFullData(function(fullArticle){
      res.render('nyt', {username: req.session.username, news: data, fullArticle: fullArticle});
    });
  });
});

app.get('/logout', function(req, res) {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to logout!')
      } else {
        res.redirect('/');
      }
    })
  }
});

app.post('/register', function(req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var sqlCheck = "SELECT * FROM users WHERE username = ? OR email = ?";
  var sqlInsert = "INSERT INTO users (username, email, password) VALUES (?,?,?)";

  if (req.body.password == req.body.passwordRepeat) {
    var valueCheck = [username, email];
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var valueInsert = [username, email, hash];

    userRegister.query(sqlCheck, valueCheck, function(err, result){
      if (err) throw err;
      if (result.length > 0) {
        console.log("Username or email already exists!");
        res.send('<script>alert("Username or email already exists! Please choose a different username or email."); window.history.back();</script>');
      } else {
        userRegister.query(sqlInsert, valueInsert, function (err, result){
        if (err) throw err;
        console.log("User registered successfully!");
        res.redirect('/');
      });
    }
    });
  } else {
    console.log("Passwords do not match!")
    res.send('<script>alert("Passwords do not match! Please try again."); window.history.back();</script>');

  }
  console.log(username, email, hash);

});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password
  console.log(username, password);

  if (username && password) {
    userRegister.query('SELECT password FROM users WHERE username = ?', [username], function(err, result) {
      if (err) throw err;
      
      if (result.length > 0) {
        var savedHash = result[0].password;
        bcrypt.compare(password, savedHash, function(err, match) {
          if (err) throw err;
          if (match) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/');
          } else {
            console.log("Incorrect password!");
            res.send('<script>alert("Incorrect password!"); window.history.back();</script>');
          }
        });
      } else {
        console.log("User not found!");
        res.send('<script>alert("User not found!"); window.history.back();</script>');
      }
    });
  } else {
    console.log("Username or password not provided!");
  }
});

app.listen(PORT, function(err){
  if (err) console.log(err);
  console.log("Website listening on port: ", PORT);
})
