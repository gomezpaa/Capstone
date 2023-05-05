const express = require('express');
const path = require('path');
const db = require('./db')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('express-session');

require('dotenv').config()

const app = express();
const PORT = process.env.node_port;
const saltRounds = 10;
const hostname = 'localhost';

const user = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: process.env.user,
    password: process.env.password,
    database: 'test'
});

user.connect((err) => {
    if (err) throw err;
    console.log("Connected to the 'user' table in the 'test' database!");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
	maxAge: 15 * 60 * 1000,
	secure: false,
	httpOnly: true,
	sameSite: 'strict'
    },
    rolling: true
}));

app.get('/', function(req, res) {
    console.log("Home Page")
    db.nytUS(function(nytUS) {
	db.nytHome(function(nytHome) {
	    db.nytNY(function(nytNY) {
		res.render('home', {username:req.session.username, nytUS:nytUS, nytHome:nytHome, nytNY:nytNY});
	    });
	});
    });
});

app.get('/about', function(req, res) {
    console.log("About Page")
    res.render('about', {username: req.session.username});
})

app.get('/nyt', function(req, res){
    console.log("NYT")
    db.getData(function(data){
	db.getFullData(function(fullArticle){
	    res.render('nyt', {username: req.session.username, news:data, fullArticle: fullArticle});
	});
    });
});

app.get('/fox', function(req, res) {
    console.log("Fox")
    res.render('fox', { username: req.session.username });
});

app.get('/cnn', function(req, res) {
    console.log("CNN")
    res.render('cnn', { username: req.session.username });
});

app.get('/favoritePage', (req, res) => {
    console.log("Favorites")
    db.getFavorite(function(favorite) {
	res.render('favoritePage', {username:req.session.username, favorite:favorite});
    });
});

app.post('/favorite', (req, res) => {
    const username = req.session.username;
    const article_id = req.body.article_id;
    const user_id = req.session.user_id;
    console.log(username, user_id, article_id);

    const sqlCheck = "SELECT * FROM favorites WHERE user_id = ? AND nyt_us_id = ?";
    const values = [user_id, article_id];
    user.query(sqlCheck, values, function(err, result) {
	if (err) throw err;
	if (result.length > 0) {
	    console.log("Article is already in favorites!")
	    res.send('<script>alert("Article already in favorites!"); window.history.back();</script>')
	} else {
	    const sqlInsert = "INSERT INTO favorites(user_id, nyt_us_id) VALUES (?, ?)";
	    const values = [user_id, article_id];
	    user.query(sqlInsert, values, function(err, result) {
		if (err) throw err;
		console.log("Article added to favorites!");
		res.redirect('/nyt?favorite_added=true');
	    });
	}
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
    var sqlCheck = "SELECT * FROM users WHERE username = BINARY ? OR email = BINARY ?";
    var sqlInsert = "INSERT INTO users (username, email, password) VALUES (?,?,?)";

    if (req.body.password == req.body.passwordRepeat) {
	var valueCheck = [username, email];
	var hash = bcrypt.hashSync(req.body.password, saltRounds)
	var valueInsert = [username, email, hash];
	user.query(sqlCheck, valueCheck, function(err, result) {
	    if (err) throw err;
	    if (result.length > 0) {
		console.log("Username or email already exists!");
		res.send('<script>alert("Username or email already exists! Please choose a diffrent username or email."); window.history.back();</script>');    
	    } else {
		user.query(sqlInsert, valueInsert, function (err, result){
		    if(err) throw err;
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
    var password = req.body.password;
    var sqlCheck = "SELECT id, password FROM users WHERE username = BINARY ?";
    var valueCheck = [username];

    if (username && password) {	
	user.query(sqlCheck, valueCheck, function(err, result) {
	    if (err) throw err;
	    if(result.length > 0) {
		var savedHash = result[0].password;
		bcrypt.compare(password, savedHash, function(err, match) {
		    if (err) throw err;
		    if (match) {
			req.session.loggedin = true;
			req.session.username = username;
			req.session.user_id = result[0].id;
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

app.listen(PORT, hostname, function(err) {
    if (err) console.log(err);
    console.log("Website is running on www.gagunrk.com");
});
 
