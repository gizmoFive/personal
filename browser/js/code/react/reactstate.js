app.config(function ($stateProvider) {
    $stateProvider.state('react', {
        url: '/code/react',
        templateUrl: 'js/code/react/reactstate.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        }
    });
});
