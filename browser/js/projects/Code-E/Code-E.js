app.config(function ($stateProvider) {
    $stateProvider.state('Code-E', {
        url: '/projects/code-E',
        templateUrl: 'js/projects/Code-E/Code-E.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          $('html, body').animate({
                    scrollTop: 0
                }, 0);
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
          setTimeout(function () {
          $('html, body').animate({
                    scrollTop: $("#projects").offset().top
                }, 0);
            
          }, 0);
        }
    });
});
