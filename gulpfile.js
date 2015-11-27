var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');
var mongoose = require('mongoose');

//watch api folder if got anychanges, hot reload.
gulp.task('api', function() {
    nodemon({
        script: 'api/server.js',
        ext: 'js',
        env: {
            'NODE_ENV': 'development'
        }
    })
})
