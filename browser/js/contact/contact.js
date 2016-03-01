app.config(function ($stateProvider) {
    $stateProvider.state('contact', {
        url: '/contact',
        onEnter: function() {
            $('html, body').animate({
                scrollTop: $("#footer").offset().top
            }, 1000);
        },
    });
});
