app.config(function($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        onEnter: ($document, $rootScope) => {
        $rootScope.unAnimated = true;
        const projects = angular.element(document.getElementById('projects'))
        setTimeout(function() {
            $document.scrollToElementAnimated(projects, -75, 800)
        }, 0)        
        },
        onExit: ($rootScope) => {
        $rootScope.unAnimated = false;
      },
        controller: 'projectcontroller'
    });
});


app.controller('projectcontroller', function ($rootScope, $scope) {

    const getSiblings = function (element) {
        let siblings = [];
        let sibling = element.parentNode.firstChild;
        for ( ; sibling; sibling = sibling.nextSibling ) {
            if ( sibling.nodeType === 1 ) {
                siblings.push( sibling );
            }
        }
        return siblings;
    };

    const removeSiblingClasses = (node) => {
        let siblings = getSiblings(node)
        siblings.forEach(function(sibling) {
            sibling.classList.remove('active');
            sibling.classList.remove('slide-in');
            sibling.classList.remove('slide-in-reverse');
            sibling.classList.remove('slide-out');
            sibling.classList.remove('slide-out-reverse');
            sibling.classList.remove('next');
            sibling.classList.remove('prev');
        })
    }

    $scope.next = function() {
       let currentItem = document.getElementsByClassName('item active')[0];
       let siblings = getSiblings(currentItem);
       let idx = siblings.indexOf(currentItem) + 1 === siblings.length ?  0 : siblings.indexOf(currentItem) + 1;
       removeSiblingClasses(currentItem);
       currentItem.classList.add('slide-out')
       currentItem.classList.add('prev')
       currentItem.classList.remove('active');
       siblings[idx].classList.add('slide-in')
       siblings[idx].classList.add('active')
    }

    $scope.prev = function() {
       let currentItem = document.getElementsByClassName('item active')[0];
       let siblings = getSiblings(currentItem);
       let idx = siblings.indexOf(currentItem) - 1 === -1 ? siblings.length -1 : siblings.indexOf(currentItem) - 1;
       removeSiblingClasses(currentItem);
       currentItem.classList.add('slide-out-reverse')
       currentItem.classList.add('next')
       currentItem.classList.remove('active')
       siblings[idx].classList.add('slide-in-reverse')
       siblings[idx].classList.add('active')
    };

    $scope.changejumbo = function(name) {
        let targetItem = document.getElementById(name)
        let currentItem = document.getElementsByClassName('item active')[0];
        let siblings = getSiblings(currentItem);
        removeSiblingClasses(targetItem);
        targetItem.classList.add('active');
    };
});
