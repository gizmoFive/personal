app.config(function ($stateProvider) {
    $stateProvider.state('d3', {
        url: '/code/d3',
        templateUrl: 'js/code/d3/d3state.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        }
    });
});
