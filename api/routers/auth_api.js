// put all authentication related routes in this unit

var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Attempt = require('../models/Attempt');
var config = require('../config');
var bodyParser = require('body-parser');


module.exports = function(app, apiRoutes) {

    // route to show a random message (GET http://localhost:8080/api/)
    apiRoutes.get('/', function(req, res) {
        res.json({
            message: 'Main API endpoint, please try http://localhost:8080/api/attempts after login with "admin" user.'
        });
    });
    // logout and destroy session 
    apiRoutes.get('/logout', function(req, res) {
        req.session.destroy();
        //req.session = null;
        res.send({
            success: true,
            message: 'Logout success.'
        });
    });



    apiRoutes.post('/auth', function(req, res) {
        // find the user
        console.log(req.body);
        console.log('load req.session', req.session);
        var ip = req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip; //get ip from request

        var attempt = new Attempt({
            ip: ip,
            username: '',
            action: 'AUTH_FAILURE',
            datetime: (new Date).getTime()
        });

        if (!req.body.username || !req.body.password) {

            attempt.save(function(err) {
                if (err) throw err;
                console.log(attempt, 'created!');
            });
            res.json({
                success: false,
                message: 'Authentication failed. Username or password is empty.'
            });
        } else {
            attempt.username = req.body.username; // set username to attempt logs

            User.findOne({
                username: {
                    $regex: new RegExp('^' + req.body.username, 'i') // username case-insensitive
                }
            }, function(err, user) {

                if (err) throw err;

                if (user) {
                    // check if password matches
                    user.comparePassword(req.body.password, function(err, isMatch) {
                        if (err) throw err;
                        console.log(user, isMatch);
                        if (isMatch === false) {
                            attempt.save(function(err) {
                                if (err) throw err;
                                console.log(attempt, 'created!');
                            });

                            res.json({
                                success: false,
                                message: 'Authentication failed. Password is not matched.'
                            });


                        } else {
                            // if user is found and password is right
                            // create a token

                            var token = jwt.sign(user, app.get('SECRET_KEY'), {
                                expiresIn: 1440 // expires in 24 hours
                            });

                            // return the information including token as JSON
                            req.session.user = user;
                            req.session.save(function(err) {
                                if (err) console.log(err);

                            });
                            console.log('req.session', req.session);


                            if (user.admin) {
                                console.log(user.username, ' , admin user just logined. ');
                            } else {
                                console.log(user.username, ' , user just logined. ');
                            }

                            attempt.action = 'AUTH_SUCCESS';
                            attempt.save(function(err) {
                                if (err) throw err;
                                console.log(attempt, 'created!');
                            });

                            res.json({
                                success: true,
                                message: 'Login Success!',
                                token: token,
                                admin: user.admin
                            });

                            res.end();

                        }
                    });
                } else {

                    attempt.save(function(err) {
                        if (err) throw err;
                        console.log(attempt, 'created!');
                    });
                    res.json({
                        success: false,
                        message: 'Authentication failed. User not found.'
                    });

                }
            });
        }
    });


    return apiRoutes;
}
