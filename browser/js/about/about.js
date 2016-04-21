app.config(($stateProvider) => {

    $stateProvider.state(`about`, {
        url: `/about`,
        onEnter: () => {
          const scrollpos = $(document).scrollTop();
          if (scrollpos < $(`#about`).offset().top - 75 || scrollpos > $(`#about`).offset().top + 75) {
            $(`html, body`).animate({
                scrollTop: $(`#about`).offset().top -70
            }, 1000);
          }
        },
    });
});
