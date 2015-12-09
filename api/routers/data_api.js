// put all data explore related routes in this unit

var express = require('express');
var User = require('../models/user');
var Attempt = require('../models/Attempt');

module.exports = function(app, apiRoutes) {

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


    var queryPageData = function(paramsObj, callback) {
        var ObjectId = require('mongoose').Types.ObjectId;
        var id = paramsObj.lastid;
        var queryObj = (id > 0) ? {
            '_id': {
                $gt: id
            }
        } : {};
        if (paramsObj.action === 'next') {
            paramsObj.collection.
            find(queryObj).
            skip(paramsObj.skip).
            limit(paramsObj.limit).
            sort({
                '_id': -1
            }).
            exec(callback);
        } else if (paramsObj.action === 'prev') {
            paramsObj.collection.
            find(queryObj).
            skip(paramsObj.skip).
            limit(paramsObj.limit).
            sort({
                '_id': -1
            }).
            exec(callback);
        }
    };


    // route to return all attempts logs (GET http://localhost:8080/api/logs)
    apiRoutes.get('/attempts', function(req, res) {
        Attempt.find({}, function(err, attempts) {
            if (err) console.log(err);
            var lastid = attempts[attempts.length - 1]._id;

            res.json({
                success: true,
                data: attempts,
                lastid: lastid,
                message: 'Operation Success!'
            });
        });
    });


    // route to return all attempts logs (GET http://localhost:8080/api/logs)
    apiRoutes.get('/attempts/:action/:lastid/:skip/:limit', function(req, res) {

        var action = req.params.action;
        console.log(action);
        var skip = req.params.skip;
        var limit = req.params.limit || 5;
        var lastid = req.params.lastid;
        var pagecount = Attempt.find().count({}, function(err, count) {

            var params = {
                lastid: lastid,
                limit: limit,
                skip: skip,
                action: action,
                collection: Attempt
            };
            queryPageData(params, function(err, attempts) {
                if (err) console.log(err);
                var lastid = 0;
                if (attempts && attempts.length > 0) {
                    lastid = attempts[attempts.length - 1]._id;
                }

                res.json({
                    success: true,
                    data: attempts,
                    lastid: lastid,
                    pagecount: Math.round(count / limit),
                    message: 'Operation Success!'
                });

            });


        });



    });
    return apiRoutes;
}
