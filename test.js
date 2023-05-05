const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('home');
});

app.listen(80, function(err) {
    if (err) console.log(err);
    console.log("Site started on port 8080");
});
