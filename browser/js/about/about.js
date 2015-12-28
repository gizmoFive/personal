app.config(function($stateProvider) {

    $stateProvider.state('about', {
        url: '/about',
        onEnter: function() {
          var scrollpos = $(document).scrollTop();
          if(scrollpos < $('#about').offset().top - 75 || scrollpos > $('#about').offset().top + 75) {
            $('html, body').animate({
                scrollTop: $("#about").offset().top -70
            }, 1000);
          }
        },
    });
});
