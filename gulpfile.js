var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');
var mongoose = require('mongoose');
var User = require('./api/models/user');
var config = require('./api/config');
var webserver = require('gulp-webserver');

gulp.task('web', function() {
    gulp.src('client')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            port: 8000
        }));
});

gulp.task('api', function() {
    nodemon({
        script: 'api/server.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    })
})

//Create sample users
gulp.task('sampleData', function() {
    mongoose.connect(config.database, function(err) {
        if (err) throw err;
        console.log('Successfully connected to MongoDB');

        User.find({}).exec(function(err, users) {
            // if no users in the DB, seed them
            if (users.length === 0) {
                var sampleUsers = [{
                    username: 'user',
                    password: 'password',
                    admin: false
                }, {
                    username: 'manager',
                    password: 'password',
                    admin: false
                }, {
                    username: 'admin',
                    password: 'password',
                    admin: true
                }, {
                    username: 'developer',
                    password: 'password',
                    admin: false
                }, {
                    username: 'tester',
                    password: 'password',
                    admin: false
                }];

                sampleUsers.map(function(element) {
                    var user = new User({
                        username: element.username,
                        password: element.password,
                        admin: element.admin
                    });

                    // save the sample user
                    user.save(function(err) {
                        if (err) throw err;
                        console.log(element.username, 'created! admin user:', element.admin);
                    });
                });
            } else {
                console.log('Database already have users... Operation Ignored');
            }

        });


    });

})

gulp.task('default', ['api', 'web']);
