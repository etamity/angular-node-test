// authentication related functions

var express = require('express');
var jwt = require('jsonwebtoken');

module.exports = function(app) {

    var authentication = function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        console.log(token);
        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('SECRET_KEY'), function(err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Authentication failed. Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'Authentication failed. Token missing.'
            });

        }
    }


    var adminAuth = function(req, res, next) {
        // There is a unkown issue cause req.session can not be saved. 
        // Temporary quick fixed with passing parameter from client request 
        // if (req.session && req.session.user && req.session.user.admin)
        var admin = req.body.admin || req.query.admin || 'false';
        isAdmin = (admin.toLowerCase() === 'true') ? true : false;
        console.log('IsAdmin:', isAdmin);
        if (isAdmin === true) {
            return next();
        } else {
            return res.json({
                success: false,
                message: 'Authentication failed. This is for admin user only'
            });
        }
    }

    // public authentication middleware method
    return {
        authentication: authentication,
        adminAuth: adminAuth
    }

}
