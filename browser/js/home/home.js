app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homecontroller'
    });
});

app.controller('homecontroller', function ($rootScope, $scope) {
  $scope.message = '';
  setInterval(function(){ 
    if($scope.message !== 'Welcome!_') {
      $scope.message = 'Welcome!_'.slice(0, $scope.message.length+1);
      $scope.$digest();
    }
    else if( $scope.message === 'Welcome!_') $scope.message = $scope.message.slice(0,$scope.message.length-2);
  }, 300);
});
