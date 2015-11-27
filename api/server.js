var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var config = require('./config');
var auth_api = require('./routers/auth_api')(app);
var data_api = require('./routers/data_api')(app);
var middleware = require('./middleware/auth')(app);


var port = process.env.PORT || 8080;

// connect to MongoLab database
mongoose.connect(config.database);

// set up secret string
app.set('SECRET_KEY', config.secret);

app.use(bodyParser.urlencoded({
    extended: true

}));
app.use(bodyParser.json());

app.set('trust proxy', 1); // trust first proxy 

app.use(cookieParser(config.secret));

app.use(session({
    secret: config.secret,
    // store: new MongoStore({
    //     mongooseConnection: mongoose.connection
    // }),
    key: 'session',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: false
    }, //30 days
    resave: true,
    saveUninitialized: false
}));

// set up HTTP request logger middleware 
app.use(morgan('dev'));

// add cross domian accesss, temporary test only 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Access-Token, X-Requested-With, Content-Type, Accept");
    next();
});

// a hint message
app.get('/', function(req, res) {
    res.send('The API is at http://localhost:' + port + '/api');
});

// set up routes
app.use('/api', auth_api);

auth_api.use(middleware.authentication);

// set up middleware authentication for admin user accessing
data_api.use(middleware.adminAuth);

app.use('/api', data_api);


app.listen(port);
console.log('started server at http://localhost:' + port);
