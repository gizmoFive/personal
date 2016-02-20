app.config(function ($stateProvider) {
    $stateProvider.state('angular', {
        url: '/code/angular/',
        templateUrl: 'js/code/angular/angularstate.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        },
        controller: 'angularctrl'
    });
});


app.controller('angularctrl', function ($scope) {

});
