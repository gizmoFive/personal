app.config(function ($stateProvider) {
    $stateProvider.state('noto', {
        url: '/projects/noto',
        templateUrl: 'js/projects/Noto/Noto.html',
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
