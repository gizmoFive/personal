app.config(function ($stateProvider) {
    $stateProvider.state('Code-E', {
        url: '/projects/code-E',
        templateUrl: 'js/projects/Code-E/Code-E.html',
        onEnter: ($document, $rootScope) => {
          $rootScope.hidden = true;
        },
        onExit: ($rootScope, $location) => {
          $rootScope.hidden = false;
          $rootScope.unAnimated = false;
          $location.path('/projects');
      }
    });
});
