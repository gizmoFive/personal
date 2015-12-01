app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope) {

jQuery( document ).ready(function( $ ) {
var $loofa = $('#tester');
console.log("loofapic", $loofa)
  // Code that uses jQuery's $ can follow here.
$loofa.click(function() {
  console.log("animate worked!");
})
});
});







// $loofa.hover(function() {
// TweenLite.fromTo($loofa, 1.5, {width:0, height:0}, {width:100, height:200});
// },
// function() {
// TweenLite.fromTo($loofa, 1.5, {width:100, height:200}, {width:0, height:0});
// } 
// );

