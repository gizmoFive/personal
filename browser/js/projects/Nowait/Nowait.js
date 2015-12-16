app.config(function ($stateProvider) {
    $stateProvider.state('nowait', {
        url: '/projects/Nowait',
        templateUrl: 'js/projects/Nowait/Nowait.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        }
    });
});
