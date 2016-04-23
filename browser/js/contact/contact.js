app.config(function ($stateProvider) {
    $stateProvider.state('contact', {
        url: '/contact',
        onEnter: ($document, $rootScope) => {
        $rootScope.unAnimated = true;
        const footer = angular.element(document.getElementById('footer'))
          setTimeout(function() {
          $document.scrollToElementAnimated(footer, 100, 800)
        }, 0)
        },
      	onExit: ($rootScope) => {
        $rootScope.unAnimated = false;
      }
    });
});
