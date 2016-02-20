app.directive('navbar', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'About Me', state: 'about' },
                { label: 'Portfolio', state: 'projects' },
                { label: 'Get in Touch', state: 'contact' },
                { label: 'Blog', state: 'blog' },
                { label: 'Code', state: 'code' }
            ];
        }

    };

});
