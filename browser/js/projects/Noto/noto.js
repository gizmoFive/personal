app.config(function ($stateProvider) {
    $stateProvider.state('noto', {
        url: '/projects/noto',
        templateUrl: 'js/projects/Noto/Noto.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          $('html, body').animate({
                    scrollTop: 0
                }, 0);
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        }
    });
});
