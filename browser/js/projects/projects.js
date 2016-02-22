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
        var $target = $('#li' + num);
        $target.click();
    };
});
