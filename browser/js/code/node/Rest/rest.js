app.config(function ($stateProvider) {
    $stateProvider.state('rest', {
        url: '/code/node/rest',
        templateUrl: 'js/code/node/Rest/rest.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        },
        controller: 'restctrl'
    });
});


app.controller('restctrl', function ($scope, $filter) {

});
