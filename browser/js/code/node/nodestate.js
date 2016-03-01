app.config(function ($stateProvider) {
    $stateProvider.state('node', {
        url: '/code/node',
        templateUrl: 'js/code/node/nodestate.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        }
    });
});
