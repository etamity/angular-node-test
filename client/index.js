'use strict';
angular.module('loginDemo', [
        'ngCookies',
        'ngRoute'
    ])
    .controller('LoginCtrl', function($scope, $timeout, LoginService, $cookieStore) {
        $scope.loginSuccess = false;
        $scope.loginFailure = false;
        $scope.valid = false;

        var rememberMe = $cookieStore.get('rememberMe');

        $scope.user = {
            username: rememberMe === true ? ($cookieStore.get('loginName') || '') : '',
            password: ''
        };

        $scope.logIn = function() {

            if ($scope.user.username !== '' && $scope.user.password !== '')
                LoginService.login($scope.user, callback);
        }
        var callback = function(result) {
            console.log(result.data);
            if (result.data.success === true) {
                $scope.loginSuccess = true;
                if ($scope.rememberMe) {
                    $cookieStore.put('rememberMe', $scope.rememberMe);
                } else {
                    $cookieStore.remove('rememberMe');
                }
                $cookieStore.put('loginName', $scope.user.username);
                $cookieStore.put('userToken', result.data.token);
                $cookieStore.put('admin', result.data.admin);
                window.location = "/#/admin";

            } else if (result.data.success === false) {
                $scope.loginFailure = true;
            }
            $timeout(function() {
                $scope.loginSuccess = false;
                $scope.loginFailure = false;
            }, 5000);
        }
    })
    .controller('AdminCtrl', function($scope, $timeout, $location, GetAttemptsService, LoginService, $cookieStore) {
        $scope.loadSuccess = false;
        $scope.loadFailure = false;
        $scope.valid = false;
        var token = $cookieStore.get('userToken') || '';
        if (!token || token === '') {
            $location.path('/');
        }
        var admin = $cookieStore.get('admin') || false;
        $scope.admin = admin;
        $scope.currentUser = $cookieStore.get('loginName') || '';
        $scope.getAttempts = function() {

            GetAttemptsService.loadData(token, admin, callback);
        }
        var callback = function(result) {
            console.log(result);
            $scope.loadSuccess = result.data.success;
            $scope.loadFailure = !result.data.success;
            $scope.message = result.data.message;
            if ($scope.loadSuccess) {
                $scope.data = result.data.data;
            }

            $timeout(function() {
                $scope.loginSuccess = false;
                $scope.loginFailure = false;
            }, 5000);

        }

        $scope.logout = function() {
            LoginService.logout(function(result) {
                $scope.loadSuccess = result.data.success;
                $scope.loadFailure = !result.data.success;
                if (result.data.success === true) {

                    $scope.message = result.data.message;
                    $cookieStore.remove('loginName');
                    $cookieStore.remove('userToken');
                    $cookieStore.remove('admin');
                    $timeout(function() {
                        $scope.loginSuccess = false;
                        $scope.loginFailure = false;
                        $location.path('/');
                    }, 1000);

                } else {

                    $scope.message = result.data.message;
                    $timeout(function() {
                        $scope.loginSuccess = false;
                        $scope.loginFailure = false;
                    }, 5000);
                }


            });

        }

    })
    // provide http request service for each operation
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
        service.loadData = function(token, admin, callback) {
            $http({
                method: 'GET',
                url: "http://localhost:8080/api/attempts",
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
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/admin', {
                templateUrl: './views/dashboard.html',
                controller: 'AdminCtrl'
            })
            .otherwise({
                redirectTo: '/#/'
            });
    });
