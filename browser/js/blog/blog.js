app.config(($stateProvider) => {
    $stateProvider.state(`blog`, {
        url: `/blog`,
        templateUrl: `js/blog/blog.html`,
        onEnter: ($rootScope) => {
          $rootScope.hidden = true;
          
        },
        onExit: ($rootScope) => {
          $rootScope.hidden = false;
        },
        controller: `blogctrl`
    });
});

 
app.controller(`blogctrl`, ($scope) => {
    const $blog = document.getElementById('blog');
    $scope.doneloading = false;   
    window.onmessage = (event) => {
      if (event.data == `doneloading`) { 
        $scope.doneloading = true;
        $scope.$digest();
      }
      else {
        $blog.style.height = '100vh'
      }
    };
});

