app.config(function ($stateProvider) {
    $stateProvider.state('nowait', {
        url: '/projects/Nowait',
        templateUrl: 'js/projects/Nowait/Nowait.html',
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
