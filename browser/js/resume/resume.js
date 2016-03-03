app.factory('resumeFactory', function ($http) {
    return {
        getData: function() {
           return $http.get('api/resume', {responseType:'arraybuffer'}).then(function (res) {
                var file = new Blob([res.data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                return fileURL;
            });
        }
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('resume', {
        url: '/resume',
        templateUrl: 'js/resume/resume.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        },
        resolve: {
            resume : function(resumeFactory) {
                return resumeFactory.getData();
            }
        },
        controller: 'resumectrl'
    });
});


app.controller('resumectrl', function ($scope, resume, $sce) {
       $scope.resume = $sce.trustAsResourceUrl(resume);
});
