angular.module('loginDemo')
    .controller('LoginCtrl', function($scope, $timeout, LoginService, $cookieStore) {
        $scope.loginSuccess = false;
        $scope.loginFailure = false;
        $scope.valid = false;

        $scope.rememberMe = $cookieStore.get('rememberMe');

        $scope.user = {
            username: $scope.rememberMe === true ? ($cookieStore.get('loginName') || '') : '',
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
    });
