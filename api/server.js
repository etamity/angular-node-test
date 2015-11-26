var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./config');
var port = process.env.PORT || 8080;


mongoose.connect(config.database);


app.set('SECRET_KEY', config.secret);



app.get('/', function(req, res) {
    res.send('The API is at http://localhost:' + port + '/api');
});


app.listen(port);
console.log('started server at http://localhost:' + port);
