angular.module('loginDemo', [
        'ngCookies',
        'ngRoute'
    ])
    .controller('LoginCtrl', function($scope, $timeout, $cookieStore) {

    }).

config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './views/login.html',
            controller: 'LoginCtrl'
        })
        .otherwise({
            redirectTo: '/#/'
        });
});
