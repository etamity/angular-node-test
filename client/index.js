'use strict';
angular.module('loginDemo', [
        'ngCookies',
        'ngRoute'
    ])
    // provide http request service for each operation
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
    })
