app.config(function ($stateProvider) {
    $stateProvider.state('noto', {
        url: '/projects/noto',
        templateUrl: 'js/projects/Noto/Noto.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        }
    });
});
