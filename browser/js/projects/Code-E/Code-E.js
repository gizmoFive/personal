app.config(function ($stateProvider) {
    $stateProvider.state('Code-E', {
        url: '/projects/code-E',
        templateUrl: 'js/projects/Code-E/Code-E.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        }
    });
});
