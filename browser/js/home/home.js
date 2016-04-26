app.config(function($stateProvider) {

    $stateProvider.state('home', {
        url: '/',
       	onEnter: ($document, $rootScope) => {
	        $rootScope.unAnimated = true;
	        const top = angular.element(document.getElementById('top'))
	          $document.scrollToElementAnimated(top, 0, 800)
        },
      	onExit: ($rootScope) => {
	        $rootScope.unAnimated = false;
      }
    });
});