app.config(function ($stateProvider) {
    $stateProvider.state('computerScience', {
        url: '/code/computerscience',
        templateUrl: 'js/code/computerScience/computerscience.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        },
        controller: 'compscictrl'
    });
});


app.controller('compscictrl', function ($scope) {
 $scope.thingy=0;
});
