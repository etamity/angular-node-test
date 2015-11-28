var request = require('request');

var base_url = "http://localhost:8080/"



describe("Rest Api Test", function() {

    // Test authentication api
    describe("POST /api/auth", function() {
        it("Login with admin user, returns status code 200", function(done) {
            request.post({
                url: base_url + 'api/auth',
                form: {
                    username: 'admin',
                    password: 'password'
                }
            }, function(error, response, body) {
                body = JSON.parse(body)
                expect(response.statusCode).toBe(200);
                expect(body.success).toBe(true);
                done();
            });
        });
    });

    // Test username case-insensitive logon
    describe("POST /api/auth", function() {
        it("Login with admin user with case-insensitive username,returns status code 200", function(done) {
            request.post({
                url: base_url + 'api/auth',
                form: {
                    username: 'aDmIn', // case-insensitive
                    password: 'password'
                }
            }, function(error, response, body) {
                body = JSON.parse(body)
                expect(response.statusCode).toBe(200);
                expect(body.success).toBe(true);
                done();
            });
        });
    });

    // Test password case sensitive logon
    describe("POST /api/auth", function() {
        it("Login with admin user with case sensitive password,returns status code 200, but success = false", function(done) {
            request.post({
                url: base_url + 'api/auth',
                form: {
                    username: 'manager', // username  case-insensitive
                    password: 'Password' // case sensitive
                }
            }, function(error, response, body) {
                body = JSON.parse(body)
                expect(body.success).toBe(false);
                done();
            });
        });
    });


    // Test logout api
    describe("POST /api/auth", function() {
        it("Login with admin user, returns status code 200", function(done) {
            request.post({
                url: base_url + 'api/auth',
                form: {
                    username: 'admin',
                    password: 'password'
                }
            }, function(error, response, body) {
                body = JSON.parse(body)
                expect(response.statusCode).toBe(200);
                expect(body.success).toBe(true);
                done();

                describe("GET /api/logout", function() {
                    it("Logout user, returns status code 200", function(done) {
                        request.get({
                            url: base_url + 'api/logout'
                        }, function(error, response, body) {
                            body = JSON.parse(body)
                            expect(response.statusCode).toBe(200);
                            expect(body.success).toBe(true);
                            done();
                        });
                    });
                });
            });
        });
    });

    // Test authentication api and get all attempts data after login
    describe("GET /api/auth", function() {
        it("Login with admin user", function(done) {
            request.post({
                url: base_url + 'api/auth',
                form: {
                    username: 'admin',
                    password: 'password'
                }
            }, function(error, response, body) {
                body = JSON.parse(body)
                expect(response.statusCode).toBe(200);
                expect(body.success).toBe(true);
                expect(body.admin).toBe(true);
                done();
                // get all attempts data after login
                describe("GET /api/attempts", function() {
                    it("get attempts data,returns status code 200", function(done) {
                        request.get({
                            url: base_url + 'api/attempts',
                            form: {
                                token: body.token,
                                admin: body.admin
                            }
                        }, function(error, response, body) {
                            body = JSON.parse(body)
                            expect(body.success).toBe(true);
                            done();
                        });
                    });
                });


            });
        });
    });



    // fail to get attempts data if didn't login
    describe("GET /api/attempts", function() {
        it("get attempts data,returns status code 200 , but success = false", function(done) {
            request.get({
                url: base_url + 'api/attempts'
            }, function(error, response, body) {
                body = JSON.parse(body)
                expect(body.success).toBe(false);
                done();
            });
        });
    });


});
