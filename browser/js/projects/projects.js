app.config(function($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        onEnter: function() {
            var scrollpos = $(document).scrollTop();
            if(scrollpos < $('#projects').offset().top - 75 || scrollpos > $('#projects').offset().top + 75) {
                $('html, body').animate({
                    scrollTop: $("#projects").offset().top
                }, 1000);
            }
        },
        controller: 'projectcontroller'
    });
});


app.controller('projectcontroller', function ($rootScope, $scope) {

    $scope.changejumbo = function(num) {
        console.log(num);
        var $target = $('#li' + num);
        console.log($target);
        $target.click();
    };
});
angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function($scope, $timeout, $transition, $q) {}]).directive('carousel', [function() {
        return {

        };
    }]);
