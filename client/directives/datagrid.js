angular.module('loginDemo')
    .directive('tableAttempt', function() {
        var controller = function($scope, $cookieStore) {
            var currentPage = $cookieStore.get('currentPageIndex');
            $scope.currentPage = currentPage;
            $scope.gotoPage = function(pageid) {
                this.ctrl.onliclick(pageid);
            }
            $scope.prevPage = function() {
                var currentPage = $cookieStore.get('currentPageIndex');
                if (currentPage > 0) {

                    this.ctrl.onliclick($cookieStore.get('currentPageIndex'));
                    $cookieStore.put('currentPageIndex', --currentPage);
                    $scope.currentPage = currentPage;
                    console.log(currentPage);
                }
            };

            $scope.nextPage = function() {

                var currentPage = $cookieStore.get('currentPageIndex');
                if (currentPage < $scope.ctrl.pages.count) {
                    this.ctrl.onliclick($cookieStore.get('currentPageIndex'));
                    $cookieStore.put('currentPageIndex', ++currentPage);
                    $scope.currentPage = currentPage;
                    console.log(currentPage);
                }
            };
        };

        return {
            restrict: 'EA', // E :element A: attribe C:CSS <div class=page-nav / >  M: <!-- directive: page-nav -->
            scope: {
                items: '=',
                pages: '=',
                onliclick: '='
                    // 1. "@" (Text binding / one - way binding)
                    // 2. "=" (Direct model binding / two - way binding)
                    // 3. "&" (Behaviour binding / Method binding)
            },
            controller: controller,
            controllerAs: 'ctrl',
            link: function($scope, elem, attr, ctrl) {
                console.debug("link", $scope, elem, attr, ctrl);

            },
            bindToController: true,
            templateUrl: './views/datagrid.html'
        }
    });
