app.config(function ($stateProvider) {
    $stateProvider.state('contact', {
        url: '/contact',
        onEnter: function() {
              var scrollpos = $(document).scrollTop();
            $('html, body').animate({
                scrollTop: $("#footer").offset().top
            }, 1000);
        },
    });
});
