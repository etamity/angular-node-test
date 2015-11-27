 var request = require("request");
 var base_url = "http://localhost:8080/"

 describe("Rest Api Test", function() {

     // Test authentication api
     describe("POST /api/auth", function() {
         it("returns status code 200", function() {
             request.post({
                 url: base_url + 'api/auth',
                 form: {
                     username: 'admin',
                     password: 'password'
                 }
             }, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 expect(body.success).toBe(true);


                 // get all attempts data after login
                 describe("GET /api/attempts", function() {
                     it("returns status code 200", function() {
                         request.get(base_url + 'api/attempts', {
                             token: body.token,
                             admin: body.admin
                         }, function(error, response, body) {
                             expect(body.success).toBe(true);
                         });
                     });
                 });


             });
         });
     });

     // Test username case-insensitive logon
     describe("POST /api/auth", function() {
         it("returns status code 200", function() {
             request.post({
                 url: base_url + 'api/auth',
                 form: {
                     username: 'aDmIn', // case-insensitive
                     password: 'password'
                 }
             }, function(error, response, body) {
                 expect(response.statusCode).toBe(200);
                 expect(body.success).toBe(true);
             });
         });
     });

     // Test password case sensitive logon
     describe("POST /api/auth", function() {
         it("returns status code 200", function() {
             request.post({
                 url: base_url + 'api/auth',
                 form: {
                     username: 'aDmIn', // username  case-insensitive
                     password: 'Password' // case sensitive
                 }
             }, function(error, response, body) {
                 expect(body.success).toBe(false);
             });
         });
     });



 });
