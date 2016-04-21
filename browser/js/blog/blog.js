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
    var $blog = $(`#blog`);
    $scope.doneloading = false;
    var objIframe = document.getElementById(`blog`);    
    window.onmessage = (event) => {
      if (event.data == `doneloading`) { 
        $scope.doneloading = true;
        $scope.$digest();
      }
      else {
        objIframe.style.height = `0`;
        $blog.css(`height`, event.data);
      }
    };
});

