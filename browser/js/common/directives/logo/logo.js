app.directive('logo', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/logo/logo.html',
        // link: function($scope) {
        //     $scope.begin = 0;
        //     $scope.end = 3;
        //     $('html').on("mousemove", function(event) {
        //      $scope.begin = $scope.end;
        //      $scope.end = $scope.begin + 5;
        //      console.log($scope.begin);
        //      $scope.$digest();
        //     });
        //     setInterval(function(){
        //       $scope.end=$scope.begin=0;
        //     }, 500);
        // }
    };
});

