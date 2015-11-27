// routes management unit

var express = require('express');

module.exports = function(app) {
    var middleware = require('../middleware/auth')(app);
    var apiRoutes = express.Router();


    apiRoutes = require('./auth_api')(app, apiRoutes);
    // set up basic user token authentication
    apiRoutes.use(middleware.authentication);

    // set up middleware authentication for admin user accessing
    apiRoutes.use(middleware.adminAuth);

    apiRoutes = require('./data_api')(app, apiRoutes);

    return apiRoutes;
}
