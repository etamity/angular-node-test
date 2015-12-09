angular.module('loginDemo')
    .controller('AdminCtrl', function($scope, $timeout, $location, GetAttemptsService, LoginService, $cookieStore) {
        $scope.loadSuccess = false;
        $scope.loadFailure = false;
        $scope.valid = false;
        $scope.itemLimit = 5;
        var token = $cookieStore.get('userToken') || '';
        if (!token || token === '') {
            $location.path('/');
        }
        var admin = $cookieStore.get('admin') || false;
        $scope.admin = admin;
        $scope.currentUser = $cookieStore.get('loginName') || '';

        var callback = function(result) {
            console.log(result);
            $scope.loadSuccess = result.data.success;
            $scope.loadFailure = !result.data.success;
            $scope.message = result.data.message;
            var pagesData = [];
            for (var i = 1; i < result.data.pagecount; i++) {
                pagesData.push(i);
            }
            $scope.pages = {
                count: result.data.pagecount,
                lastid: result.data.lastid,
                pagesData: pagesData,
                currentPageIndex: $cookieStore.get('currentPageIndex') || 1
            };
            if ($scope.loadSuccess) {
                $scope.items = result.data.data;
            }

            $timeout(function() {
                $scope.loginSuccess = false;
                $scope.loginFailure = false;
            }, 5000);

        }
        $cookieStore.put('currentPageIndex', $cookieStore.get('currentPageIndex') || 1)
        var queryObj = {
            action: 'next',
            limit: $scope.itemLimit,
            lastid: 0
        };

        if (admin === true) {
            GetAttemptsService.loadData(token, admin, queryObj, callback);
        }


        $scope.getAttempts = function(pageId) {
            console.log('getAttempts:', $scope);
            pageId = pageId || 1;
            var action = $cookieStore.get('currentPageIndex') > pageId ? 'prev' : 'next';
            $cookieStore.put('currentPageIndex', pageId);
            var queryObj = {
                action: action,
                limit: $scope.itemLimit,
                lastid: $scope.pages.lastid,
                skip: (pageId) * $scope.itemLimit
            };

            GetAttemptsService.loadData(token, admin, queryObj, callback);
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
                    }, 400);

                } else {

                    $scope.message = result.data.message;
                    $timeout(function() {
                        $scope.loginSuccess = false;
                        $scope.loginFailure = false;
                    }, 5000);
                }


            });

        }

    });
