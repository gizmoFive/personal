app.config(($stateProvider) => {

  $stateProvider.state(`about`, {
      url: `/about`,
      onEnter: ($document, $rootScope) => {
        $rootScope.unAnimated = true;
        const about = angular.element(document.getElementById('about'))
        setTimeout(function() {
          $document.scrollToElementAnimated(about, 100, 800)
        }, 0)
        },
      onExit: ($rootScope) => {
        $rootScope.unAnimated = false;
      }
  });
});
