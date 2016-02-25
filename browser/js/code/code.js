app.config(function ($stateProvider) {
    $stateProvider.state('code', {
        url: '/code',
        templateUrl: 'js/code/code.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        },
        controller: 'codectrl'
    });
});


app.controller('codectrl', function ($scope, $rootScope, $state, $q) {
  $scope.interests = [
    {name: 'computerScience',
     'url' : 'http://s9.postimg.org/av72kc5wv/code_2_256.png',
     'message': 'General Computer Science Fun'},
    {name: 'd3',
     url : 'https://raw.githubusercontent.com/d3/d3-logo/master/d3.png',
     message: 'Data Vis Stuff'},
    {name: 'angular',
     url : 'https://angularjs.org/img/ng-logo.png',
     message: 'Angular'},
     {name: 'react',
     url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/2000px-React.js_logo.svg.png',
     message: 'React / Flux / Redux'},
    {name: 'node',
     url : 'https://nodejs.org/static/images/logos/nodejs-new-white-pantone.png',
     message: 'Back End Stuff'}
];
    
var placeholder;

$scope.mouseenterfn = function () {
    placeholder = this.interest.url;
    this.interest.url = '';
};

$scope.mouseleavefn = function () {
    this.interest.url = placeholder;
};

$scope.runfunction = function() {
        var that = this;
        $('#' + that.interest.name).fadeOut('slow', $q(function(resolve, reject) {
                resolve(that);
                }).then(function(that) {
                    $state.go(that.interest.name);
                }));

};

});