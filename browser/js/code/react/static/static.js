app.config(function ($stateProvider) {
    $stateProvider.state('static', {
        url: '/code/react/static',
        templateUrl: 'js/code/react/static/static.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        }
    });
});
