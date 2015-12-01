app.directive('logo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/logo/logo.html',
        link: function () {
          // var rotated = 0;
          // var $logo = $('.logo');
          // var prevX = 0;
          // $('html').on("mousemove", function(event) {
          //   var mousediff = event.pageX - prevX;
          //   prevX = event.pageX;
          //   if (mousediff > 0) rotated+=5;
          //   else if (mousediff < 0) rotated -=5;
          // TweenMax.to($logo, 1.5, {rotation: rotated});
          // });
        }
    };
});

