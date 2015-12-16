app.config(function($stateProvider) {

    $stateProvider.state('home', {
        url: '/',
        onEnter: function() {
            $('html, body').animate({
                scrollTop: $("#top").offset().top
            }, 1000);
        },
    });
});