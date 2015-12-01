app.directive('navbar', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'About', state: 'about' },
                { label: 'Projects', state: 'projects' },
                { label: 'Snippets', state: 'snippets' },
                { label: 'Just for fun', state: 'fun' }
            ];
        }

    };

});
