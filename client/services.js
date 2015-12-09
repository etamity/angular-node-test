angular.module('loginDemo')
    .factory("LoginService", function($http, $q) {
        var service = {};
        // login function
        service.login = function(userData, callback) {
                $http({
                    method: 'POST',
                    url: "http://localhost:8080/api/auth",
                    data: userData,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(response) {
                    callback(response);
                }, function(response) {
                    callback(response);
                });
            }
            // logout function
        service.logout = function(callback) {
            $http({
                method: 'GET',
                url: "http://localhost:8080/api/logout",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response) {
                callback(response);
            }, function(response) {
                callback(response);
            });
        }
        return service;
    })
    .factory("GetAttemptsService", function($http, $q) {
        var service = {};
        service.loadData = function(token, admin, queryObj, callback) {
            $http({
                method: 'GET',
                url: "http://localhost:8080/api/attempts/" + queryObj.action + "/" + queryObj.lastid + "/" + queryObj.skip + "/" + queryObj.limit,
                params: {
                    token: token,
                    admin: admin
                }
            }).then(function(response) {
                callback(response);
            }, function(response) {
                callback(response);
            });
        }
        return service;
    })
