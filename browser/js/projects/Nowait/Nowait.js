app.config(function ($stateProvider) {
    $stateProvider.state('nowait', {
        url: '/projects/Nowait',
        templateUrl: 'js/projects/Nowait/Nowait.html',
        onEnter: ($document, $rootScope) => {
          $rootScope.hidden = true;
        },
        onExit: ($rootScope, $location) => {
          $rootScope.hidden = false;
          $rootScope.unAnimated = false;
          $location.path('/projects')
      }
    });
});
