// put all data explore related routes in this unit

var express = require('express');
var User = require('../models/user');
var Attempt = require('../models/Attempt');

module.exports = function(app) {

    var apiRoutes = express.Router();
    // route to return all users (GET http://localhost:8080/api/users)
    apiRoutes.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            res.json({
                success: true,
                data: users,
                message: 'Operation Success!'
            });
        });
    });


    // route to return all attempts logs (GET http://localhost:8080/api/logs)
    apiRoutes.get('/attempts', function(req, res) {
        Attempt.find({}, function(err, attempt) {
            res.json({
                success: true,
                data: attempt,
                message: 'Operation Success!'
            });
        });
    });

    return apiRoutes;
}
