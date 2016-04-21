app.config( ($stateProvider) => {
    $stateProvider.state(`angular`, {
        url: `/code/angular`,
        templateUrl: `js/code/angular/angularstate.html`,
        onEnter: ($rootScope) => {
          $rootScope.hidden = true;
        },
        onExit: ($rootScope) => {
          $rootScope.hidden = false;
        }
    });
});

