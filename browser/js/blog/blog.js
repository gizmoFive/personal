app.config(function ($stateProvider) {
    $stateProvider.state('blog', {
        url: '/blog',
        templateUrl: 'js/blog/blog.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        },
        controller: 'blogctrl'
    });
});

 
app.controller('blogctrl', function($scope) {
    var $blog = $('#blog');
    $scope.doneloading = false;
    var objIframe = document.getElementById('blog');    
    window.onmessage = function (event) {
      if (event.data == "doneloading") { 
        $scope.doneloading = true;
        $scope.$digest();
      }
      else {
      objIframe.style.height = '0';
      console.log(event.data);
      $blog.css('height', event.data);
      }
    };
    //     this.style.height =
    //         this.contentWindow.document.body.offsetHeight + 'px';
    // });
});

