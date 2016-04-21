app.config( ($stateProvider) => {
    $stateProvider.state(`computerScience`, {
        url: `/code/computerscience`,
        templateUrl: `js/code/computerScience/computerscience.html`,
        onEnter: ($rootScope) => {
          $rootScope.hidden = true;
          
        },
        onExit: ($rootScope) => {
          $rootScope.hidden = false;
        }
    });
});
