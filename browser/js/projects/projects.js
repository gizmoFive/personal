app.config(function ($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'js/projects/projects.html',
        controller: 'projectcontroller'
    });
});


app.controller('projectcontroller', function ($scope) {

  $scope.changejumbo = function(num) {
    console.log(num);
    var $target = $('#li'+num);
    console.log($target)
    $target.click();
  };

});

angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function        ($scope, $timeout, $transition, $q) {
}]).directive('carousel', [function() {
    return {

    }
}]);