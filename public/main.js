'use strict';

//hide loader
document.getElementById('preloader').style.display = "none";

window.app = angular.module('Main', ['ui.router', 'd3', 'duScroll', 'ngAnimate']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});

app.config(function ($stateProvider) {

    $stateProvider.state('about', {
        url: '/about',
        onEnter: function onEnter($document, $rootScope) {
            $rootScope.unAnimated = true;
            var about = angular.element(document.getElementById('about'));
            setTimeout(function () {
                $document.scrollToElementAnimated(about, 100, 800);
            }, 0);
        },
        onExit: function onExit($rootScope) {
            $rootScope.unAnimated = false;
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('blog', {
        url: '/blog',
        templateUrl: 'js/blog/blog.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        },
        controller: 'blogctrl'
    });
});

app.controller('blogctrl', function ($scope) {
    var $blog = document.getElementById('blog');
    $scope.doneloading = false;
    window.onmessage = function (event) {
        if (event.data == 'doneloading') {
            $scope.doneloading = true;
            $scope.$digest();
        } else {
            $blog.style.height = '100vh';
        }
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('code', {
        url: '/code',
        templateUrl: 'js/code/code.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        },
        controller: 'codectrl'
    });
});

app.controller('codectrl', function ($scope, $rootScope, $state, $q) {
    $scope.interests = [{ name: 'computerScience',
        'url': 'http://s9.postimg.org/av72kc5wv/code_2_256.png',
        'message': 'General Computer Science Fun' }, { name: 'd3',
        url: 'https://raw.githubusercontent.com/d3/d3-logo/master/d3.png',
        message: 'Data Vis Stuff' }, { name: 'angular',
        url: 'https://angularjs.org/img/ng-logo.png',
        message: 'Angular' }, { name: 'react',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/2000px-React.js_logo.svg.png',
        message: 'React / Flux / Redux' }, { name: 'node',
        url: 'https://nodejs.org/static/images/logos/nodejs-new-white-pantone.png',
        message: 'Back End Stuff' }];

    var placeholder;

    $scope.mouseenterfn = function () {
        placeholder = this.interest.url;
        this.interest.url = '';
    };

    $scope.mouseleavefn = function () {
        this.interest.url = placeholder;
    };

    $scope.runfunction = function () {
        $state.go(this.interest.name);
    };
});
app.config(function ($stateProvider) {
    $stateProvider.state('contact', {
        url: '/contact',
        onEnter: function onEnter($document, $rootScope) {
            $rootScope.unAnimated = true;
            var footer = angular.element(document.getElementById('footer'));
            setTimeout(function () {
                $document.scrollToElementAnimated(footer, 100, 800);
            }, 0);
        },
        onExit: function onExit($rootScope) {
            $rootScope.unAnimated = false;
        }
    });
});

angular.module('d3', []).factory('d3Service', ['$document', '$q', '$rootScope', function ($document, $q, $rootScope) {
    var d = $q.defer();
    function onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function () {
            d.resolve(window.d3);
        });
    }
    // Create a script tag with d3 as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'http://d3js.org/d3.v3.min.js';
    scriptTag.onreadystatechange = function () {
        if (this.readyState === 'complete') onScriptLoad();
    };
    scriptTag.onload = onScriptLoad;

    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);

    return {
        d3: function d3() {
            return d.promise;
        }
    };
}]);
app.config(function ($stateProvider) {

    $stateProvider.state('home', {
        url: '/',
        onEnter: function onEnter($document, $rootScope) {
            $rootScope.unAnimated = true;
            var top = angular.element(document.getElementById('top'));
            $document.scrollToElementAnimated(top, 0, 800);
        },
        onExit: function onExit($rootScope) {
            $rootScope.unAnimated = false;
        }
    });
});
app.config(function ($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        onEnter: function onEnter($document, $rootScope) {
            $rootScope.unAnimated = true;
            var projects = angular.element(document.getElementById('projects'));
            setTimeout(function () {
                $document.scrollToElementAnimated(projects, -75, 800);
            }, 0);
        },
        onExit: function onExit($rootScope) {
            $rootScope.unAnimated = false;
        },
        controller: 'projectcontroller'
    });
});

app.controller('projectcontroller', function ($rootScope, $scope) {

    var getSiblings = function getSiblings(element) {
        var siblings = [];
        var sibling = element.parentNode.firstChild;
        for (; sibling; sibling = sibling.nextSibling) {
            if (sibling.nodeType === 1) {
                siblings.push(sibling);
            }
        }
        return siblings;
    };

    var removeSiblingClasses = function removeSiblingClasses(node) {
        var siblings = getSiblings(node);
        siblings.forEach(function (sibling) {
            sibling.classList.remove('active');
            sibling.classList.remove('slide-in');
            sibling.classList.remove('slide-in-reverse');
            sibling.classList.remove('slide-out');
            sibling.classList.remove('slide-out-reverse');
            sibling.classList.remove('next');
            sibling.classList.remove('prev');
        });
    };

    $scope.next = function () {
        var currentItem = document.getElementsByClassName('item active')[0];
        var siblings = getSiblings(currentItem);
        var idx = siblings.indexOf(currentItem) + 1 === siblings.length ? 0 : siblings.indexOf(currentItem) + 1;
        removeSiblingClasses(currentItem);
        currentItem.classList.add('slide-out');
        currentItem.classList.add('prev');
        currentItem.classList.remove('active');
        siblings[idx].classList.add('slide-in');
        siblings[idx].classList.add('active');
    };

    $scope.prev = function () {
        var currentItem = document.getElementsByClassName('item active')[0];
        var siblings = getSiblings(currentItem);
        var idx = siblings.indexOf(currentItem) - 1 === -1 ? siblings.length - 1 : siblings.indexOf(currentItem) - 1;
        removeSiblingClasses(currentItem);
        currentItem.classList.add('slide-out-reverse');
        currentItem.classList.add('next');
        currentItem.classList.remove('active');
        siblings[idx].classList.add('slide-in-reverse');
        siblings[idx].classList.add('active');
    };

    $scope.changejumbo = function (name) {
        var targetItem = document.getElementById(name);
        var currentItem = document.getElementsByClassName('item active')[0];
        var siblings = getSiblings(currentItem);
        removeSiblingClasses(targetItem);
        targetItem.classList.add('active');
    };
});

app.factory('resumeFactory', function ($http) {
    return {
        getData: function getData() {
            return $http.get('api/resume', { responseType: 'arraybuffer' }).then(function (res) {
                var file = new Blob([res.data], { type: 'application/pdf' });
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
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        },
        resolve: {
            resume: function resume(resumeFactory) {
                return resumeFactory.getData();
            }
        },
        controller: 'resumectrl'
    });
});

app.controller('resumectrl', function ($scope, resume, $sce) {

    $scope.resume = $sce.trustAsResourceUrl(resume);
});

app.config(function ($stateProvider) {
    $stateProvider.state('angular', {
        url: '/code/angular',
        templateUrl: 'js/code/angular/angularstate.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('computerScience', {
        url: '/code/computerscience',
        templateUrl: 'js/code/computerScience/computerscience.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('d3', {
        url: '/code/d3',
        templateUrl: 'js/code/d3/d3state.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('node', {
        url: '/code/node',
        templateUrl: 'js/code/node/nodestate.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('react', {
        url: '/code/react',
        templateUrl: 'js/code/react/reactstate.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('Code-E', {
        url: '/projects/code-E',
        templateUrl: 'js/projects/Code-E/Code-E.html',
        onEnter: function onEnter($document, $rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope, $location) {
            $rootScope.hidden = false;
            $rootScope.unAnimated = false;
            $location.path('/projects');
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('noto', {
        url: '/projects/noto',
        templateUrl: 'js/projects/Noto/Noto.html',
        onEnter: function onEnter($document, $rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope, $location) {
            $rootScope.hidden = false;
            $rootScope.unAnimated = false;
            $location.path('/projects');
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('nowait', {
        url: '/projects/Nowait',
        templateUrl: 'js/projects/Nowait/Nowait.html',
        onEnter: function onEnter($document, $rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope, $location) {
            $rootScope.hidden = false;
            $rootScope.unAnimated = false;
            $location.path('/projects');
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('filters', {
        url: '/code/angular/filters',
        templateUrl: 'js/code/angular/filters/filters.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        },
        controller: 'filtersctrl'
    });
});

app.controller('filtersctrl', function ($scope, $filter) {
    $scope.exampleText = {
        "ipsum": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "hipsum": "Pour-over whatever fashion axe echo park swag, kombucha locavore fingerstache cornhole church-key gentrify pop-up. Ethical seitan quinoa pabst single-origin coffee church-key. Venmo yuccie leggings +1 vice synth. Waistcoat lomo retro gochujang godard, cold-pressed craft beer swag squid sustainable typewriter quinoa tattooed. Cray PBR&B mixtape, humblebrag neutra marfa before they sold out single-origin coffee tofu cred YOLO irony. Cold-pressed twee iPhone typewriter, flexitarian readymade banjo mlkshk polaroid. Mlkshk synth umami, green juice neutra kitsch bitters.\
Gastropub letterpress cornhole, tacos schlitz freegan ennui cliche. Photo booth single-origin coffee keytar, post-ironic truffaut you probably haven't heard of them sustainable godard direct trade waistcoat VHS venmo street art. Raw denim seitan sustainable jean shorts fanny pack. Bicycle rights church-key keytar +1 photo booth tattooed, biodiesel pitchfork asymmetrical pug fap pork belly chartreuse intelligentsia. Farm-to-table yuccie gentrify authentic put a bird on it. Literally tousled affogato pug direct trade crucifix green juice, normcore bitters ramps seitan you probably haven't heard of them 3 wolf moon church-key swag. PBR&B brooklyn sustainable, tote bag pickled before they sold out everyday carry food truck crucifix wayfarers forage godard lumbersexual.\
Tofu affogato swag distillery, umami gentrify humblebrag squid franzen deep v kale chips street art brunch leggings gluten-free. Tilde heirloom fixie XOXO thundercats readymade meditation, next level franzen tattooed. Cronut pour-over semiotics pop-up neutra. Direct trade sustainable mlkshk, narwhal put a bird on it church-key twee before they sold out cray man braid locavore. Microdosing readymade cred offal, seitan hashtag deep v. Master cleanse cred chia keffiyeh. Vice plaid godard whatever.\
Drinking vinegar gastropub neutra, celiac biodiesel forage readymade migas photo booth butcher chartreuse kale chips. Typewriter tacos mixtape umami literally yr. DIY austin messenger bag kinfolk bicycle rights fixie, portland truffaut thundercats seitan tofu pork belly. Taxidermy kale chips tofu roof party fanny pack. Man braid sustainable seitan ethical. Wolf taxidermy selfies, synth kinfolk before they sold out sartorial echo park disrupt direct trade. Drinking vinegar typewriter neutra next level, gochujang XOXO brunch pickled.",
        'testNumber': 1002301237,
        'testArray': ['Fry', 'Professor', 'Hermes', 'Professor', 'Leela', 'Bender', 'Kif', 'Nibbler', 7849930, { 'kittens': 'feline', 'puppies': 'canine' }, true, false, null, undefined, '', 0],
        'testObject': {
            "glossary": {
                "title": "example glossary",
                "GlossDiv": {
                    "title": "S",
                    "GlossList": {
                        "GlossEntry": {
                            "ID": "SGML",
                            "SortAs": "SGML",
                            "GlossTerm": "Standard Generalized Markup Language",
                            "Acronym": "SGML",
                            "Abbrev": "ISO 8879:1986",
                            "GlossDef": {
                                "para": "A meta-markup language, used to create markup languages such as DocBook.",
                                "GlossSeeAlso": ["GML", "XML"]
                            },
                            "GlossSee": "markup"
                        }
                    }
                }
            }
        }
    };

    $scope.currentText = $scope.exampleText.ipsum;

    $scope.myFilter = 'lowercase';
    $scope.applyFilter = function (model, filter) {
        return $filter(filter)(model);
    };

    var hasrun1 = false;
    var hasrun2 = false;

    $scope.$watch('userText', function () {
        if (hasrun2) {
            $scope.currentText = $scope.userText;
        }
        hasrun2 = true;
    });

    $scope.$watch('myInput', function () {
        if (hasrun1) {
            $scope.currentText = $scope.exampleText[$scope.myInput];
        }
        hasrun1 = true;
    });

    $scope.runthisfunc = function () {
        $scope.currentText = document.getElementById('theTextArea').value;
        $scope.applyFilter($scope.currentText, $scope.myFilter);
    };
});

/// custom filters

app.filter('reverse', function () {
    return function (input) {
        input = input || ' ';
        var out = "";
        for (var i = 0; i < input.length; i++) {
            out = input.charAt(i) + out;
        }
        return out;
    };
});

app.filter('deletePunctuation', function () {
    return function (input) {
        if (typeof input !== 'string') input = ' ';
        var re = /\w+/g;
        return input.match(re).join(' ');
    };
});

app.filter('onlyPunctuation', function () {
    return function (input) {
        if (typeof input !== 'string') input = ' ';
        var re = /\W+/g;
        return input.match(re).join(' ');
    };
});

app.filter('sort', function () {
    return function (input) {
        return input.sort();
    };
});

app.filter('unique', function () {
    return function (input) {
        if (typeof input === 'string') input = JSON.parse(input);
        return input.filter(function (item, index) {
            return input.indexOf(item) === index;
        });
    };
});

app.filter('truthy', function () {
    return function (input) {
        if (typeof input === 'string') input = JSON.parse(input);
        return input.filter(function (item) {
            return !!item;
        });
    };
});

app.filter('falsy', function () {
    return function (input) {
        if (typeof input === 'string') input = JSON.parse(input);
        return input.filter(function (item) {
            return !item;
        });
    };
});

'use strict';

app.filter('maptofa', function () {
    return function (input) {
        if (input === 'squiggle') return 'scribd';else if (input === 'oval') return 'lemon-o';else return input;
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('set', {
        url: '/code/angular/set',
        templateUrl: 'js/code/angular/set/set.html',
        controller: 'HomeController',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        }
    });
});

app.factory('cardsFactory', function ($http) {
    return {
        getAllCards: function getAllCards() {
            return $http.get('api/cards').then(function (cards) {
                return cards.data;
            });
        }
    };
});

app.controller('HomeController', function ($scope, $http, $interval, cardsFactory, methodsFactory) {

    //Local and scope vars.

    $scope.message = [['COMPUTER\'S SETS:'], ['YOUR SETS:']];
    $scope.computerscore = 0;
    $scope.playerscore = 0;
    $scope.playTimer = 45;
    var playerSet = [],
        gamerunning = undefined;

    // Ajax call for cards
    cardsFactory.getAllCards().then(function (cards) {
        $scope.allCards = _.shuffle(cards);
        $scope.table = $scope.allCards.splice(0, 12);
    });

    // Game watch functions

    $scope.$watch('table.length', function () {
        if ($scope.table) {
            if ($scope.table.length < 12 || !checkForWinners().length) {
                if ($scope.allCards.length) {
                    addThreeCards();
                } else if (!checkForWinners().length && !$scope.allCards.length) {
                    $interval.cancel(gamerunning);
                    // showmodal();
                }
            }
        }
    });

    $scope.$watch('playTimer', function () {
        if ($scope.playTimer === 0) {
            computerMove();
        }
    });

    // Controller methods

    var checkForWinners = function checkForWinners() {
        var winners = methodsFactory.generatePotentials($scope.table).filter(function (potentialSet) {
            return methodsFactory.validateSet(potentialSet);
        });
        return winners;
    };

    var addThreeCards = function addThreeCards() {
        if ($scope.allCards.length >= 3) {
            $scope.table = $scope.table.concat($scope.allCards.splice(0, 3));
        } else {
            $scope.table = $scope.table.concat($scope.allCards.splice(0, $scope.allCards.length));
        }
    };

    var computerMove = function computerMove() {
        var currentSet = checkForWinners()[0];
        if (currentSet) {
            $scope.message[0].push(currentSet);
            _.remove(playerSet, function (playerCard) {
                return currentSet.indexOf(playerCard) !== -1;
            });
            _.remove($scope.table, function (tableCard) {
                return currentSet.indexOf(tableCard) !== -1;
            });
            $scope.computerscore++;
        }
    };

    $scope.cardSelected = function (input) {
        if (input.clicked) {
            input.clicked = !input.clicked;
            playerSet.splice(playerSet.indexOf(input.card), 1);
        } else if (playerSet.length < 3) {
            playerSet.push(input.card);
            input.clicked = !input.clicked;
        }
        if (playerSet.length === 3) {
            if (methodsFactory.validateSet(playerSet)) {
                _.remove($scope.table, function (tableCard) {
                    return playerSet.indexOf(tableCard) !== -1;
                });
                playerSet = [];
                $scope.playerscore++;
                $scope.playTimer = 45;
            }
        }
    };

    // Button Methods

    $scope.logScore = function () {
        console.log($scope.message);
    };

    $scope.cheat = function () {
        var currentSet = checkForWinners()[0];
        if (currentSet) {
            $scope.message[1].push(currentSet);
            _.remove($scope.table, function (tableCard) {
                return currentSet.indexOf(tableCard) !== -1;
            });
            $scope.playerscore++;
        }
    };

    $scope.playWholeGame = function () {
        gamerunning = $interval(function () {
            $scope.cheat();
        }, 100);
    };

    // Timer

    $interval(function () {
        if ($scope.playTimer === 0) {
            $scope.playTimer = 45;
        }
        $scope.playTimer--;
    }, 1000);

    // game end Modal

    // var showmodal = function showmodal() {

    //     var endModal = $uibModal.open({
    //         animation: true,
    //         templateUrl: '/pre-build/home/modal.html',
    //         controller: 'modalCtrl',
    //         size: 'lg',
    //         resolve: {
    //             winner: function winner() {
    //                 var theWinner = $scope.playerscore >= $scope.computerscore ? 'Player' : 'Computer';
    //                 return theWinner;
    //             }
    //         }
    //     });
    // };
});

//modal Controller

// app.controller('modalCtrl', function ($scope, $uibModalInstance, winner) {
//     $scope.reload = function () {
//         window.location.reload();
//     };
//     $scope.winner = winner;
// });

// Quick filter.

app.factory('methodsFactory', function () {
    return {
        generatePotentials: function generatePotentials(inputArr) {
            var output = [];
            var tempArr = [];
            var itemOne = inputArr.slice();
            while (itemOne.length) {
                tempArr.push(itemOne.shift());
                var itemTwo = itemOne.slice();
                while (itemTwo.length) {
                    tempArr.push(itemTwo.shift());
                    var itemThree = itemTwo.slice();
                    while (itemThree.length) {
                        tempArr.push(itemThree.shift());
                        output.push(tempArr);
                        tempArr = tempArr.slice(0, tempArr.length - 1);
                    }
                    tempArr = tempArr.slice(0, tempArr.length - 1);
                }
                tempArr = tempArr.slice(0, tempArr.length - 1);
            }
            return output;
        },
        validateSet: function validateSet(currSet) {
            var isSet = true;
            var masterset = [];
            // create a big array of all present values
            currSet.forEach(function (card) {
                masterset = masterset.concat(_.values(card));
            });
            //count the values, if any property has a count of 2, return false
            if (_.values(_.countBy(masterset)).indexOf(2) !== -1) {
                isSet = false;
            }
            // else return true
            return isSet;
        }
    };
});
app.config(function ($stateProvider) {
    $stateProvider.state('dijkstra', {
        url: '/code/computerScience/dijkstra',
        templateUrl: 'js/code/computerScience/dijkstra/dijkstras.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        },
        controller: 'dijkCtrl'
    });
});

app.controller('dijkCtrl', function ($scope) {
    // Initialize variables
    var initiallyCreated = false;
    var spritesheetLoaded = false;
    var currentPath = [];
    var world = [[]];
    var terrainSheet = new Image();
    terrainSheet.src = 'spritesheet.png';
    var terrainSheetReverse = new Image();
    terrainSheetReverse.src = 'spritesheetReverse.png';
    var goomba = new Image();
    goomba.src = 'goomba.png';
    var PAGEHEIGHT = 26;
    var PAGEWIDTH = 26;
    var TILEWIDTH = 32;
    var TILEHEIGHT = 32;
    var pathStart = [PAGEHEIGHT, PAGEWIDTH];
    var pathEnd = [0, 0];
    var canvas = document.getElementById('marioCanvas');
    canvas.width = PAGEWIDTH * TILEWIDTH;
    canvas.height = PAGEHEIGHT * TILEHEIGHT;
    var ctx = canvas.getContext("2d");
    terrainSheet.onload = loaded;

    //mobile check

    if (screen.width <= 1024) {
        PAGEHEIGHT = 22;
        PAGEWIDTH = 22;
        canvas.width = PAGEWIDTH * TILEWIDTH;
        canvas.height = PAGEHEIGHT * TILEHEIGHT;
    }
    function loaded() {
        console.log('Spritesheet loaded.');
        spritesheetLoaded = true;
        $scope.createWorld();
    }

    //GOOMBA CREATION, MARIO AND PIPE DRAGGING

    var dieGoomba = function dieGoomba(e) {
        var clickX = Math.floor(e.layerX / TILEWIDTH) * TILEWIDTH;
        var clickY = Math.floor(e.layerY / TILEHEIGHT) * TILEHEIGHT;
        var gridPosition = world[clickX / TILEWIDTH][clickY / TILEHEIGHT];
        if (gridPosition === 2 || gridPosition === 3) return;
        world[clickX / TILEWIDTH][clickY / TILEHEIGHT] = 0;
        ctx.drawImage(terrainSheet, 0 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, clickX, clickY, TILEWIDTH, TILEHEIGHT);
    };

    var makeGoomba = function makeGoomba(e) {
        var clickX = undefined;
        var clickY = undefined;
        if (e.layerX !== undefined && e.layerY !== undefined) {
            clickX = Math.floor(e.layerX / TILEWIDTH) * TILEWIDTH;
            clickY = Math.floor(e.layerY / TILEHEIGHT) * TILEHEIGHT;
        } else if (e.touches[0] !== undefined) {
            clickY = Math.floor((e.touches[0].pageY - canvas.offsetTop) / TILEHEIGHT) * TILEHEIGHT;
            clickX = Math.floor((e.touches[0].pageX - canvas.offsetLeft) / TILEWIDTH) * TILEWIDTH;
        }
        var gridPosition = world[clickX / TILEWIDTH][clickY / TILEHEIGHT];
        if (gridPosition === 2 || gridPosition === 3) return;
        ctx.drawImage(goomba, clickX, clickY);
        world[clickX / TILEWIDTH][clickY / TILEHEIGHT] = 'goomba';
    };

    var pipeMove = function pipeMove(e) {
        var clickX = undefined;
        var clickY = undefined;
        if (e.layerX !== undefined && e.layerY !== undefined) {
            clickX = Math.floor(e.layerX / TILEWIDTH) * TILEWIDTH;
            clickY = Math.floor(e.layerY / TILEHEIGHT) * TILEHEIGHT;
        } else {
            clickY = Math.floor((e.touches[0].pageY - canvas.offsetTop) / TILEHEIGHT) * TILEHEIGHT;
            clickX = Math.floor((e.touches[0].pageX - canvas.offsetLeft) / TILEWIDTH) * TILEWIDTH;
        }
        for (var x = 0; x < PAGEWIDTH; x++) {
            for (var y = 0; y < PAGEHEIGHT; y++) {
                if (world[x][y] === 2) {
                    world[x][y] = 0;
                    ctx.drawImage(terrainSheet, 0 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x * TILEWIDTH, y * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                }
            }
        }
        ctx.drawImage(terrainSheet, 1 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, clickX, clickY, TILEWIDTH, TILEHEIGHT);
        world[clickX / TILEWIDTH][clickY / TILEHEIGHT] = 2;
    };

    var marioMove = function marioMove(e) {
        var clickX = undefined;
        var clickY = undefined;
        if (e.layerX !== undefined && e.layerY !== undefined) {
            clickX = Math.floor(e.layerX / TILEWIDTH) * TILEWIDTH;
            clickY = Math.floor(e.layerY / TILEHEIGHT) * TILEHEIGHT;
        } else if (e.touches[0] !== undefined) {
            clickY = Math.floor((e.touches[0].pageY - canvas.offsetTop) / TILEHEIGHT) * TILEHEIGHT;
            clickX = Math.floor((e.touches[0].pageX - canvas.offsetLeft) / TILEWIDTH) * TILEWIDTH;
        }
        for (var x = 0; x < PAGEWIDTH; x++) {
            for (var y = 0; y < PAGEHEIGHT; y++) {
                if (world[x][y] === 3) {
                    world[x][y] = 0;
                    ctx.drawImage(terrainSheet, 0 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x * TILEWIDTH, y * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                }
            }
        }
        ctx.drawImage(terrainSheet, 2 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, clickX, clickY, TILEWIDTH, TILEHEIGHT);
        world[clickX / TILEWIDTH][clickY / TILEHEIGHT] = 3;
    };

    //EVENT LISTENERS

    // CLICKS

    canvas.ondblclick = function (e) {
        dieGoomba(e);
    };
    canvas.onclick = function (e) {
        makeGoomba(e);
    };
    canvas.onmousedown = function (e) {
        var clickX = Math.floor(e.layerX / TILEWIDTH) * TILEWIDTH;
        var clickY = Math.floor(e.layerY / TILEHEIGHT) * TILEHEIGHT;
        var gridPosition = world[clickX / TILEWIDTH][clickY / TILEHEIGHT];
        if (gridPosition === 2) {
            canvas.onmousemove = pipeMove;
        } else if (gridPosition === 3) {
            canvas.onmousemove = marioMove;
        } else {
            canvas.onmousemove = makeGoomba;
        }
    };

    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    };

    // TOUCHES

    canvas.addEventListener('touchstart', function (e) {
        var clickX = Math.floor((e.touches[0].pageX - canvas.offsetLeft) / TILEWIDTH) * TILEWIDTH;
        var clickY = Math.floor((e.touches[0].pageY - canvas.offsetTop) / TILEHEIGHT) * TILEHEIGHT;
        var gridPosition = world[clickX / TILEWIDTH][clickY / TILEHEIGHT];
        if (gridPosition === 2) {
            canvas.addEventListener('touchmove', pipeMove, false);
        } else if (gridPosition === 3) {
            canvas.addEventListener('touchmove', marioMove, false);
        } else {
            canvas.addEventListener('touchmove', makeGoomba, false);
        }
    }, false);

    canvas.addEventListener('touchend', function (e) {
        canvas.removeEventListener('touchmove', pipeMove);
        canvas.removeEventListener('touchmove', marioMove);
        canvas.removeEventListener('touchmove', makeGoomba);
    });
    // canvas.addEventListener('touchend', canvas.onmouseup, false)
    // canvas.ontouchend = canvas.onmouseup;

    //USER INTERACTIONS

    $scope.createWorld = function (goombas) {
        console.log('Creating world...');
        initiallyCreated = true;
        // create emptiness
        for (var x = 0; x < PAGEWIDTH; x++) {
            world[x] = [];
            for (var y = 0; y < PAGEHEIGHT; y++) {
                world[x][y] = 0;
            }
        }
        if (goombas) {
            // scatter goombas
            for (var x = 0; x < PAGEWIDTH; x++) {
                for (var y = 0; y < PAGEHEIGHT; y++) {
                    if (Math.random() > 0.7) {
                        world[x][y] = 'goomba';
                    }
                }
            }
        }
        world[Math.ceil(TILEWIDTH / 3)][Math.ceil(TILEHEIGHT / 3)] = 2;
        world[Math.ceil(TILEWIDTH / 3) + 1][Math.ceil(TILEHEIGHT / 3)] = 3;
        redraw();
    };

    $scope.pathToPipe = function () {
        // find start and end points and then create path array
        for (var i = 0; i < world.length; i++) {
            for (var j = 0; j < world[i].length; j++) {
                if (world[i][j] === 2) pathStart = [i, j];
                if (world[i][j] === 3) pathEnd = [i, j];
            }
        }
        var path = 0;
        var mario = 0;
        var pipePos = currentPath.shift();
        currentPath = findPath(world, pathStart, pathEnd);
        currentPath = currentPath.reverse();

        // animate path function
        function animate(path) {
            if (currentPath[path] !== undefined) {
                ctx.drawImage(terrainSheet, 4 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, currentPath[path][0] * TILEWIDTH, currentPath[path][1] * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
            } else if (currentPath[path] === undefined && currentPath[mario] !== undefined) {
                for (var x = 0; x < PAGEWIDTH; x++) {
                    for (var y = 0; y < PAGEHEIGHT; y++) {
                        if (world[x][y] === 3) {
                            world[x][y] = 0;
                            ctx.drawImage(terrainSheet, 0 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x * TILEWIDTH, y * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                        }
                    }
                }
                var whichmario = mario % 2 === 0 ? 3 : 2;
                var marioSheet = terrainSheet;
                if (currentPath[mario + 1]) {
                    marioSheet = currentPath[mario][0] < currentPath[mario + 1][0] ? terrainSheet : terrainSheetReverse;
                }
                ctx.drawImage(marioSheet, whichmario * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, currentPath[mario][0] * TILEWIDTH, currentPath[mario][1] * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);

                world[currentPath[mario][0]][currentPath[mario][1]] = 3;
                mario++;
            } else {
                for (var x = 0; x < PAGEWIDTH; x++) {
                    for (var y = 0; y < PAGEHEIGHT; y++) {
                        if (world[x][y] === 3 || world[x][y] === 2) {
                            world[x][y] = 0;
                            ctx.drawImage(terrainSheet, 0 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x * TILEWIDTH, y * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                        }
                    }
                }
                return null;
            }
            path++;
            setTimeout(function () {
                animate(path);
            }, 120);
        }
        // INVOKE IT
        animate(path);
    };

    // DRAW FUNCTION

    function redraw() {
        if (!spritesheetLoaded) return;

        console.log('redrawing...');

        var spriteNum = 0;

        // clear the screen
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var x = 0; x < PAGEWIDTH; x++) {
            for (var y = 0; y < PAGEHEIGHT; y++) {
                // ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
                // lay down grass base
                ctx.drawImage(terrainSheet, 0 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x * TILEWIDTH, y * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                if (world[x][y] === 2) {
                    ctx.drawImage(terrainSheet, 1 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x * TILEWIDTH, y * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                }
                if (world[x][y] === 3) {
                    ctx.drawImage(terrainSheet, 2 * TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x * TILEWIDTH, y * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                }
                if (world[x][y] === 'goomba') {
                    ctx.drawImage(goomba, x * TILEWIDTH, y * TILEHEIGHT);
                }
            }
        }
    }

    ///// Djikstra's / A* Pathfinding

    function findPath(world, pathStart, pathEnd) {
        // shortcuts for speed
        var abs = Math.abs;
        var max = Math.max;
        var pow = Math.pow;
        var sqrt = Math.sqrt;

        var worldWidth = world[0].length;
        var worldHeight = world.length;
        var worldSize = worldWidth * worldHeight;

        // which heuristic should we use?
        // default: no diagonals (Manhattan)
        var distanceFunction = ManhattanDistance;
        var findNeighbours = function findNeighbours() {}; // empty

        function ManhattanDistance(Point, Goal) {
            // linear movement - no diagonals - just cardinal directions (NSEW)
            return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
        }

        // Neighbours functions, used by findNeighbours function
        // to locate adjacent available cells that aren't blocked

        // Returns every available North, South, East or West
        // cell that is empty. No diagonals,
        // unless distanceFunction function is not Manhattan
        function Neighbours(x, y) {
            var N = y - 1,
                S = y + 1,
                E = x + 1,
                W = x - 1,
                myN = N > -1 && canWalkHere(x, N),
                myS = S < worldHeight && canWalkHere(x, S),
                myE = E < worldWidth && canWalkHere(E, y),
                myW = W > -1 && canWalkHere(W, y),
                result = [];
            if (myN) result.push({ x: x, y: N });
            if (myE) result.push({ x: E, y: y });
            if (myS) result.push({ x: x, y: S });
            if (myW) result.push({ x: W, y: y });
            findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
            return result;
        }

        // returns every available North East, South East,
        // South West or North West cell - no squeezing through
        // "cracks" between two diagonals
        function DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result) {
            if (myN) {
                if (myE && canWalkHere(E, N)) result.push({ x: E, y: N });
                if (myW && canWalkHere(W, N)) result.push({ x: W, y: N });
            }
            if (myS) {
                if (myE && canWalkHere(E, S)) result.push({ x: E, y: S });
                if (myW && canWalkHere(W, S)) result.push({ x: W, y: S });
            }
        }

        // returns every available North East, South East,
        // South West or North West cell including the times that
        // you would be squeezing through a "crack"
        function DiagonalNeighboursFree(myN, myS, myE, myW, N, S, E, W, result) {
            myN = N > -1;
            myS = S < worldHeight;
            myE = E < worldWidth;
            myW = W > -1;
            if (myE) {
                if (myN && canWalkHere(E, N)) result.push({ x: E, y: N });
                if (myS && canWalkHere(E, S)) result.push({ x: E, y: S });
            }
            if (myW) {
                if (myN && canWalkHere(W, N)) result.push({ x: W, y: N });
                if (myS && canWalkHere(W, S)) result.push({ x: W, y: S });
            }
        }

        // returns boolean value (world cell is available and open)
        function canWalkHere(x, y) {
            return world[x] != null && world[x][y] != null && world[x][y] != 'goomba';
        };

        // Node function, returns a new object with Node properties
        // Used in the calculatePath function to store route costs, etc.
        function Node(Parent, Point) {
            var newNode = {
                // pointer to another Node object
                Parent: Parent,
                // array index of this Node in the world linear array
                value: Point.x + Point.y * worldWidth,
                // the location coordinates of this Node
                x: Point.x,
                y: Point.y,
                // the heuristic estimated cost
                // of an entire path using this node
                f: 0,
                // the distanceFunction cost to get
                // from the starting point to this node
                g: 0
            };

            return newNode;
        }

        // Path function, executes AStar algorithm operations
        function calculatePath() {
            // create Nodes from the Start and End x,y coordinates
            var mypathStart = Node(null, { x: pathStart[0], y: pathStart[1] });
            var mypathEnd = Node(null, { x: pathEnd[0], y: pathEnd[1] });
            // create an array that will contain all world cells
            var AStar = new Array(worldSize);
            // list of currently open Nodes
            var Open = [mypathStart];
            // list of closed Nodes
            var Closed = [];
            // list of the final output array
            var result = [];
            // reference to a Node (that is nearby)
            var myNeighbours;
            // reference to a Node (that we are considering now)
            var myNode;
            // reference to a Node (that starts a path in question)
            var myPath;
            // temp integer variables used in the calculations
            var length, max, min, i, j;
            // iterate through the open list until none are left
            while (length = Open.length) {
                max = worldSize;
                min = -1;
                for (i = 0; i < length; i++) {
                    if (Open[i].f < max) {
                        max = Open[i].f;
                        min = i;
                    }
                }
                // grab the next node and remove it from Open array
                myNode = Open.splice(min, 1)[0];
                // is it the destination node?
                if (myNode.value === mypathEnd.value) {
                    myPath = Closed[Closed.push(myNode) - 1];
                    do {
                        result.push([myPath.x, myPath.y]);
                    } while (myPath = myPath.Parent);
                    // clear the working arrays
                    AStar = Closed = Open = [];
                    // we want to return start to finish
                    result.reverse();
                } else // not the destination
                    {
                        // find which nearby nodes are walkable
                        myNeighbours = Neighbours(myNode.x, myNode.y);
                        // test each one that hasn't been tried already
                        for (i = 0, j = myNeighbours.length; i < j; i++) {
                            myPath = Node(myNode, myNeighbours[i]);
                            if (!AStar[myPath.value]) {
                                // estimated cost of this particular route so far
                                myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
                                // estimated cost of entire guessed route to the destination
                                myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
                                // remember this new path for testing above
                                Open.push(myPath);
                                // mark this node in the world graph as visited
                                AStar[myPath.value] = true;
                            }
                        }
                        // remember this route as having no more untested options
                        Closed.push(myNode);
                    }
            } // keep iterating until the Open list is empty
            return result;
        }

        // actually calculate the a-star path!
        // this returns an array of coordinates
        // that is empty if no path is possible
        return calculatePath();
    } // end of findPath() function
});
app.config(function ($stateProvider) {
    $stateProvider.state('gol', {
        url: '/code/computerscience/gol',
        templateUrl: 'js/code/computerScience/gol/gol.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        },
        controller: 'golctrl'
    });
});

app.controller('golctrl', function ($scope) {

    var hasrun = false;
    $scope.playval = 'Play';
    $scope.golheight = $scope.golwidth = 25;

    function heightWidthChange() {
        if (hasrun) {
            var element = document.getElementsByTagName("tbody")[0];
            element.parentNode.removeChild(element);
            gameOfLife.height = $scope.golheight;
            gameOfLife.width = $scope.golwidth;
            gameOfLife.createAndShowBoard();
        }
        hasrun = true;
    }
    $scope.$watch('golheight', function () {
        heightWidthChange();
    });

    $scope.$watch('golwidth', function () {
        heightWidthChange();
    });

    var gameOfLife = {
        width: $scope.golwidth,
        height: $scope.golheight,
        stepInterval: null,

        createAndShowBoard: function createAndShowBoard() {
            // create <table> element
            var goltable = document.createElement("tbody");

            // build Table HTML
            var tablehtml = '';
            for (var h = 0; h < this.height; h++) {
                tablehtml += "<tr id='row+" + h + "'>";
                for (var w = 0; w < this.width; w++) {
                    tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
                }
                tablehtml += "</tr>";
            }
            goltable.innerHTML = tablehtml;

            // add table to the #board element
            var board = document.getElementById('board');
            board.appendChild(goltable);

            // once html elements are added to the page, attach events to them
            this.setupBoardEvents();
        },

        forEachCell: function forEachCell(iteratorFunc) {
            for (var h = 0; h < this.height; h++) {
                for (var w = 0; w < this.width; w++) {
                    var cell = document.getElementById(w + "-" + h);
                    if (cell) {
                        iteratorFunc(cell, w, h);
                    }
                }
            }
            /* 
              Write forEachCell here. You will have to visit
              each cell on the board, call the "iteratorFunc" function,
              and pass into func, the cell and the cell's x & y
              coordinates. For example: iteratorFunc(cell, x, y)
            */
        },

        setupBoardEvents: function setupBoardEvents() {
            var toggleCell = function toggleCell(e) {
                var cell = e.target;
                if (cell.getAttribute('data-status') == 'dead') {
                    cell.className = "alive";
                    cell.setAttribute('data-status', 'alive');
                } else {
                    cell.className = "dead";
                    cell.setAttribute('data-status', 'dead');
                }
            };
            var makeAlive = function makeAlive(e) {
                var cell = e.target;
                cell.className = "alive";
                cell.setAttribute('data-status', 'alive');
            };
            var board = document.getElementById('board');
            board.addEventListener('touchstart', function () {
                board.addEventListener('touchmove', makeAlive);
            });
            board.addEventListener('touchend', function () {
                board.removeEventListener('touchmove');
            });
            board.onmousedown = function () {
                board.onmousemove = makeAlive;
                board.addEventListener('touchstart');
            };
            board.onmouseup = function () {
                board.onmousemove = null;
            };
            board.onclick = toggleCell;

            this.addButtonEvents();
        },

        addButtonEvents: function addButtonEvents() {
            var step_btn = document.getElementById('step_btn');
            if (step_btn) {
                step_btn.onclick = this.step.bind(this);
            }

            var play_btn = document.getElementById('play_btn');
            if (play_btn) {
                play_btn.onclick = this.enableAutoPlay.bind(this);
            }

            var reset_btn = document.getElementById('reset_btn');
            if (reset_btn) {
                reset_btn.onclick = this.reset.bind(this);
            }

            var clear_btn = document.getElementById('clear_btn');
            if (clear_btn) {
                clear_btn.onclick = this.clearBoard.bind(this);
            }
        },

        reset: function reset() {
            this.forEachCell(function (cell) {
                if (Math.random() <= .5) {
                    cell.className = "alive";
                    cell.setAttribute('data-status', 'alive');
                } else {
                    cell.className = "dead";
                    cell.setAttribute('data-status', 'dead');
                }
            });
        },
        clearBoard: function clearBoard() {
            this.forEachCell(function (cell) {
                cell.className = "dead";
                cell.setAttribute('data-status', 'dead');
            });
        },
        step: function step() {
            this.forEachCell(function (cell, x, y) {
                var aliveNeighbors = 0,
                    neigh_id,
                    ncell;

                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        neigh_id = x + i + '-' + (y + j);
                        if (!(i === 0 && j === 0)) {
                            ncell = document.getElementById(neigh_id);
                            if (ncell && ncell.getAttribute('data-status') == "alive") {
                                aliveNeighbors++;
                            }
                        }
                    }
                }

                cell.setAttribute('data-neighbors', aliveNeighbors);
            });

            var determineNextState = function determineNextState(cell) {
                var currState = cell.getAttribute('data-status');
                var numNeighbors = parseInt(cell.getAttribute('data-neighbors'));
                var nextState = currState;

                if (currState == "alive" && (numNeighbors < 2 || numNeighbors > 3)) {
                    nextState = "dead";
                } else if (currState == "dead" && numNeighbors === 3) {
                    nextState = "alive";
                }
                return nextState;
            };

            this.forEachCell(function (cell, x, y) {
                var nextState = determineNextState(cell);
                cell.setAttribute('data-status', nextState);
                cell.setAttribute('data-neighbors', -1);
                cell.className = nextState;
            });
        },

        enableAutoPlay: function enableAutoPlay() {
            if (!this.stepInterval) {
                var self = this;
                this.stepInterval = setInterval(function () {
                    self.step();
                }, 1000 / $scope.playspeed);
            } else {
                clearInterval(this.stepInterval);
                this.stepInterval = null;
            }
            if ($scope.playval === 'Play') {
                $scope.playval = 'Stop';
                document.getElementById('play_btn').style.backgroundColor = 'red';
            } else {
                $scope.playval = 'Play';
                document.getElementById('play_btn').style.backgroundColor = '#337ab7';
            }
            $scope.$digest();
        },
        loadpreset: function loadpreset(arr) {
            if (arr) {
                this.clearBoard();
                this.forEachCell(function (cell) {
                    if (arr.indexOf(cell.id) !== -1) {
                        cell.className = "alive";
                        cell.setAttribute('data-status', 'alive');
                    } else {
                        cell.className = "dead";
                        cell.setAttribute('data-status', 'dead');
                    }
                });
            }
        }

    };
    var presetObj = {
        'Gosper Glider Gun': [45, 45, '4-10', '5-10', '4-11', '5-11', '14-10', '14-11', '14-12', '15-9', '15-13', '16-8', '17-8', '16-14', '17-14', '18-11', '19-9', '19-13', '20-10', '20-11', '20-12', '21-11', '24-8', '24-9', '24-10', '25-8', '25-9', '25-10', '26-7', '26-11', '28-6', '28-7', '28-11', '28-12', '38-8', '38-9', '39-8', '39-9'],
        '10-cell Stable': [25, 25, '7-12', '8-12', '9-12', '10-12', '11-12', '12-12', '13-12', '14-12', '15-12', '16-12'],
        'Flippers': [25, 25, '4-3', '5-3', '3-3', '1-5', '1-6', '1-7', '7-5', '7-6', '7-7', '3-9', '4-9', '5-9', '17-5', '18-5', '19-5', '15-7', '15-8', '15-9', '21-7', '21-8', '21-9', '17-11', '18-11', '19-11', '10-11', '10-12', '10-13', '10-17', '10-18', '10-19', '6-15', '7-15', '8-15', '12-15', '13-15', '14-15'],
        'Glider Collider': [29, 26, '1-0', '27-0', '2-1', '26-1', '0-2', '1-2', '2-2', '26-2', '27-2', '28-2', '0-23', '1-23', '2-23', '26-23', '27-23', '28-23', '2-24', '26-24', '1-25', '27-25']
    };
    $scope.$watch('preset', function () {
        var mypromise = new Promise(function (resolve) {
            var pre = presetObj[$scope.preset];
            if (pre) {
                $scope.golwidth = pre[0];
                $scope.golheight = pre[1];
                resolve(pre);
            }
        }).then(function (pre) {
            gameOfLife.loadpreset(pre);
        });
    });
    $scope.playspeed = 2;
    $scope.$watch('playspeed', function () {});

    gameOfLife.createAndShowBoard();
});

app.factory('exoFactory', function ($http) {
    return {
        getData: function getData() {
            return $http.get('api/d3/exoplanets').then(function (res) {
                return res.data;
            });
        }
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('exoplanets', {
        url: '/code/d3/exoplanets',
        templateUrl: 'js/code/d3/exoplanets/exoplanets.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        },
        resolve: {
            planetdata: function planetdata(exoFactory) {
                return exoFactory.getData();
            }
        },
        controller: 'exoctrl'
    });
});

app.controller('exoctrl', function ($scope, exoFactory, planetdata, d3Service) {
    $scope.planetData = planetdata.data.slice(13, planetdata.data.length).filter(function (datum) {
        return datum[4] && datum[8];
    });

    d3Service.d3().then(function (d3) {
        var d3box = document.getElementsByClassName('d3box')[0];

        var width = d3box.offsetWidth - 10;
        var height = 1600;

        var x = d3.scale.linear().domain([0, width]).range([0, width]);

        var y = d3.scale.linear().domain([0, height]).range([height, 0]);

        function getId(d) {
            return d[6];
        }
        function getSize(d) {
            return Number(d[8]);
        }
        function getColor(d) {
            var temp = d[7] / 100;
            if (!temp) return 'white';else if (temp <= 0.25) return '#799FFF';else if (temp > 0.25 && temp <= 0.5) return '#89A9F6';else if (temp > 0.5 && temp <= 1) return '#A3B6E0';else if (temp > 1 && temp <= 2) return '#B9BDCC';else if (temp > 2 && temp <= 3) return '#CCC1B8';else if (temp > 3 && temp <= 4) return '#E8C399';else if (temp > 4 && temp <= 5) return '#FBC180';else if (temp > 5 && temp <= 6) return '#FFC078';else if (temp > 6 && temp <= 7) return '#FFB852';else if (temp > 7 && temp <= 8) return '#FFB037';else if (temp > 8 && temp <= 9) return '#FFA712';else if (temp > 9 && temp <= 10) return '#FFA200';else if (temp > 10 && temp <= 11) return '#FF8D00';else if (temp > 11 && temp <= 12) return '#FF8300';else if (temp > 12 && temp <= 13) return '#FF7500';else if (temp > 13 && temp <= 14) return '#FF6B00';else if (temp > 14 && temp <= 15) return '#FF6100';else if (temp > 15 && temp <= 16) return '#FF6000';else if (temp > 16 && temp <= 17) return '#FF5400';else if (temp > 17 && temp <= 18) return '#FF5100';else if (temp > 18 && temp <= 19) return '#FF4800';else if (temp > 19 && temp <= 20) return '#FF3E00';else if (temp > 20 && temp <= 21) return '#FF3E00';else if (temp > 21 && temp <= 22) return '#e63800';else if (temp > 22 && temp <= 23) return '#cc3200';else if (temp > 23 && temp <= 24) return '#F52727';else if (temp > 24 && temp <= 25) return '#FF0A0A';else if (temp > 25 && temp <= 26) return '#F76307';else if (temp > 26 && temp <= 27) return '#CF1020';else if (temp > 27) return '#CF1020';
        }
        function transform(d) {
            return "translate(" + x(Math.cos(Number(d[2])) * Number(d[4]) + 580) + "," + y(Math.sin(Number(d[2])) * Number(d[4]) + 800) + ")";
        }
        function zoom() {
            circle.attr("transform", transform);
        }

        var svg = d3.select(".d3box").append("svg").attr("width", width).attr("height", height).attr('class', "bubble").attr('viewBox', '0 0 ' + width + ' ' + height).attr('preserveAspectRatio', 'xMidYMid meet').append("g").call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", zoom));

        svg.append("rect").attr("class", "overlay").attr("width", width).attr("height", height);

        var circle = svg.selectAll("circle").data($scope.planetData).enter().append("circle").attr("r", getSize).attr('id', getId).attr('class', 'planet').attr("fill", getColor).attr("transform", transform).on('mouseover', function () {
            svg.selectAll("circle").data($scope.planetData).append('title').text(function (d) {
                if (d[6] === 'Earth') return d[6] + '\n' + 'Temperature: ' + (d[7] || 'N/A') + ' Kelvin';else return d[6] + '\n' + 'Distance: ' + parseInt(d[4]) + ' Parsecs (' + parseInt(d[4] * 3.26156) + ' Light Years)' + '\n' + 'Size: ' + d[8] + ' Earth radii' + '\n' + 'Temperature: ' + (d[7] || 'N/A') + ' Kelvin';
            });
        });
        d3.select('#earth').attr('fill', 'lightblue');
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('rest', {
        url: '/code/node/rest',
        templateUrl: 'js/code/node/Rest/rest.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('static', {
        url: '/code/react/static',
        templateUrl: 'js/code/react/static/static.html',
        onEnter: function onEnter($rootScope) {
            $rootScope.hidden = true;
        },
        onExit: function onExit($rootScope) {
            $rootScope.hidden = false;
        }
    });
});

app.directive('wheelieselector', ['d3Service', function (d3Service) {
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: 'js/common/directives/d3_Ball/d3_Ball.html',
        link: function link(scope) {
            scope.updateValues = function () {
                d3Service.d3().then(function (d3) {
                    d3.select('#thingy').append('square').style('height', '300px').style('height', '300px');
                });
            };
            scope.$watch('r', function (newval, oldval) {
                console.log('hit watch function radius', oldval, newval);
                d3Service.d3().then(function (d3) {
                    d3.select('circle').attr('r', newval);
                });
            });
            scope.$watch('cx', function (newval, oldval) {
                console.log('hit watch function cx', oldval, newval);
                d3Service.d3().then(function (d3) {
                    d3.select('circle').attr('cx', newval);
                });
            });
            scope.$watch('cy', function (newval, oldval) {
                console.log('hit watch function cy', oldval, newval);
                d3Service.d3().then(function (d3) {
                    d3.select('circle').attr('cy', newval);
                });
            });
            scope.$watch('color', function (newval, oldval) {
                console.log('hit watch function', oldval, newval);
                d3Service.d3().then(function (d3) {
                    d3.select('circle').style('fill', newval);
                });
            });
            d3Service.d3().then(function (d3) {
                d3.select("#thingy").append("circle").attr("cx", scope.cx || 300).attr("cy", scope.cy || 300).attr("r", scope.r || 100).style("position", "absolute").style("fill", 'red');
            });
        } };
}]);

app.directive('logo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/logo/logo.html'
    };
});

app.directive('navbar', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function link(scope) {

            scope.items = [{ label: 'About Me', state: 'about' }, { label: 'Portfolio', state: 'projects' }, { label: 'Get in Touch', state: 'contact' }, { label: 'Blog', state: 'blog' }, { label: 'Code', state: 'code' }];
        }

    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYmxvZy9ibG9nLmpzIiwiY29kZS9jb2RlLmpzIiwiY29udGFjdC9jb250YWN0LmpzIiwiZDNib290c3RyYXAvZDNib290c3RyYXAuanMiLCJob21lL2hvbWUuanMiLCJwcm9qZWN0cy9wcm9qZWN0cy5qcyIsInJlc3VtZS9yZXN1bWUuanMiLCJjb2RlL2FuZ3VsYXIvYW5ndWxhcnN0YXRlLmpzIiwiY29kZS9jb21wdXRlclNjaWVuY2UvY29tcHV0ZXJzY2llbmNlLmpzIiwiY29kZS9kMy9kM3N0YXRlLmpzIiwiY29kZS9ub2RlL25vZGVzdGF0ZS5qcyIsImNvZGUvcmVhY3QvcmVhY3RzdGF0ZS5qcyIsInByb2plY3RzL0NvZGUtRS9Db2RlLUUuanMiLCJwcm9qZWN0cy9Ob3RvL25vdG8uanMiLCJwcm9qZWN0cy9Ob3dhaXQvTm93YWl0LmpzIiwiY29kZS9hbmd1bGFyL2ZpbHRlcnMvZmlsdGVycy5qcyIsImNvZGUvYW5ndWxhci9zZXQvc2V0LmpzIiwiY29kZS9jb21wdXRlclNjaWVuY2UvZGlqa3N0cmEvZGlqa3N0cmEuanMiLCJjb2RlL2NvbXB1dGVyU2NpZW5jZS9nb2wvZ29sLmpzIiwiY29kZS9kMy9leG9wbGFuZXRzL2V4b3BsYW5ldHMuanMiLCJjb2RlL25vZGUvUmVzdC9yZXN0LmpzIiwiY29kZS9yZWFjdC9zdGF0aWMvc3RhdGljLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvZDNfQmFsbC9kM2JhbGwuanMiLCJjb21tb24vZGlyZWN0aXZlcy9sb2dvL2xvZ28uanMiLCJjb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQUEsQ0FBQTs7O0FBR0EsUUFBQSxDQUFBLGNBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsT0FBQSxHQUFBLE1BQUEsQ0FBQTs7QUFFQSxNQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsV0FBQSxFQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsa0JBQUEsRUFBQSxpQkFBQSxFQUFBOztBQUVBLHFCQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBOztBQUVBLHNCQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQ1pBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7O0FBRUEsa0JBQUEsQ0FBQSxLQUFBLFVBQUE7QUFDQSxXQUFBLFVBQUE7QUFDQSxlQUFBLEVBQUEsaUJBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsVUFBQSxHQUFBLElBQUEsQ0FBQTtBQUNBLGdCQUFBLEtBQUEsR0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxjQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLHNCQUFBLENBQUEsWUFBQTtBQUNBLHlCQUFBLENBQUEsdUJBQUEsQ0FBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsQ0FBQSxDQUFBO2FBQ0EsRUFBQSxDQUFBLENBQUEsQ0FBQTtTQUNBO0FBQ0EsY0FBQSxFQUFBLGdCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQ2ZBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLEtBQUEsU0FBQTtBQUNBLFdBQUEsU0FBQTtBQUNBLG1CQUFBLHFCQUFBO0FBQ0EsZUFBQSxFQUFBLGlCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLElBQUEsQ0FBQTtTQUVBO0FBQ0EsY0FBQSxFQUFBLGdCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLEtBQUEsQ0FBQTtTQUNBO0FBQ0Esa0JBQUEsWUFBQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFHQSxHQUFBLENBQUEsVUFBQSxhQUFBLFVBQUEsTUFBQSxFQUFBO0FBQ0EsUUFBQSxLQUFBLEdBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQTtBQUNBLFVBQUEsQ0FBQSxXQUFBLEdBQUEsS0FBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLFNBQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFlBQUEsS0FBQSxDQUFBLElBQUEsaUJBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsV0FBQSxHQUFBLElBQUEsQ0FBQTtBQUNBLGtCQUFBLENBQUEsT0FBQSxFQUFBLENBQUE7U0FDQSxNQUNBO0FBQ0EsaUJBQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxHQUFBLE9BQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUM1QkEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxPQUFBO0FBQ0EsbUJBQUEsRUFBQSxtQkFBQTtBQUNBLGVBQUEsRUFBQSxpQkFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsR0FBQSxJQUFBLENBQUE7U0FDQTtBQUNBLGNBQUEsRUFBQSxnQkFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsR0FBQSxLQUFBLENBQUE7U0FDQTtBQUNBLGtCQUFBLEVBQUEsVUFBQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFHQSxHQUFBLENBQUEsVUFBQSxDQUFBLFVBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQTtBQUNBLFVBQUEsQ0FBQSxTQUFBLEdBQUEsQ0FDQSxFQUFBLElBQUEsRUFBQSxpQkFBQTtBQUNBLGFBQUEsRUFBQSxnREFBQTtBQUNBLGlCQUFBLEVBQUEsOEJBQUEsRUFBQSxFQUNBLEVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQSxXQUFBLEVBQUEsNERBQUE7QUFDQSxlQUFBLEVBQUEsZ0JBQUEsRUFBQSxFQUNBLEVBQUEsSUFBQSxFQUFBLFNBQUE7QUFDQSxXQUFBLEVBQUEsdUNBQUE7QUFDQSxlQUFBLEVBQUEsU0FBQSxFQUFBLEVBQ0EsRUFBQSxJQUFBLEVBQUEsT0FBQTtBQUNBLFdBQUEsRUFBQSwwR0FBQTtBQUNBLGVBQUEsRUFBQSxzQkFBQSxFQUFBLEVBQ0EsRUFBQSxJQUFBLEVBQUEsTUFBQTtBQUNBLFdBQUEsRUFBQSxxRUFBQTtBQUNBLGVBQUEsRUFBQSxnQkFBQSxFQUFBLENBQ0EsQ0FBQTs7QUFFQSxRQUFBLFdBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsWUFBQSxHQUFBLFlBQUE7QUFDQSxtQkFBQSxHQUFBLElBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBO0FBQ0EsWUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxVQUFBLENBQUEsWUFBQSxHQUFBLFlBQUE7QUFDQSxZQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsR0FBQSxXQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxXQUFBLEdBQUEsWUFBQTtBQUNBLGNBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQTtLQUdBLENBQUE7Q0FFQSxDQUFBLENBQUE7QUNuREEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFNBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxVQUFBO0FBQ0EsZUFBQSxFQUFBLGlCQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLFVBQUEsR0FBQSxJQUFBLENBQUE7QUFDQSxnQkFBQSxNQUFBLEdBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsY0FBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxzQkFBQSxDQUFBLFlBQUE7QUFDQSx5QkFBQSxDQUFBLHVCQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLENBQUEsQ0FBQTthQUNBLEVBQUEsQ0FBQSxDQUFBLENBQUE7U0FDQTtBQUNBLGNBQUEsRUFBQSxnQkFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLFVBQUEsR0FBQSxLQUFBLENBQUE7U0FDQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUNkQSxPQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsRUFBQSxFQUFBLENBQUEsQ0FDQSxPQUFBLENBQUEsV0FBQSxFQUFBLENBQUEsV0FBQSxFQUFBLElBQUEsRUFBQSxZQUFBLEVBQ0EsVUFBQSxTQUFBLEVBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQTtBQUNBLFFBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQTtBQUNBLGFBQUEsWUFBQSxHQUFBOztBQUVBLGtCQUFBLENBQUEsTUFBQSxDQUFBLFlBQUE7QUFBQSxhQUFBLENBQUEsT0FBQSxDQUFBLE1BQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTtTQUFBLENBQUEsQ0FBQTtLQUNBOzs7O0FBSUEsUUFBQSxTQUFBLEdBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLGFBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQTtBQUNBLGFBQUEsQ0FBQSxJQUFBLEdBQUEsaUJBQUEsQ0FBQTtBQUNBLGFBQUEsQ0FBQSxLQUFBLEdBQUEsSUFBQSxDQUFBO0FBQ0EsYUFBQSxDQUFBLEdBQUEsR0FBQSw4QkFBQSxDQUFBO0FBQ0EsYUFBQSxDQUFBLGtCQUFBLEdBQUEsWUFBQTtBQUNBLFlBQUEsSUFBQSxDQUFBLFVBQUEsS0FBQSxVQUFBLEVBQUEsWUFBQSxFQUFBLENBQUE7S0FDQSxDQUFBO0FBQ0EsYUFBQSxDQUFBLE1BQUEsR0FBQSxZQUFBLENBQUE7O0FBRUEsUUFBQSxDQUFBLEdBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLG9CQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxLQUFBLENBQUEsV0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBOztBQUVBLFdBQUE7QUFDQSxVQUFBLEVBQUEsY0FBQTtBQUFBLG1CQUFBLENBQUEsQ0FBQSxPQUFBLENBQUE7U0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUEsQ0FBQTtBQzFCQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxHQUFBO0FBQ0EsZUFBQSxFQUFBLGlCQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLFVBQUEsR0FBQSxJQUFBLENBQUE7QUFDQSxnQkFBQSxHQUFBLEdBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsY0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxxQkFBQSxDQUFBLHVCQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLENBQUEsQ0FBQTtTQUNBO0FBQ0EsY0FBQSxFQUFBLGdCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBO0FDYkEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFVBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxXQUFBO0FBQ0EsZUFBQSxFQUFBLGlCQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLFVBQUEsR0FBQSxJQUFBLENBQUE7QUFDQSxnQkFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsY0FBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxzQkFBQSxDQUFBLFlBQUE7QUFDQSx5QkFBQSxDQUFBLHVCQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxFQUFBLEdBQUEsQ0FBQSxDQUFBO2FBQ0EsRUFBQSxDQUFBLENBQUEsQ0FBQTtTQUNBO0FBQ0EsY0FBQSxFQUFBLGdCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQTtTQUNBO0FBQ0Esa0JBQUEsRUFBQSxtQkFBQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFHQSxHQUFBLENBQUEsVUFBQSxDQUFBLG1CQUFBLEVBQUEsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBOztBQUVBLFFBQUEsV0FBQSxHQUFBLFNBQUEsV0FBQSxDQUFBLE9BQUEsRUFBQTtBQUNBLFlBQUEsUUFBQSxHQUFBLEVBQUEsQ0FBQTtBQUNBLFlBQUEsT0FBQSxHQUFBLE9BQUEsQ0FBQSxVQUFBLENBQUEsVUFBQSxDQUFBO0FBQ0EsZUFBQSxPQUFBLEVBQUEsT0FBQSxHQUFBLE9BQUEsQ0FBQSxXQUFBLEVBQUE7QUFDQSxnQkFBQSxPQUFBLENBQUEsUUFBQSxLQUFBLENBQUEsRUFBQTtBQUNBLHdCQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBO2FBQ0E7U0FDQTtBQUNBLGVBQUEsUUFBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLG9CQUFBLEdBQUEsU0FBQSxvQkFBQSxDQUFBLElBQUEsRUFBQTtBQUNBLFlBQUEsUUFBQSxHQUFBLFdBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQTtBQUNBLGdCQUFBLENBQUEsT0FBQSxDQUFBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsbUJBQUEsQ0FBQSxTQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBO0FBQ0EsbUJBQUEsQ0FBQSxTQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBO0FBQ0EsbUJBQUEsQ0FBQSxTQUFBLENBQUEsTUFBQSxDQUFBLGtCQUFBLENBQUEsQ0FBQTtBQUNBLG1CQUFBLENBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQTtBQUNBLG1CQUFBLENBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxtQkFBQSxDQUFBLENBQUE7QUFDQSxtQkFBQSxDQUFBLFNBQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLENBQUE7QUFDQSxtQkFBQSxDQUFBLFNBQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxJQUFBLEdBQUEsWUFBQTtBQUNBLFlBQUEsV0FBQSxHQUFBLFFBQUEsQ0FBQSxzQkFBQSxDQUFBLGFBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxRQUFBLEdBQUEsV0FBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxHQUFBLEdBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsUUFBQSxDQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSxDQUFBLENBQUE7QUFDQSw0QkFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBO0FBQ0EsbUJBQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBO0FBQ0EsbUJBQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQ0EsbUJBQUEsQ0FBQSxTQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxVQUFBLENBQUEsSUFBQSxHQUFBLFlBQUE7QUFDQSxZQUFBLFdBQUEsR0FBQSxRQUFBLENBQUEsc0JBQUEsQ0FBQSxhQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLFlBQUEsUUFBQSxHQUFBLFdBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQTtBQUNBLFlBQUEsR0FBQSxHQUFBLFFBQUEsQ0FBQSxPQUFBLENBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxHQUFBLFFBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxHQUFBLFFBQUEsQ0FBQSxPQUFBLENBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQ0EsNEJBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQTtBQUNBLG1CQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxtQkFBQSxDQUFBLENBQUE7QUFDQSxtQkFBQSxDQUFBLFNBQUEsQ0FBQSxHQUFBLENBQUEsTUFBQSxDQUFBLENBQUE7QUFDQSxtQkFBQSxDQUFBLFNBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLENBQUE7QUFDQSxnQkFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFNBQUEsQ0FBQSxHQUFBLENBQUEsa0JBQUEsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxVQUFBLENBQUEsV0FBQSxHQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsWUFBQSxVQUFBLEdBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQTtBQUNBLFlBQUEsV0FBQSxHQUFBLFFBQUEsQ0FBQSxzQkFBQSxDQUFBLGFBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxRQUFBLEdBQUEsV0FBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBO0FBQ0EsNEJBQUEsQ0FBQSxVQUFBLENBQUEsQ0FBQTtBQUNBLGtCQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FDM0VBLEdBQUEsQ0FBQSxPQUFBLENBQUEsZUFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsV0FBQTtBQUNBLGVBQUEsRUFBQSxtQkFBQTtBQUNBLG1CQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsWUFBQSxFQUFBLEVBQUEsWUFBQSxFQUFBLGFBQUEsRUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsR0FBQSxFQUFBO0FBQ0Esb0JBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLGlCQUFBLEVBQUEsQ0FBQSxDQUFBO0FBQ0Esb0JBQUEsT0FBQSxHQUFBLEdBQUEsQ0FBQSxlQUFBLENBQUEsSUFBQSxDQUFBLENBQUE7QUFDQSx1QkFBQSxPQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FDQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFFBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxTQUFBO0FBQ0EsbUJBQUEsRUFBQSx1QkFBQTtBQUNBLGVBQUEsRUFBQSxpQkFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsR0FBQSxJQUFBLENBQUE7U0FFQTtBQUNBLGNBQUEsRUFBQSxnQkFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsR0FBQSxLQUFBLENBQUE7U0FDQTtBQUNBLGVBQUEsRUFBQTtBQUNBLGtCQUFBLEVBQUEsZ0JBQUEsYUFBQSxFQUFBO0FBQ0EsdUJBQUEsYUFBQSxDQUFBLE9BQUEsRUFBQSxDQUFBO2FBQ0E7U0FDQTtBQUNBLGtCQUFBLEVBQUEsWUFBQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFHQSxHQUFBLENBQUEsVUFBQSxDQUFBLFlBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBOztBQUVBLFVBQUEsQ0FBQSxNQUFBLEdBQUEsSUFBQSxDQUFBLGtCQUFBLENBQUEsTUFBQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FDcENBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLEtBQUEsWUFBQTtBQUNBLFdBQUEsaUJBQUE7QUFDQSxtQkFBQSxxQ0FBQTtBQUNBLGVBQUEsRUFBQSxpQkFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsR0FBQSxJQUFBLENBQUE7U0FDQTtBQUNBLGNBQUEsRUFBQSxnQkFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsR0FBQSxLQUFBLENBQUE7U0FDQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUNYQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxLQUFBLG9CQUFBO0FBQ0EsV0FBQSx5QkFBQTtBQUNBLG1CQUFBLGdEQUFBO0FBQ0EsZUFBQSxFQUFBLGlCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLElBQUEsQ0FBQTtTQUVBO0FBQ0EsY0FBQSxFQUFBLGdCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLEtBQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQ1pBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsVUFBQTtBQUNBLG1CQUFBLEVBQUEseUJBQUE7QUFDQSxlQUFBLEVBQUEsaUJBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsSUFBQSxDQUFBO1NBRUE7QUFDQSxjQUFBLEVBQUEsZ0JBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsS0FBQSxDQUFBO1NBQ0E7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FDWkEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxZQUFBO0FBQ0EsbUJBQUEsRUFBQSw2QkFBQTtBQUNBLGVBQUEsRUFBQSxpQkFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsR0FBQSxJQUFBLENBQUE7U0FFQTtBQUNBLGNBQUEsRUFBQSxnQkFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsR0FBQSxLQUFBLENBQUE7U0FDQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUNaQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxLQUFBLENBQUEsT0FBQSxFQUFBO0FBQ0EsV0FBQSxFQUFBLGFBQUE7QUFDQSxtQkFBQSxFQUFBLCtCQUFBO0FBQ0EsZUFBQSxFQUFBLGlCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLElBQUEsQ0FBQTtTQUVBO0FBQ0EsY0FBQSxFQUFBLGdCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLEtBQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQ1pBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxRQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsa0JBQUE7QUFDQSxtQkFBQSxFQUFBLGdDQUFBO0FBQ0EsZUFBQSxFQUFBLGlCQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsR0FBQSxJQUFBLENBQUE7U0FDQTtBQUNBLGNBQUEsRUFBQSxnQkFBQSxVQUFBLEVBQUEsU0FBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsS0FBQSxDQUFBO0FBQ0Esc0JBQUEsQ0FBQSxVQUFBLEdBQUEsS0FBQSxDQUFBO0FBQ0EscUJBQUEsQ0FBQSxJQUFBLENBQUEsV0FBQSxDQUFBLENBQUE7U0FDQTtLQUNBLENBQUEsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUNiQSxHQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBO0FBQ0EsV0FBQSxFQUFBLGdCQUFBO0FBQ0EsbUJBQUEsRUFBQSw0QkFBQTtBQUNBLGVBQUEsRUFBQSxpQkFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsSUFBQSxDQUFBO1NBQ0E7QUFDQSxjQUFBLEVBQUEsZ0JBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLEtBQUEsQ0FBQTtBQUNBLHNCQUFBLENBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQTtBQUNBLHFCQUFBLENBQUEsSUFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBO1NBQ0E7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FDYkEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFFBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxrQkFBQTtBQUNBLG1CQUFBLEVBQUEsZ0NBQUE7QUFDQSxlQUFBLEVBQUEsaUJBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLElBQUEsQ0FBQTtTQUNBO0FBQ0EsY0FBQSxFQUFBLGdCQUFBLFVBQUEsRUFBQSxTQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsR0FBQSxLQUFBLENBQUE7QUFDQSxzQkFBQSxDQUFBLFVBQUEsR0FBQSxLQUFBLENBQUE7QUFDQSxxQkFBQSxDQUFBLElBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQ2JBLEdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLEtBQUEsQ0FBQSxTQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsdUJBQUE7QUFDQSxtQkFBQSxFQUFBLHNDQUFBO0FBQ0EsZUFBQSxFQUFBLGlCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLElBQUEsQ0FBQTtTQUVBO0FBQ0EsY0FBQSxFQUFBLGdCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLEtBQUEsQ0FBQTtTQUNBO0FBQ0Esa0JBQUEsRUFBQSxhQUFBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUdBLEdBQUEsQ0FBQSxVQUFBLENBQUEsYUFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQTtBQUNBLFVBQUEsQ0FBQSxXQUFBLEdBQUE7QUFDQSxlQUFBLEVBQUEsK2JBQUE7QUFDQSxnQkFBQSxFQUFBOzs7MGhCQUdBO0FBQ0Esb0JBQUEsRUFBQSxVQUFBO0FBQ0EsbUJBQUEsRUFBQSxDQUFBLEtBQUEsRUFBQSxXQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxPQUFBLEVBQUEsUUFBQSxFQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUEsT0FBQSxFQUFBLEVBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLEVBQUEsRUFBQSxDQUFBLENBQUE7QUFDQSxvQkFBQSxFQUFBO0FBQ0Esc0JBQUEsRUFBQTtBQUNBLHVCQUFBLEVBQUEsa0JBQUE7QUFDQSwwQkFBQSxFQUFBO0FBQ0EsMkJBQUEsRUFBQSxHQUFBO0FBQ0EsK0JBQUEsRUFBQTtBQUNBLG9DQUFBLEVBQUE7QUFDQSxnQ0FBQSxFQUFBLE1BQUE7QUFDQSxvQ0FBQSxFQUFBLE1BQUE7QUFDQSx1Q0FBQSxFQUFBLHNDQUFBO0FBQ0EscUNBQUEsRUFBQSxNQUFBO0FBQ0Esb0NBQUEsRUFBQSxlQUFBO0FBQ0Esc0NBQUEsRUFBQTtBQUNBLHNDQUFBLEVBQUEsMEVBQUE7QUFDQSw4Q0FBQSxFQUFBLENBQUEsS0FBQSxFQUFBLEtBQUEsQ0FBQTs2QkFDQTtBQUNBLHNDQUFBLEVBQUEsUUFBQTt5QkFDQTtxQkFDQTtpQkFDQTthQUNBO1NBQ0E7S0FDQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLFdBQUEsQ0FBQSxLQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxXQUFBLENBQUE7QUFDQSxVQUFBLENBQUEsV0FBQSxHQUFBLFVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQTtBQUNBLGVBQUEsT0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLE9BQUEsR0FBQSxLQUFBLENBQUE7QUFDQSxRQUFBLE9BQUEsR0FBQSxLQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLEVBQUEsWUFBQTtBQUNBLFlBQUEsT0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxXQUFBLEdBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQTtTQUNBO0FBQ0EsZUFBQSxHQUFBLElBQUEsQ0FBQTtLQUNBLENBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsTUFBQSxDQUFBLFNBQUEsRUFBQSxZQUFBO0FBQ0EsWUFBQSxPQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLFdBQUEsR0FBQSxNQUFBLENBQUEsV0FBQSxDQUFBLE1BQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQTtTQUNBO0FBQ0EsZUFBQSxHQUFBLElBQUEsQ0FBQTtLQUNBLENBQUEsQ0FBQTs7QUFHQSxVQUFBLENBQUEsV0FBQSxHQUFBLFlBQUE7QUFDQSxjQUFBLENBQUEsV0FBQSxHQUFBLFFBQUEsQ0FBQSxjQUFBLENBQUEsYUFBQSxDQUFBLENBQUEsS0FBQSxDQUFBO0FBQ0EsY0FBQSxDQUFBLFdBQUEsQ0FBQSxNQUFBLENBQUEsV0FBQSxFQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7Ozs7QUFJQSxHQUFBLENBQUEsTUFBQSxDQUFBLFNBQUEsRUFBQSxZQUFBO0FBQ0EsV0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLGFBQUEsR0FBQSxLQUFBLElBQUEsR0FBQSxDQUFBO0FBQ0EsWUFBQSxHQUFBLEdBQUEsRUFBQSxDQUFBO0FBQ0EsYUFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUFDQSxlQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUE7U0FDQTtBQUNBLGVBQUEsR0FBQSxDQUFBO0tBQ0EsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsTUFBQSxDQUFBLG1CQUFBLEVBQUEsWUFBQTtBQUNBLFdBQUEsVUFBQSxLQUFBLEVBQUE7QUFDQSxZQUFBLE9BQUEsS0FBQSxLQUFBLFFBQUEsRUFBQSxLQUFBLEdBQUEsR0FBQSxDQUFBO0FBQ0EsWUFBQSxFQUFBLEdBQUEsTUFBQSxDQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsS0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxpQkFBQSxFQUFBLFlBQUE7QUFDQSxXQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsWUFBQSxPQUFBLEtBQUEsS0FBQSxRQUFBLEVBQUEsS0FBQSxHQUFBLEdBQUEsQ0FBQTtBQUNBLFlBQUEsRUFBQSxHQUFBLE1BQUEsQ0FBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxFQUFBLFlBQUE7QUFDQSxXQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsSUFBQSxFQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxFQUFBLFlBQUE7QUFDQSxXQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsWUFBQSxPQUFBLEtBQUEsS0FBQSxRQUFBLEVBQUEsS0FBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsS0FBQSxDQUFBLENBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBO0FBQ0EsbUJBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxLQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUVBLEdBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxFQUFBLFlBQUE7QUFDQSxXQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsWUFBQSxPQUFBLEtBQUEsS0FBQSxRQUFBLEVBQUEsS0FBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsS0FBQSxDQUFBLENBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBLENBQUEsSUFBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUFFQSxHQUFBLENBQUEsTUFBQSxDQUFBLE9BQUEsRUFBQSxZQUFBO0FBQ0EsV0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFlBQUEsT0FBQSxLQUFBLEtBQUEsUUFBQSxFQUFBLEtBQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsbUJBQUEsQ0FBQSxJQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7S0FDQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQzVJQSxZQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxTQUFBLEVBQUEsWUFBQTtBQUNBLFdBQUEsVUFBQSxLQUFBLEVBQUE7QUFDQSxZQUFBLEtBQUEsS0FBQSxVQUFBLEVBQUEsT0FBQSxRQUFBLENBQUEsS0FDQSxJQUFBLEtBQUEsS0FBQSxNQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxPQUFBLEtBQUEsQ0FBQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLEtBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxtQkFBQTtBQUNBLG1CQUFBLEVBQUEsOEJBQUE7QUFDQSxrQkFBQSxFQUFBLGdCQUFBO0FBQ0EsZUFBQSxFQUFBLGlCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLElBQUEsQ0FBQTtTQUNBO0FBQ0EsY0FBQSxFQUFBLGdCQUFBLFVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxHQUFBLEtBQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQSxDQUFBO0NBQ0EsQ0FBQSxDQUFBOztBQUdBLEdBQUEsQ0FBQSxPQUFBLENBQUEsY0FBQSxFQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsV0FBQTtBQUNBLG1CQUFBLEVBQUEsU0FBQSxXQUFBLEdBQUE7QUFDQSxtQkFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLHVCQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FDQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxnQkFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUEsWUFBQSxFQUFBLGNBQUEsRUFBQTs7OztBQUlBLFVBQUEsQ0FBQSxPQUFBLEdBQUEsQ0FBQSxDQUFBLG1CQUFBLENBQUEsRUFBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxVQUFBLENBQUEsYUFBQSxHQUFBLENBQUEsQ0FBQTtBQUNBLFVBQUEsQ0FBQSxXQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLFNBQUEsR0FBQSxFQUFBLENBQUE7QUFDQSxRQUFBLFNBQUEsR0FBQSxFQUFBO1FBQ0EsV0FBQSxHQUFBLFNBQUEsQ0FBQTs7O0FBR0EsZ0JBQUEsQ0FBQSxXQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxLQUFBLEVBQUE7QUFDQSxjQUFBLENBQUEsUUFBQSxHQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxDQUFBLENBQUE7QUFDQSxjQUFBLENBQUEsS0FBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxFQUFBLENBQUEsQ0FBQTtLQUNBLENBQUEsQ0FBQTs7OztBQUlBLFVBQUEsQ0FBQSxNQUFBLENBQUEsY0FBQSxFQUFBLFlBQUE7QUFDQSxZQUFBLE1BQUEsQ0FBQSxLQUFBLEVBQUE7QUFDQSxnQkFBQSxNQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsR0FBQSxFQUFBLElBQUEsQ0FBQSxlQUFBLEVBQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSxvQkFBQSxNQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLGlDQUFBLEVBQUEsQ0FBQTtpQkFDQSxNQUFBLElBQUEsQ0FBQSxlQUFBLEVBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLDZCQUFBLENBQUEsTUFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBOztpQkFFQTthQUNBO1NBQ0E7S0FDQSxDQUFBLENBQUE7O0FBRUEsVUFBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLEVBQUEsWUFBQTtBQUNBLFlBQUEsTUFBQSxDQUFBLFNBQUEsS0FBQSxDQUFBLEVBQUE7QUFDQSx3QkFBQSxFQUFBLENBQUE7U0FDQTtLQUNBLENBQUEsQ0FBQTs7OztBQUlBLFFBQUEsZUFBQSxHQUFBLFNBQUEsZUFBQSxHQUFBO0FBQ0EsWUFBQSxPQUFBLEdBQUEsY0FBQSxDQUFBLGtCQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLFlBQUEsRUFBQTtBQUNBLG1CQUFBLGNBQUEsQ0FBQSxXQUFBLENBQUEsWUFBQSxDQUFBLENBQUE7U0FDQSxDQUFBLENBQUE7QUFDQSxlQUFBLE9BQUEsQ0FBQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxhQUFBLEdBQUEsU0FBQSxhQUFBLEdBQUE7QUFDQSxZQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxHQUFBLE1BQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO1NBQ0EsTUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxHQUFBLE1BQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUE7U0FDQTtLQUNBLENBQUE7O0FBRUEsUUFBQSxZQUFBLEdBQUEsU0FBQSxZQUFBLEdBQUE7QUFDQSxZQUFBLFVBQUEsR0FBQSxlQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLFlBQUEsVUFBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBO0FBQ0EsYUFBQSxDQUFBLE1BQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxVQUFBLEVBQUE7QUFDQSx1QkFBQSxVQUFBLENBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBO0FBQ0EsYUFBQSxDQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsS0FBQSxFQUFBLFVBQUEsU0FBQSxFQUFBO0FBQ0EsdUJBQUEsVUFBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQTthQUNBLENBQUEsQ0FBQTtBQUNBLGtCQUFBLENBQUEsYUFBQSxFQUFBLENBQUE7U0FDQTtLQUNBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFlBQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFlBQUEsS0FBQSxDQUFBLE9BQUEsRUFBQTtBQUNBLGlCQUFBLENBQUEsT0FBQSxHQUFBLENBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQTtBQUNBLHFCQUFBLENBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBO1NBQ0EsTUFBQSxJQUFBLFNBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxFQUFBO0FBQ0EscUJBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBO0FBQ0EsaUJBQUEsQ0FBQSxPQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsT0FBQSxDQUFBO1NBQ0E7QUFDQSxZQUFBLFNBQUEsQ0FBQSxNQUFBLEtBQUEsQ0FBQSxFQUFBO0FBQ0EsZ0JBQUEsY0FBQSxDQUFBLFdBQUEsQ0FBQSxTQUFBLENBQUEsRUFBQTtBQUNBLGlCQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLEVBQUEsVUFBQSxTQUFBLEVBQUE7QUFDQSwyQkFBQSxTQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBO2lCQUNBLENBQUEsQ0FBQTtBQUNBLHlCQUFBLEdBQUEsRUFBQSxDQUFBO0FBQ0Esc0JBQUEsQ0FBQSxXQUFBLEVBQUEsQ0FBQTtBQUNBLHNCQUFBLENBQUEsU0FBQSxHQUFBLEVBQUEsQ0FBQTthQUNBO1NBQ0E7S0FDQSxDQUFBOzs7O0FBSUEsVUFBQSxDQUFBLFFBQUEsR0FBQSxZQUFBO0FBQ0EsZUFBQSxDQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsT0FBQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxLQUFBLEdBQUEsWUFBQTtBQUNBLFlBQUEsVUFBQSxHQUFBLGVBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxVQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxDQUFBLENBQUE7QUFDQSxhQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLEVBQUEsVUFBQSxTQUFBLEVBQUE7QUFDQSx1QkFBQSxVQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBO0FBQ0Esa0JBQUEsQ0FBQSxXQUFBLEVBQUEsQ0FBQTtTQUNBO0tBQ0EsQ0FBQTs7QUFFQSxVQUFBLENBQUEsYUFBQSxHQUFBLFlBQUE7QUFDQSxtQkFBQSxHQUFBLFNBQUEsQ0FBQSxZQUFBO0FBQ0Esa0JBQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQTtTQUNBLEVBQUEsR0FBQSxDQUFBLENBQUE7S0FDQSxDQUFBOzs7O0FBSUEsYUFBQSxDQUFBLFlBQUE7QUFDQSxZQUFBLE1BQUEsQ0FBQSxTQUFBLEtBQUEsQ0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxTQUFBLEdBQUEsRUFBQSxDQUFBO1NBQ0E7QUFDQSxjQUFBLENBQUEsU0FBQSxFQUFBLENBQUE7S0FDQSxFQUFBLElBQUEsQ0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBbUJBLENBQUEsQ0FBQTs7Ozs7Ozs7Ozs7OztBQWVBLEdBQUEsQ0FBQSxPQUFBLENBQUEsZ0JBQUEsRUFBQSxZQUFBO0FBQ0EsV0FBQTtBQUNBLDBCQUFBLEVBQUEsU0FBQSxrQkFBQSxDQUFBLFFBQUEsRUFBQTtBQUNBLGdCQUFBLE1BQUEsR0FBQSxFQUFBLENBQUE7QUFDQSxnQkFBQSxPQUFBLEdBQUEsRUFBQSxDQUFBO0FBQ0EsZ0JBQUEsT0FBQSxHQUFBLFFBQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQTtBQUNBLG1CQUFBLE9BQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSx1QkFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxFQUFBLENBQUEsQ0FBQTtBQUNBLG9CQUFBLE9BQUEsR0FBQSxPQUFBLENBQUEsS0FBQSxFQUFBLENBQUE7QUFDQSx1QkFBQSxPQUFBLENBQUEsTUFBQSxFQUFBO0FBQ0EsMkJBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsRUFBQSxDQUFBLENBQUE7QUFDQSx3QkFBQSxTQUFBLEdBQUEsT0FBQSxDQUFBLEtBQUEsRUFBQSxDQUFBO0FBQ0EsMkJBQUEsU0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLCtCQUFBLENBQUEsSUFBQSxDQUFBLFNBQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQSxDQUFBO0FBQ0EsOEJBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLENBQUE7QUFDQSwrQkFBQSxHQUFBLE9BQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLE9BQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUE7cUJBQ0E7QUFDQSwyQkFBQSxHQUFBLE9BQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLE9BQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUE7aUJBQ0E7QUFDQSx1QkFBQSxHQUFBLE9BQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLE9BQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUE7YUFDQTtBQUNBLG1CQUFBLE1BQUEsQ0FBQTtTQUNBO0FBQ0EsbUJBQUEsRUFBQSxTQUFBLFdBQUEsQ0FBQSxPQUFBLEVBQUE7QUFDQSxnQkFBQSxLQUFBLEdBQUEsSUFBQSxDQUFBO0FBQ0EsZ0JBQUEsU0FBQSxHQUFBLEVBQUEsQ0FBQTs7QUFFQSxtQkFBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLHlCQUFBLEdBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7O0FBRUEsZ0JBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBO0FBQ0EscUJBQUEsR0FBQSxLQUFBLENBQUE7YUFDQTs7QUFFQSxtQkFBQSxLQUFBLENBQUE7U0FDQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7QUNsT0EsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFVBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxnQ0FBQTtBQUNBLG1CQUFBLEVBQUEsaURBQUE7QUFDQSxlQUFBLEVBQUEsaUJBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsSUFBQSxDQUFBO1NBQ0E7QUFDQSxjQUFBLEVBQUEsZ0JBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsS0FBQSxDQUFBO1NBQ0E7QUFDQSxrQkFBQSxFQUFBLFVBQUE7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUE7O0FBRUEsUUFBQSxnQkFBQSxHQUFBLEtBQUEsQ0FBQTtBQUNBLFFBQUEsaUJBQUEsR0FBQSxLQUFBLENBQUE7QUFDQSxRQUFBLFdBQUEsR0FBQSxFQUFBLENBQUE7QUFDQSxRQUFBLEtBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBO0FBQ0EsUUFBQSxZQUFBLEdBQUEsSUFBQSxLQUFBLEVBQUEsQ0FBQTtBQUNBLGdCQUFBLENBQUEsR0FBQSxHQUFBLGlCQUFBLENBQUE7QUFDQSxRQUFBLG1CQUFBLEdBQUEsSUFBQSxLQUFBLEVBQUEsQ0FBQTtBQUNBLHVCQUFBLENBQUEsR0FBQSxHQUFBLHdCQUFBLENBQUE7QUFDQSxRQUFBLE1BQUEsR0FBQSxJQUFBLEtBQUEsRUFBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLEdBQUEsR0FBQSxZQUFBLENBQUE7QUFDQSxRQUFBLFVBQUEsR0FBQSxFQUFBLENBQUE7QUFDQSxRQUFBLFNBQUEsR0FBQSxFQUFBLENBQUE7QUFDQSxRQUFBLFNBQUEsR0FBQSxFQUFBLENBQUE7QUFDQSxRQUFBLFVBQUEsR0FBQSxFQUFBLENBQUE7QUFDQSxRQUFBLFNBQUEsR0FBQSxDQUFBLFVBQUEsRUFBQSxTQUFBLENBQUEsQ0FBQTtBQUNBLFFBQUEsT0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsUUFBQSxNQUFBLEdBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBQSxhQUFBLENBQUEsQ0FBQTtBQUNBLFVBQUEsQ0FBQSxLQUFBLEdBQUEsU0FBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLFVBQUEsQ0FBQSxNQUFBLEdBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQTtBQUNBLFFBQUEsR0FBQSxHQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsSUFBQSxDQUFBLENBQUE7QUFDQSxnQkFBQSxDQUFBLE1BQUEsR0FBQSxNQUFBLENBQUE7Ozs7QUFJQSxRQUFBLE1BQUEsQ0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBO0FBQ0Esa0JBQUEsR0FBQSxFQUFBLENBQUE7QUFDQSxpQkFBQSxHQUFBLEVBQUEsQ0FBQTtBQUNBLGNBQUEsQ0FBQSxLQUFBLEdBQUEsU0FBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLGNBQUEsQ0FBQSxNQUFBLEdBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQTtLQUNBO0FBQ0EsYUFBQSxNQUFBLEdBQUE7QUFDQSxlQUFBLENBQUEsR0FBQSxDQUFBLHFCQUFBLENBQUEsQ0FBQTtBQUNBLHlCQUFBLEdBQUEsSUFBQSxDQUFBO0FBQ0EsY0FBQSxDQUFBLFdBQUEsRUFBQSxDQUFBO0tBQ0E7Ozs7QUFJQSxRQUFBLFNBQUEsR0FBQSxTQUFBLFNBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDQSxZQUFBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsU0FBQSxDQUFBLEdBQUEsU0FBQSxDQUFBO0FBQ0EsWUFBQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQTtBQUNBLFlBQUEsWUFBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEdBQUEsU0FBQSxDQUFBLENBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxZQUFBLEtBQUEsQ0FBQSxJQUFBLFlBQUEsS0FBQSxDQUFBLEVBQUEsT0FBQTtBQUNBLGFBQUEsQ0FBQSxNQUFBLEdBQUEsU0FBQSxDQUFBLENBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtBQUNBLFdBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxFQUFBLENBQUEsR0FBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxTQUFBLEVBQUEsVUFBQSxDQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsVUFBQSxHQUFBLFNBQUEsVUFBQSxDQUFBLENBQUEsRUFBQTtBQUNBLFlBQUEsTUFBQSxZQUFBLENBQUE7QUFDQSxZQUFBLE1BQUEsWUFBQSxDQUFBO0FBQ0EsWUFBQSxDQUFBLENBQUEsTUFBQSxLQUFBLFNBQUEsSUFBQSxDQUFBLENBQUEsTUFBQSxLQUFBLFNBQUEsRUFBQTtBQUNBLGtCQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxHQUFBLFNBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLGtCQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQTtTQUNBLE1BQ0EsSUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLFNBQUEsRUFBQTtBQUNBLGtCQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLE1BQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxVQUFBLENBQUEsR0FBQSxVQUFBLENBQUE7QUFDQSxrQkFBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsR0FBQSxNQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsU0FBQSxDQUFBLEdBQUEsU0FBQSxDQUFBO1NBQ0E7QUFDQSxZQUFBLFlBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxHQUFBLFNBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxVQUFBLENBQUEsQ0FBQTtBQUNBLFlBQUEsWUFBQSxLQUFBLENBQUEsSUFBQSxZQUFBLEtBQUEsQ0FBQSxFQUFBLE9BQUE7QUFDQSxXQUFBLENBQUEsU0FBQSxDQUFBLE1BQUEsRUFDQSxNQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFDQSxhQUFBLENBQUEsTUFBQSxHQUFBLFNBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxVQUFBLENBQUEsR0FBQSxRQUFBLENBQUE7S0FDQSxDQUFBOztBQUVBLFFBQUEsUUFBQSxHQUFBLFNBQUEsUUFBQSxDQUFBLENBQUEsRUFBQTtBQUNBLFlBQUEsTUFBQSxZQUFBLENBQUE7QUFDQSxZQUFBLE1BQUEsWUFBQSxDQUFBO0FBQ0EsWUFBQSxDQUFBLENBQUEsTUFBQSxLQUFBLFNBQUEsSUFBQSxDQUFBLENBQUEsTUFBQSxLQUFBLFNBQUEsRUFBQTtBQUNBLGtCQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxHQUFBLFNBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLGtCQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQTtTQUNBLE1BQ0E7QUFDQSxrQkFBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsR0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUEsVUFBQSxDQUFBO0FBQ0Esa0JBQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQTtTQUNBO0FBQ0EsYUFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQUNBLGlCQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsVUFBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FBQ0Esb0JBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsRUFBQTtBQUNBLHlCQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQ0EsdUJBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxFQUFBLENBQUEsR0FBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQTtpQkFDQTthQUNBO1NBQ0E7QUFDQSxXQUFBLENBQUEsU0FBQSxDQUFBLFlBQUEsRUFBQSxDQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsRUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsQ0FBQSxDQUFBO0FBQ0EsYUFBQSxDQUFBLE1BQUEsR0FBQSxTQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7QUFFQSxRQUFBLFNBQUEsR0FBQSxTQUFBLFNBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDQSxZQUFBLE1BQUEsWUFBQSxDQUFBO0FBQ0EsWUFBQSxNQUFBLFlBQUEsQ0FBQTtBQUNBLFlBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxTQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxTQUFBLEVBQUE7QUFDQSxrQkFBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxTQUFBLENBQUEsR0FBQSxTQUFBLENBQUE7QUFDQSxrQkFBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxVQUFBLENBQUEsR0FBQSxVQUFBLENBQUE7U0FDQSxNQUNBLElBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxTQUFBLEVBQUE7QUFDQSxrQkFBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsR0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUEsVUFBQSxDQUFBO0FBQ0Esa0JBQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQTtTQUNBO0FBQ0EsYUFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQUNBLGlCQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsVUFBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FBQ0Esb0JBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsRUFBQTtBQUNBLHlCQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQ0EsdUJBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxFQUFBLENBQUEsR0FBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQTtpQkFDQTthQUNBO1NBQ0E7QUFDQSxXQUFBLENBQUEsU0FBQSxDQUFBLFlBQUEsRUFBQSxDQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsRUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsQ0FBQSxDQUFBO0FBQ0EsYUFBQSxDQUFBLE1BQUEsR0FBQSxTQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0tBQ0EsQ0FBQTs7Ozs7O0FBTUEsVUFBQSxDQUFBLFVBQUEsR0FBQSxVQUFBLENBQUEsRUFBQTtBQUNBLGlCQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7S0FDQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLE9BQUEsR0FBQSxVQUFBLENBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7S0FDQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLFdBQUEsR0FBQSxVQUFBLENBQUEsRUFBQTtBQUNBLFlBQUEsTUFBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxTQUFBLENBQUEsR0FBQSxTQUFBLENBQUE7QUFDQSxZQUFBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUEsVUFBQSxDQUFBO0FBQ0EsWUFBQSxZQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsR0FBQSxTQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsVUFBQSxDQUFBLENBQUE7QUFDQSxZQUFBLFlBQUEsS0FBQSxDQUFBLEVBQUE7QUFDQSxrQkFBQSxDQUFBLFdBQUEsR0FBQSxRQUFBLENBQUE7U0FDQSxNQUNBLElBQUEsWUFBQSxLQUFBLENBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsV0FBQSxHQUFBLFNBQUEsQ0FBQTtTQUNBLE1BQ0E7QUFDQSxrQkFBQSxDQUFBLFdBQUEsR0FBQSxVQUFBLENBQUE7U0FDQTtLQUNBLENBQUE7O0FBRUEsVUFBQSxDQUFBLFNBQUEsR0FBQSxZQUFBO0FBQ0EsY0FBQSxDQUFBLFdBQUEsR0FBQSxJQUFBLENBQUE7S0FDQSxDQUFBOzs7O0FBSUEsVUFBQSxDQUFBLGdCQUFBLENBQUEsWUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQ0EsWUFBQSxNQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxHQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsR0FBQSxTQUFBLENBQUEsR0FBQSxTQUFBLENBQUE7QUFDQSxZQUFBLE1BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLEdBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQTtBQUNBLFlBQUEsWUFBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEdBQUEsU0FBQSxDQUFBLENBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxZQUFBLEtBQUEsQ0FBQSxFQUFBO0FBQ0Esa0JBQUEsQ0FBQSxnQkFBQSxDQUFBLFdBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxDQUFBLENBQUE7U0FDQSxNQUNBLElBQUEsWUFBQSxLQUFBLENBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsZ0JBQUEsQ0FBQSxXQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUEsQ0FBQSxDQUFBO1NBQ0EsTUFDQTtBQUNBLGtCQUFBLENBQUEsZ0JBQUEsQ0FBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLEtBQUEsQ0FBQSxDQUFBO1NBQ0E7S0FDQSxFQUFBLEtBQUEsQ0FBQSxDQUFBOztBQUVBLFVBQUEsQ0FBQSxnQkFBQSxDQUFBLFVBQUEsRUFBQSxVQUFBLENBQUEsRUFBQTtBQUNBLGNBQUEsQ0FBQSxtQkFBQSxDQUFBLFdBQUEsRUFBQSxRQUFBLENBQUEsQ0FBQTtBQUNBLGNBQUEsQ0FBQSxtQkFBQSxDQUFBLFdBQUEsRUFBQSxTQUFBLENBQUEsQ0FBQTtBQUNBLGNBQUEsQ0FBQSxtQkFBQSxDQUFBLFdBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQTtLQUNBLENBQUEsQ0FBQTs7Ozs7O0FBT0EsVUFBQSxDQUFBLFdBQUEsR0FBQSxVQUFBLE9BQUEsRUFBQTtBQUNBLGVBQUEsQ0FBQSxHQUFBLENBQUEsbUJBQUEsQ0FBQSxDQUFBO0FBQ0Esd0JBQUEsR0FBQSxJQUFBLENBQUE7O0FBRUEsYUFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQUNBLGlCQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBO0FBQ0EsaUJBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxVQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUFDQSxxQkFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTthQUNBO1NBQ0E7QUFDQSxZQUFBLE9BQUEsRUFBQTs7QUFFQSxpQkFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQUNBLHFCQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsVUFBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FBQ0Esd0JBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsRUFBQTtBQUNBLDZCQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsUUFBQSxDQUFBO3FCQUNBO2lCQUNBO2FBQ0E7U0FDQTtBQUNBLGFBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLFNBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQ0EsYUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsU0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQ0EsY0FBQSxFQUFBLENBQUE7S0FDQSxDQUFBOztBQUdBLFVBQUEsQ0FBQSxVQUFBLEdBQUEsWUFBQTs7QUFFQSxhQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQUNBLGlCQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQUNBLG9CQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLEVBQUEsU0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0Esb0JBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsRUFBQSxPQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUE7YUFDQTtTQUNBO0FBQ0EsWUFBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxLQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxPQUFBLEdBQUEsV0FBQSxDQUFBLEtBQUEsRUFBQSxDQUFBO0FBQ0EsbUJBQUEsR0FBQSxRQUFBLENBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQTtBQUNBLG1CQUFBLEdBQUEsV0FBQSxDQUFBLE9BQUEsRUFBQSxDQUFBOzs7QUFHQSxpQkFBQSxPQUFBLENBQUEsSUFBQSxFQUFBO0FBQ0EsZ0JBQUEsV0FBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLFNBQUEsRUFBQTtBQUNBLG1CQUFBLENBQUEsU0FBQSxDQUFBLFlBQUEsRUFDQSxDQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsRUFDQSxTQUFBLEVBQUEsVUFBQSxFQUNBLFdBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxTQUFBLEVBQ0EsV0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsRUFDQSxTQUFBLEVBQUEsVUFBQSxDQUFBLENBQUE7YUFDQSxNQUNBLElBQUEsV0FBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLFNBQUEsSUFBQSxXQUFBLENBQUEsS0FBQSxDQUFBLEtBQUEsU0FBQSxFQUFBO0FBQ0EscUJBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUFDQSx5QkFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLFVBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQUNBLDRCQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLEVBQUE7QUFDQSxpQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtBQUNBLCtCQUFBLENBQUEsU0FBQSxDQUFBLFlBQUEsRUFBQSxDQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsRUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBLENBQUEsR0FBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBLFVBQUEsRUFBQSxTQUFBLEVBQUEsVUFBQSxDQUFBLENBQUE7eUJBQ0E7cUJBQ0E7aUJBQ0E7QUFDQSxvQkFBQSxVQUFBLEdBQUEsS0FBQSxHQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtBQUNBLG9CQUFBLFVBQUEsR0FBQSxZQUFBLENBQUE7QUFDQSxvQkFBQSxXQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQ0EsOEJBQUEsR0FBQSxXQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsV0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxZQUFBLEdBQUEsbUJBQUEsQ0FBQTtpQkFDQTtBQUNBLG1CQUFBLENBQUEsU0FBQSxDQUFBLFVBQUEsRUFDQSxVQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsRUFDQSxTQUFBLEVBQUEsVUFBQSxFQUNBLFdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxTQUFBLEVBQ0EsV0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsRUFDQSxTQUFBLEVBQUEsVUFBQSxDQUFBLENBQUE7O0FBRUEscUJBQUEsQ0FBQSxXQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxXQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUE7QUFDQSxxQkFBQSxFQUFBLENBQUE7YUFDQSxNQUNBO0FBQ0EscUJBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUFDQSx5QkFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLFVBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQUNBLDRCQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsRUFBQTtBQUNBLGlDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQ0EsK0JBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxFQUFBLENBQUEsR0FBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQTt5QkFDQTtxQkFDQTtpQkFDQTtBQUNBLHVCQUFBLElBQUEsQ0FBQTthQUNBO0FBQ0EsZ0JBQUEsRUFBQSxDQUFBO0FBQ0Esc0JBQUEsQ0FBQSxZQUFBO0FBQ0EsdUJBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQTthQUNBLEVBQUEsR0FBQSxDQUFBLENBQUE7U0FDQTs7QUFFQSxlQUFBLENBQUEsSUFBQSxDQUFBLENBQUE7S0FDQSxDQUFBOzs7O0FBSUEsYUFBQSxNQUFBLEdBQUE7QUFDQSxZQUFBLENBQUEsaUJBQUEsRUFBQSxPQUFBOztBQUVBLGVBQUEsQ0FBQSxHQUFBLENBQUEsY0FBQSxDQUFBLENBQUE7O0FBRUEsWUFBQSxTQUFBLEdBQUEsQ0FBQSxDQUFBOzs7QUFHQSxXQUFBLENBQUEsU0FBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLFdBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsS0FBQSxFQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQTs7QUFFQSxhQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FBQ0EsaUJBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxVQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7OztBQUdBLG1CQUFBLENBQUEsU0FBQSxDQUFBLFlBQUEsRUFBQSxDQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsRUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBLENBQUEsR0FBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBLFVBQUEsRUFBQSxTQUFBLEVBQUEsVUFBQSxDQUFBLENBQUE7QUFDQSxvQkFBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFBO0FBQ0EsdUJBQUEsQ0FBQSxTQUFBLENBQUEsWUFBQSxFQUFBLENBQUEsR0FBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQTtpQkFDQTtBQUNBLG9CQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLEVBQUE7QUFDQSx1QkFBQSxDQUFBLFNBQUEsQ0FBQSxZQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsRUFBQSxDQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQSxDQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsR0FBQSxVQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsQ0FBQSxDQUFBO2lCQUNBO0FBQ0Esb0JBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLFFBQUEsRUFBQTtBQUNBLHVCQUFBLENBQUEsU0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsU0FBQSxFQUFBLENBQUEsR0FBQSxVQUFBLENBQUEsQ0FBQTtpQkFDQTthQUNBO1NBQ0E7S0FFQTs7OztBQU9BLGFBQUEsUUFBQSxDQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUEsT0FBQSxFQUFBOztBQUVBLFlBQUEsR0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLENBQUE7QUFDQSxZQUFBLEdBQUEsR0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBO0FBQ0EsWUFBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQTtBQUNBLFlBQUEsSUFBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLENBQUE7O0FBR0EsWUFBQSxVQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQTtBQUNBLFlBQUEsV0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLENBQUE7QUFDQSxZQUFBLFNBQUEsR0FBQSxVQUFBLEdBQUEsV0FBQSxDQUFBOzs7O0FBSUEsWUFBQSxnQkFBQSxHQUFBLGlCQUFBLENBQUE7QUFDQSxZQUFBLGNBQUEsR0FBQSxTQUFBLGNBQUEsR0FBQSxFQUFBLENBQUE7O0FBRUEsaUJBQUEsaUJBQUEsQ0FBQSxLQUFBLEVBQUEsSUFBQSxFQUNBOztBQUNBLG1CQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsR0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7U0FDQTs7Ozs7Ozs7QUFRQSxpQkFBQSxVQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsRUFDQTtBQUNBLGdCQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQTtnQkFDQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUE7Z0JBQ0EsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBO2dCQUNBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQTtnQkFDQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLFdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBO2dCQUNBLEdBQUEsR0FBQSxDQUFBLEdBQUEsV0FBQSxJQUFBLFdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBO2dCQUNBLEdBQUEsR0FBQSxDQUFBLEdBQUEsVUFBQSxJQUFBLFdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBO2dCQUNBLEdBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsV0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUE7Z0JBQ0EsTUFBQSxHQUFBLEVBQUEsQ0FBQTtBQUNBLGdCQUFBLEdBQUEsRUFDQSxNQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTtBQUNBLGdCQUFBLEdBQUEsRUFDQSxNQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTtBQUNBLGdCQUFBLEdBQUEsRUFDQSxNQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTtBQUNBLGdCQUFBLEdBQUEsRUFDQSxNQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTtBQUNBLDBCQUFBLENBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUNBLG1CQUFBLE1BQUEsQ0FBQTtTQUNBOzs7OztBQUtBLGlCQUFBLGtCQUFBLENBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxNQUFBLEVBQ0E7QUFDQSxnQkFBQSxHQUFBLEVBQ0E7QUFDQSxvQkFBQSxHQUFBLElBQUEsV0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFDQSxNQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTtBQUNBLG9CQUFBLEdBQUEsSUFBQSxXQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxFQUNBLE1BQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBO2FBQ0E7QUFDQSxnQkFBQSxHQUFBLEVBQ0E7QUFDQSxvQkFBQSxHQUFBLElBQUEsV0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFDQSxNQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTtBQUNBLG9CQUFBLEdBQUEsSUFBQSxXQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxFQUNBLE1BQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBO2FBQ0E7U0FDQTs7Ozs7QUFLQSxpQkFBQSxzQkFBQSxDQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsTUFBQSxFQUNBO0FBQ0EsZUFBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLGVBQUEsR0FBQSxDQUFBLEdBQUEsV0FBQSxDQUFBO0FBQ0EsZUFBQSxHQUFBLENBQUEsR0FBQSxVQUFBLENBQUE7QUFDQSxlQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsR0FBQSxFQUNBO0FBQ0Esb0JBQUEsR0FBQSxJQUFBLFdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQ0EsTUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLENBQUE7QUFDQSxvQkFBQSxHQUFBLElBQUEsV0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFDQSxNQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTthQUNBO0FBQ0EsZ0JBQUEsR0FBQSxFQUNBO0FBQ0Esb0JBQUEsR0FBQSxJQUFBLFdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQ0EsTUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLENBQUE7QUFDQSxvQkFBQSxHQUFBLElBQUEsV0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFDQSxNQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTthQUNBO1NBQ0E7OztBQUdBLGlCQUFBLFdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUNBO0FBQ0EsbUJBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLElBQUEsSUFDQSxLQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsSUFBQSxJQUNBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxRQUFBLENBQUE7U0FDQSxDQUFBOzs7O0FBSUEsaUJBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxLQUFBLEVBQ0E7QUFDQSxnQkFBQSxPQUFBLEdBQUE7O0FBRUEsc0JBQUEsRUFBQSxNQUFBOztBQUVBLHFCQUFBLEVBQUEsS0FBQSxDQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUE7O0FBRUEsaUJBQUEsRUFBQSxLQUFBLENBQUEsQ0FBQTtBQUNBLGlCQUFBLEVBQUEsS0FBQSxDQUFBLENBQUE7OztBQUdBLGlCQUFBLEVBQUEsQ0FBQTs7O0FBR0EsaUJBQUEsRUFBQSxDQUFBO2FBQ0EsQ0FBQTs7QUFFQSxtQkFBQSxPQUFBLENBQUE7U0FDQTs7O0FBR0EsaUJBQUEsYUFBQSxHQUNBOztBQUVBLGdCQUFBLFdBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBLEVBQUEsQ0FBQSxFQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTtBQUNBLGdCQUFBLFNBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBLEVBQUEsQ0FBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTs7QUFFQSxnQkFBQSxLQUFBLEdBQUEsSUFBQSxLQUFBLENBQUEsU0FBQSxDQUFBLENBQUE7O0FBRUEsZ0JBQUEsSUFBQSxHQUFBLENBQUEsV0FBQSxDQUFBLENBQUE7O0FBRUEsZ0JBQUEsTUFBQSxHQUFBLEVBQUEsQ0FBQTs7QUFFQSxnQkFBQSxNQUFBLEdBQUEsRUFBQSxDQUFBOztBQUVBLGdCQUFBLFlBQUEsQ0FBQTs7QUFFQSxnQkFBQSxNQUFBLENBQUE7O0FBRUEsZ0JBQUEsTUFBQSxDQUFBOztBQUVBLGdCQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLENBQUE7O0FBRUEsbUJBQUEsTUFBQSxHQUFBLElBQUEsQ0FBQSxNQUFBLEVBQ0E7QUFDQSxtQkFBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLG1CQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxxQkFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQ0E7QUFDQSx3QkFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsRUFDQTtBQUNBLDJCQUFBLEdBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLDJCQUFBLEdBQUEsQ0FBQSxDQUFBO3FCQUNBO2lCQUNBOztBQUVBLHNCQUFBLEdBQUEsSUFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7O0FBRUEsb0JBQUEsTUFBQSxDQUFBLEtBQUEsS0FBQSxTQUFBLENBQUEsS0FBQSxFQUNBO0FBQ0EsMEJBQUEsR0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLHVCQUNBO0FBQ0EsOEJBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO3FCQUNBLFFBQ0EsTUFBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLEVBQUE7O0FBRUEseUJBQUEsR0FBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUEsQ0FBQTs7QUFFQSwwQkFBQSxDQUFBLE9BQUEsRUFBQSxDQUFBO2lCQUNBO0FBRUE7O0FBRUEsb0NBQUEsR0FBQSxVQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7O0FBRUEsNkJBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsWUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxFQUNBO0FBQ0Esa0NBQUEsR0FBQSxJQUFBLENBQUEsTUFBQSxFQUFBLFlBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsZ0NBQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUNBOztBQUVBLHNDQUFBLENBQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxDQUFBLEdBQUEsZ0JBQUEsQ0FBQSxZQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7O0FBRUEsc0NBQUEsQ0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLENBQUEsR0FBQSxnQkFBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxTQUFBLENBQUEsQ0FBQTs7QUFFQSxvQ0FBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQTs7QUFFQSxxQ0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxJQUFBLENBQUE7NkJBQ0E7eUJBQ0E7O0FBRUEsOEJBQUEsQ0FBQSxJQUFBLENBQUEsTUFBQSxDQUFBLENBQUE7cUJBQ0E7YUFDQTtBQUNBLG1CQUFBLE1BQUEsQ0FBQTtTQUNBOzs7OztBQUtBLGVBQUEsYUFBQSxFQUFBLENBQUE7S0FFQTtDQUdBLENBQUEsQ0FBQTtBQ2poQkEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLEtBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSwyQkFBQTtBQUNBLG1CQUFBLEVBQUEsc0NBQUE7QUFDQSxlQUFBLEVBQUEsaUJBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsSUFBQSxDQUFBO1NBRUE7QUFDQSxjQUFBLEVBQUEsZ0JBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsS0FBQSxDQUFBO1NBQ0E7QUFDQSxrQkFBQSxFQUFBLFNBQUE7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBR0EsR0FBQSxDQUFBLFVBQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUE7O0FBRUEsUUFBQSxNQUFBLEdBQUEsS0FBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLE9BQUEsR0FBQSxNQUFBLENBQUE7QUFDQSxVQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBLEdBQUEsRUFBQSxDQUFBOztBQUVBLGFBQUEsaUJBQUEsR0FBQTtBQUNBLFlBQUEsTUFBQSxFQUFBO0FBQ0EsZ0JBQUEsT0FBQSxHQUFBLFFBQUEsQ0FBQSxvQkFBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsbUJBQUEsQ0FBQSxVQUFBLENBQUEsV0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQTtBQUNBLHNCQUFBLENBQUEsS0FBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUE7QUFDQSxzQkFBQSxDQUFBLGtCQUFBLEVBQUEsQ0FBQTtTQUNBO0FBQ0EsY0FBQSxHQUFBLElBQUEsQ0FBQTtLQUNBO0FBQ0EsVUFBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLEVBQUEsWUFBQTtBQUNBLHlCQUFBLEVBQUEsQ0FBQTtLQUNBLENBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsRUFBQSxZQUFBO0FBQ0EseUJBQUEsRUFBQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBOztBQUdBLFFBQUEsVUFBQSxHQUFBO0FBQ0EsYUFBQSxFQUFBLE1BQUEsQ0FBQSxRQUFBO0FBQ0EsY0FBQSxFQUFBLE1BQUEsQ0FBQSxTQUFBO0FBQ0Esb0JBQUEsRUFBQSxJQUFBOztBQUVBLDBCQUFBLEVBQUEsOEJBQUE7O0FBRUEsZ0JBQUEsUUFBQSxHQUFBLFFBQUEsQ0FBQSxhQUFBLENBQUEsT0FBQSxDQUFBLENBQUE7OztBQUdBLGdCQUFBLFNBQUEsR0FBQSxFQUFBLENBQUE7QUFDQSxpQkFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUFDQSx5QkFBQSxJQUFBLGNBQUEsR0FBQSxDQUFBLEdBQUEsSUFBQSxDQUFBO0FBQ0EscUJBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FBQ0EsNkJBQUEsSUFBQSw2QkFBQSxHQUFBLENBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQTtpQkFDQTtBQUNBLHlCQUFBLElBQUEsT0FBQSxDQUFBO2FBQ0E7QUFDQSxvQkFBQSxDQUFBLFNBQUEsR0FBQSxTQUFBLENBQUE7OztBQUdBLGdCQUFBLEtBQUEsR0FBQSxRQUFBLENBQUEsY0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBO0FBQ0EsaUJBQUEsQ0FBQSxXQUFBLENBQUEsUUFBQSxDQUFBLENBQUE7OztBQUdBLGdCQUFBLENBQUEsZ0JBQUEsRUFBQSxDQUFBO1NBQ0E7O0FBRUEsbUJBQUEsRUFBQSxxQkFBQSxZQUFBLEVBQUE7QUFDQSxpQkFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUFDQSxxQkFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUFDQSx3QkFBQSxJQUFBLEdBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0Esd0JBQUEsSUFBQSxFQUFBO0FBQ0Esb0NBQUEsQ0FBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBO3FCQUNBO2lCQUNBO2FBQ0E7Ozs7Ozs7U0FPQTs7QUFFQSx3QkFBQSxFQUFBLDRCQUFBO0FBQ0EsZ0JBQUEsVUFBQSxHQUFBLFNBQUEsVUFBQSxDQUFBLENBQUEsRUFBQTtBQUNBLG9CQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsTUFBQSxDQUFBO0FBQ0Esb0JBQUEsSUFBQSxDQUFBLFlBQUEsQ0FBQSxhQUFBLENBQUEsSUFBQSxNQUFBLEVBQUE7QUFDQSx3QkFBQSxDQUFBLFNBQUEsR0FBQSxPQUFBLENBQUE7QUFDQSx3QkFBQSxDQUFBLFlBQUEsQ0FBQSxhQUFBLEVBQUEsT0FBQSxDQUFBLENBQUE7aUJBQ0EsTUFBQTtBQUNBLHdCQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQTtBQUNBLHdCQUFBLENBQUEsWUFBQSxDQUFBLGFBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtpQkFDQTthQUNBLENBQUE7QUFDQSxnQkFBQSxTQUFBLEdBQUEsU0FBQSxTQUFBLENBQUEsQ0FBQSxFQUFBO0FBQ0Esb0JBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUE7QUFDQSxvQkFBQSxDQUFBLFNBQUEsR0FBQSxPQUFBLENBQUE7QUFDQSxvQkFBQSxDQUFBLFlBQUEsQ0FBQSxhQUFBLEVBQUEsT0FBQSxDQUFBLENBQUE7YUFDQSxDQUFBO0FBQ0EsZ0JBQUEsS0FBQSxHQUFBLFFBQUEsQ0FBQSxjQUFBLENBQUEsT0FBQSxDQUFBLENBQUE7QUFDQSxpQkFBQSxDQUFBLGdCQUFBLENBQUEsWUFBQSxFQUFBLFlBQUE7QUFDQSxxQkFBQSxDQUFBLGdCQUFBLENBQUEsV0FBQSxFQUFBLFNBQUEsQ0FBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBO0FBQ0EsaUJBQUEsQ0FBQSxnQkFBQSxDQUFBLFVBQUEsRUFBQSxZQUFBO0FBQ0EscUJBQUEsQ0FBQSxtQkFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBO0FBQ0EsaUJBQUEsQ0FBQSxXQUFBLEdBQUEsWUFBQTtBQUNBLHFCQUFBLENBQUEsV0FBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLHFCQUFBLENBQUEsZ0JBQUEsQ0FBQSxZQUFBLENBQUEsQ0FBQTthQUNBLENBQUE7QUFDQSxpQkFBQSxDQUFBLFNBQUEsR0FBQSxZQUFBO0FBQ0EscUJBQUEsQ0FBQSxXQUFBLEdBQUEsSUFBQSxDQUFBO2FBQ0EsQ0FBQTtBQUNBLGlCQUFBLENBQUEsT0FBQSxHQUFBLFVBQUEsQ0FBQTs7QUFFQSxnQkFBQSxDQUFBLGVBQUEsRUFBQSxDQUFBO1NBQ0E7O0FBRUEsdUJBQUEsRUFBQSwyQkFBQTtBQUNBLGdCQUFBLFFBQUEsR0FBQSxRQUFBLENBQUEsY0FBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsUUFBQSxFQUFBO0FBQ0Esd0JBQUEsQ0FBQSxPQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLENBQUE7YUFDQTs7QUFFQSxnQkFBQSxRQUFBLEdBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBQSxVQUFBLENBQUEsQ0FBQTtBQUNBLGdCQUFBLFFBQUEsRUFBQTtBQUNBLHdCQUFBLENBQUEsT0FBQSxHQUFBLElBQUEsQ0FBQSxjQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBO2FBQ0E7O0FBRUEsZ0JBQUEsU0FBQSxHQUFBLFFBQUEsQ0FBQSxjQUFBLENBQUEsV0FBQSxDQUFBLENBQUE7QUFDQSxnQkFBQSxTQUFBLEVBQUE7QUFDQSx5QkFBQSxDQUFBLE9BQUEsR0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQTthQUNBOztBQUVBLGdCQUFBLFNBQUEsR0FBQSxRQUFBLENBQUEsY0FBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsU0FBQSxFQUFBO0FBQ0EseUJBQUEsQ0FBQSxPQUFBLEdBQUEsSUFBQSxDQUFBLFVBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLENBQUE7YUFDQTtTQUNBOztBQUVBLGFBQUEsRUFBQSxpQkFBQTtBQUNBLGdCQUFBLENBQUEsV0FBQSxDQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0Esb0JBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsRUFBQTtBQUNBLHdCQUFBLENBQUEsU0FBQSxHQUFBLE9BQUEsQ0FBQTtBQUNBLHdCQUFBLENBQUEsWUFBQSxDQUFBLGFBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQTtpQkFDQSxNQUFBO0FBQ0Esd0JBQUEsQ0FBQSxTQUFBLEdBQUEsTUFBQSxDQUFBO0FBQ0Esd0JBQUEsQ0FBQSxZQUFBLENBQUEsYUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO2lCQUNBO2FBQ0EsQ0FBQSxDQUFBO1NBQ0E7QUFDQSxrQkFBQSxFQUFBLHNCQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxXQUFBLENBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxvQkFBQSxDQUFBLFNBQUEsR0FBQSxNQUFBLENBQUE7QUFDQSxvQkFBQSxDQUFBLFlBQUEsQ0FBQSxhQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FDQTtBQUNBLFlBQUEsRUFBQSxnQkFBQTtBQUNBLGdCQUFBLENBQUEsV0FBQSxDQUFBLFVBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUE7QUFDQSxvQkFBQSxjQUFBLEdBQUEsQ0FBQTtvQkFBQSxRQUFBO29CQUFBLEtBQUEsQ0FBQTs7QUFFQSxxQkFBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FBQ0EseUJBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQUNBLGdDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsNEJBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsRUFBQTtBQUNBLGlDQUFBLEdBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQTtBQUNBLGdDQUFBLEtBQUEsSUFBQSxLQUFBLENBQUEsWUFBQSxDQUFBLGFBQUEsQ0FBQSxJQUFBLE9BQUEsRUFBQTtBQUNBLDhDQUFBLEVBQUEsQ0FBQTs2QkFDQTt5QkFDQTtxQkFDQTtpQkFDQTs7QUFFQSxvQkFBQSxDQUFBLFlBQUEsQ0FBQSxnQkFBQSxFQUFBLGNBQUEsQ0FBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBOztBQUVBLGdCQUFBLGtCQUFBLEdBQUEsU0FBQSxrQkFBQSxDQUFBLElBQUEsRUFBQTtBQUNBLG9CQUFBLFNBQUEsR0FBQSxJQUFBLENBQUEsWUFBQSxDQUFBLGFBQUEsQ0FBQSxDQUFBO0FBQ0Esb0JBQUEsWUFBQSxHQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsWUFBQSxDQUFBLGdCQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0Esb0JBQUEsU0FBQSxHQUFBLFNBQUEsQ0FBQTs7QUFFQSxvQkFBQSxTQUFBLElBQUEsT0FBQSxLQUFBLFlBQUEsR0FBQSxDQUFBLElBQUEsWUFBQSxHQUFBLENBQUEsQ0FBQSxFQUFBO0FBQ0EsNkJBQUEsR0FBQSxNQUFBLENBQUE7aUJBQ0EsTUFBQSxJQUFBLFNBQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxLQUFBLENBQUEsRUFBQTtBQUNBLDZCQUFBLEdBQUEsT0FBQSxDQUFBO2lCQUNBO0FBQ0EsdUJBQUEsU0FBQSxDQUFBO2FBQ0EsQ0FBQTs7QUFFQSxnQkFBQSxDQUFBLFdBQUEsQ0FBQSxVQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQ0Esb0JBQUEsU0FBQSxHQUFBLGtCQUFBLENBQUEsSUFBQSxDQUFBLENBQUE7QUFDQSxvQkFBQSxDQUFBLFlBQUEsQ0FBQSxhQUFBLEVBQUEsU0FBQSxDQUFBLENBQUE7QUFDQSxvQkFBQSxDQUFBLFlBQUEsQ0FBQSxnQkFBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxvQkFBQSxDQUFBLFNBQUEsR0FBQSxTQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FFQTs7QUFFQSxzQkFBQSxFQUFBLDBCQUFBO0FBQ0EsZ0JBQUEsQ0FBQSxJQUFBLENBQUEsWUFBQSxFQUFBO0FBQ0Esb0JBQUEsSUFBQSxHQUFBLElBQUEsQ0FBQTtBQUNBLG9CQUFBLENBQUEsWUFBQSxHQUFBLFdBQUEsQ0FBQSxZQUFBO0FBQ0Esd0JBQUEsQ0FBQSxJQUFBLEVBQUEsQ0FBQTtpQkFDQSxFQUFBLElBQUEsR0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLENBQUE7YUFDQSxNQUFBO0FBQ0EsNkJBQUEsQ0FBQSxJQUFBLENBQUEsWUFBQSxDQUFBLENBQUE7QUFDQSxvQkFBQSxDQUFBLFlBQUEsR0FBQSxJQUFBLENBQUE7YUFDQTtBQUNBLGdCQUFBLE1BQUEsQ0FBQSxPQUFBLEtBQUEsTUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxPQUFBLEdBQUEsTUFBQSxDQUFBO0FBQ0Esd0JBQUEsQ0FBQSxjQUFBLENBQUEsVUFBQSxDQUFBLENBQUEsS0FBQSxDQUFBLGVBQUEsR0FBQSxLQUFBLENBQUE7YUFDQSxNQUFBO0FBQ0Esc0JBQUEsQ0FBQSxPQUFBLEdBQUEsTUFBQSxDQUFBO0FBQ0Esd0JBQUEsQ0FBQSxjQUFBLENBQUEsVUFBQSxDQUFBLENBQUEsS0FBQSxDQUFBLGVBQUEsR0FBQSxTQUFBLENBQUE7YUFDQTtBQUNBLGtCQUFBLENBQUEsT0FBQSxFQUFBLENBQUE7U0FDQTtBQUNBLGtCQUFBLEVBQUEsb0JBQUEsR0FBQSxFQUFBO0FBQ0EsZ0JBQUEsR0FBQSxFQUFBO0FBQ0Esb0JBQUEsQ0FBQSxVQUFBLEVBQUEsQ0FBQTtBQUNBLG9CQUFBLENBQUEsV0FBQSxDQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0Esd0JBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDQSw0QkFBQSxDQUFBLFNBQUEsR0FBQSxPQUFBLENBQUE7QUFDQSw0QkFBQSxDQUFBLFlBQUEsQ0FBQSxhQUFBLEVBQUEsT0FBQSxDQUFBLENBQUE7cUJBQ0EsTUFBQTtBQUNBLDRCQUFBLENBQUEsU0FBQSxHQUFBLE1BQUEsQ0FBQTtBQUNBLDRCQUFBLENBQUEsWUFBQSxDQUFBLGFBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtxQkFDQTtpQkFDQSxDQUFBLENBQUE7YUFDQTtTQUNBOztLQUVBLENBQUE7QUFDQSxRQUFBLFNBQUEsR0FBQTtBQUNBLDJCQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxDQUFBO0FBQ0Esd0JBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxDQUFBO0FBQ0Esa0JBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLENBQUE7QUFDQSx5QkFBQSxFQUFBLENBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxDQUFBO0tBQ0EsQ0FBQTtBQUNBLFVBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxFQUFBLFlBQUE7QUFDQSxZQUFBLFNBQUEsR0FBQSxJQUFBLE9BQUEsQ0FBQSxVQUFBLE9BQUEsRUFBQTtBQUNBLGdCQUFBLEdBQUEsR0FBQSxTQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsR0FBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxRQUFBLEdBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0Esc0JBQUEsQ0FBQSxTQUFBLEdBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsdUJBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTthQUNBO1NBQ0EsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLEdBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO1NBQ0EsQ0FBQSxDQUFBO0tBQ0EsQ0FBQSxDQUFBO0FBQ0EsVUFBQSxDQUFBLFNBQUEsR0FBQSxDQUFBLENBQUE7QUFDQSxVQUFBLENBQUEsTUFBQSxDQUFBLFdBQUEsRUFBQSxZQUFBLEVBRUEsQ0FBQSxDQUFBOztBQUVBLGNBQUEsQ0FBQSxrQkFBQSxFQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FDcFFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsWUFBQSxFQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsV0FBQTtBQUNBLGVBQUEsRUFBQSxtQkFBQTtBQUNBLG1CQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsbUJBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLEdBQUEsRUFBQTtBQUNBLHVCQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7U0FDQTtLQUNBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBRUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFlBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxxQkFBQTtBQUNBLG1CQUFBLEVBQUEsdUNBQUE7QUFDQSxlQUFBLEVBQUEsaUJBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsSUFBQSxDQUFBO1NBRUE7QUFDQSxjQUFBLEVBQUEsZ0JBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsS0FBQSxDQUFBO1NBQ0E7QUFDQSxlQUFBLEVBQUE7QUFDQSxzQkFBQSxFQUFBLG9CQUFBLFVBQUEsRUFBQTtBQUNBLHVCQUFBLFVBQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQTthQUNBO1NBQ0E7QUFDQSxrQkFBQSxFQUFBLFNBQUE7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FBR0EsR0FBQSxDQUFBLFVBQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxTQUFBLEVBQUE7QUFDQSxVQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxVQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLGVBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtLQUNBLENBQUEsQ0FBQTs7QUFFQSxhQUFBLENBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsRUFBQSxFQUFBO0FBQ0EsWUFBQSxLQUFBLEdBQUEsUUFBQSxDQUFBLHNCQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7O0FBRUEsWUFBQSxLQUFBLEdBQUEsS0FBQSxDQUFBLFdBQUEsR0FBQSxFQUFBLENBQUE7QUFDQSxZQUFBLE1BQUEsR0FBQSxJQUFBLENBQUE7O0FBRUEsWUFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FDQSxNQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLENBQUEsQ0FDQSxLQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQTs7QUFFQSxZQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUNBLE1BQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQSxDQUNBLEtBQUEsQ0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBOztBQUVBLGlCQUFBLEtBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7U0FDQTtBQUNBLGlCQUFBLE9BQUEsQ0FBQSxDQUFBLEVBQUE7QUFDQSxtQkFBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7U0FDQTtBQUNBLGlCQUFBLFFBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDQSxnQkFBQSxJQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQTtBQUNBLGdCQUFBLENBQUEsSUFBQSxFQUFBLE9BQUEsT0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsU0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxJQUFBLElBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLENBQUEsRUFBQSxPQUFBLFNBQUEsQ0FBQSxLQUNBLElBQUEsSUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxFQUFBLE9BQUEsU0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxDQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxJQUFBLElBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxJQUFBLENBQUEsRUFBQSxPQUFBLFNBQUEsQ0FBQSxLQUNBLElBQUEsSUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxFQUFBLE9BQUEsU0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxDQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxJQUFBLElBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxJQUFBLENBQUEsRUFBQSxPQUFBLFNBQUEsQ0FBQSxLQUNBLElBQUEsSUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxFQUFBLE9BQUEsU0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxDQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxJQUFBLElBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxPQUFBLFNBQUEsQ0FBQSxLQUNBLElBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsU0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxJQUFBLElBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxPQUFBLFNBQUEsQ0FBQSxLQUNBLElBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsU0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxJQUFBLElBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxPQUFBLFNBQUEsQ0FBQSxLQUNBLElBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsU0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxJQUFBLElBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxPQUFBLFNBQUEsQ0FBQSxLQUNBLElBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsU0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxJQUFBLElBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxPQUFBLFNBQUEsQ0FBQSxLQUNBLElBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsU0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxJQUFBLElBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxPQUFBLFNBQUEsQ0FBQSxLQUNBLElBQUEsSUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsU0FBQSxDQUFBLEtBQ0EsSUFBQSxJQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsT0FBQSxTQUFBLENBQUEsS0FDQSxJQUFBLElBQUEsR0FBQSxFQUFBLEVBQUEsT0FBQSxTQUFBLENBQUE7U0FDQTtBQUNBLGlCQUFBLFNBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDQSxtQkFBQSxZQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBO1NBQ0E7QUFDQSxpQkFBQSxJQUFBLEdBQUE7QUFDQSxrQkFBQSxDQUFBLElBQUEsQ0FBQSxXQUFBLEVBQUEsU0FBQSxDQUFBLENBQUE7U0FDQTs7QUFFQSxZQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsT0FBQSxFQUFBLEtBQUEsQ0FBQSxDQUNBLElBQUEsQ0FBQSxRQUFBLEVBQUEsTUFBQSxDQUFBLENBQ0EsSUFBQSxDQUFBLE9BQUEsRUFBQSxRQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsU0FBQSxFQUFBLE1BQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxHQUFBLE1BQUEsQ0FBQSxDQUNBLElBQUEsQ0FBQSxxQkFBQSxFQUFBLGVBQUEsQ0FBQSxDQUNBLE1BQUEsQ0FBQSxHQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsRUFBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxNQUFBLEVBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQTs7QUFFQSxXQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUNBLElBQUEsQ0FBQSxPQUFBLEVBQUEsU0FBQSxDQUFBLENBQ0EsSUFBQSxDQUFBLE9BQUEsRUFBQSxLQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsUUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBOztBQUVBLFlBQUEsTUFBQSxHQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLENBQ0EsSUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsQ0FDQSxLQUFBLEVBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLENBQ0EsSUFBQSxDQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxDQUNBLElBQUEsQ0FBQSxPQUFBLEVBQUEsUUFBQSxDQUFBLENBQ0EsSUFBQSxDQUFBLE1BQUEsRUFBQSxRQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsV0FBQSxFQUFBLFNBQUEsQ0FBQSxDQUNBLEVBQUEsQ0FBQSxXQUFBLEVBQUEsWUFBQTtBQUNBLGVBQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQ0Esb0JBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsRUFBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsZUFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxLQUFBLENBQUEsR0FBQSxTQUFBLENBQUEsS0FDQSxPQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxJQUFBLEdBQUEsWUFBQSxHQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxZQUFBLEdBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxPQUFBLENBQUEsR0FBQSxlQUFBLEdBQUEsSUFBQSxHQUFBLFFBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsY0FBQSxHQUFBLElBQUEsR0FBQSxlQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLEtBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQTthQUNBLENBQUEsQ0FBQTtTQUNBLENBQUEsQ0FBQTtBQUNBLFVBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxXQUFBLENBQUEsQ0FBQTtLQUNBLENBQUEsQ0FBQTtDQUVBLENBQUEsQ0FBQTs7QUNoSUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxpQkFBQTtBQUNBLG1CQUFBLEVBQUEsNkJBQUE7QUFDQSxlQUFBLEVBQUEsaUJBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsSUFBQSxDQUFBO1NBRUE7QUFDQSxjQUFBLEVBQUEsZ0JBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsS0FBQSxDQUFBO1NBQ0E7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FDWkEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsS0FBQSxDQUFBLFFBQUEsRUFBQTtBQUNBLFdBQUEsRUFBQSxvQkFBQTtBQUNBLG1CQUFBLEVBQUEsa0NBQUE7QUFDQSxlQUFBLEVBQUEsaUJBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsSUFBQSxDQUFBO1NBRUE7QUFDQSxjQUFBLEVBQUEsZ0JBQUEsVUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLEdBQUEsS0FBQSxDQUFBO1NBQ0E7S0FDQSxDQUFBLENBQUE7Q0FDQSxDQUFBLENBQUE7O0FDWkEsR0FBQSxDQUFBLFNBQUEsQ0FBQSxpQkFBQSxFQUFBLENBQUEsV0FBQSxFQUFBLFVBQUEsU0FBQSxFQUFBO0FBQ0EsV0FBQTtBQUNBLGdCQUFBLEVBQUEsSUFBQTtBQUNBLGFBQUEsRUFBQSxFQUFBO0FBQ0EsbUJBQUEsRUFBQSwyQ0FBQTtBQUNBLFlBQUEsRUFBQSxjQUFBLEtBQUEsRUFBQTtBQUNBLGlCQUFBLENBQUEsWUFBQSxHQUFBLFlBQUE7QUFDQSx5QkFBQSxDQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsUUFBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxRQUFBLEVBQUEsT0FBQSxDQUFBLENBQUE7aUJBQ0EsQ0FBQSxDQUFBO2FBQ0EsQ0FBQTtBQUNBLGlCQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUE7QUFDQSx1QkFBQSxDQUFBLEdBQUEsQ0FBQSwyQkFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUNBLHlCQUFBLENBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsRUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtpQkFDQSxDQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7QUFDQSxpQkFBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ0EsdUJBQUEsQ0FBQSxHQUFBLENBQUEsdUJBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7QUFDQSx5QkFBQSxDQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxDQUFBLENBQUE7aUJBQ0EsQ0FBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFBO0FBQ0EsaUJBQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQTtBQUNBLHVCQUFBLENBQUEsR0FBQSxDQUFBLHVCQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO0FBQ0EseUJBQUEsQ0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxFQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBO2lCQUNBLENBQUEsQ0FBQTthQUNBLENBQUEsQ0FBQTtBQUNBLGlCQUFBLENBQUEsTUFBQSxDQUFBLE9BQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUE7QUFDQSx1QkFBQSxDQUFBLEdBQUEsQ0FBQSxvQkFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUNBLHlCQUFBLENBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsRUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtpQkFDQSxDQUFBLENBQUE7YUFDQSxDQUFBLENBQUE7QUFDQSxxQkFBQSxDQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBLGtCQUFBLENBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUNBLE1BQUEsQ0FBQSxRQUFBLENBQUEsQ0FDQSxJQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxFQUFBLElBQUEsR0FBQSxDQUFBLENBQ0EsSUFBQSxDQUFBLElBQUEsRUFBQSxLQUFBLENBQUEsRUFBQSxJQUFBLEdBQUEsQ0FBQSxDQUNBLElBQUEsQ0FBQSxHQUFBLEVBQUEsS0FBQSxDQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsQ0FDQSxLQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsQ0FBQSxDQUNBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsS0FBQSxDQUFBLENBQUE7YUFFQSxDQUFBLENBQUE7U0FDQSxFQUFBLENBQUE7Q0FDQSxDQUFBLENBQUEsQ0FBQTs7QUM5Q0EsR0FBQSxDQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQUEsWUFBQTtBQUNBLFdBQUE7QUFDQSxnQkFBQSxFQUFBLEdBQUE7QUFDQSxtQkFBQSxFQUFBLHFDQUFBO0tBQ0EsQ0FBQTtDQUNBLENBQUEsQ0FBQTs7QUNMQSxHQUFBLENBQUEsU0FBQSxDQUFBLFFBQUEsRUFBQSxZQUFBOztBQUVBLFdBQUE7QUFDQSxnQkFBQSxFQUFBLEdBQUE7QUFDQSxhQUFBLEVBQUEsRUFBQTtBQUNBLG1CQUFBLEVBQUEseUNBQUE7QUFDQSxZQUFBLEVBQUEsY0FBQSxLQUFBLEVBQUE7O0FBRUEsaUJBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FDQSxFQUFBLEtBQUEsRUFBQSxVQUFBLEVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxFQUNBLEVBQUEsS0FBQSxFQUFBLFdBQUEsRUFBQSxLQUFBLEVBQUEsVUFBQSxFQUFBLEVBQ0EsRUFBQSxLQUFBLEVBQUEsY0FBQSxFQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUEsRUFDQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxFQUNBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLENBQ0EsQ0FBQTtTQUNBOztLQUVBLENBQUE7Q0FFQSxDQUFBLENBQUEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLy9oaWRlIGxvYWRlclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZWxvYWRlcicpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxud2luZG93LmFwcCA9IGFuZ3VsYXIubW9kdWxlKCdNYWluJywgWyd1aS5yb3V0ZXInLCAnZDMnLCAnZHVTY3JvbGwnLCduZ0FuaW1hdGUnXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAvLyBUaGlzIHR1cm5zIG9mZiBoYXNoYmFuZyB1cmxzICgvI2Fib3V0KSBhbmQgY2hhbmdlcyBpdCB0byBzb21ldGhpbmcgbm9ybWFsICgvYWJvdXQpXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbn0pO1xuXG4iLCJhcHAuY29uZmlnKCgkc3RhdGVQcm92aWRlcikgPT4ge1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGBhYm91dGAsIHtcbiAgICAgIHVybDogYC9hYm91dGAsXG4gICAgICBvbkVudGVyOiAoJGRvY3VtZW50LCAkcm9vdFNjb3BlKSA9PiB7XG4gICAgICAgICRyb290U2NvcGUudW5BbmltYXRlZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IGFib3V0ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhYm91dCcpKVxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRkb2N1bWVudC5zY3JvbGxUb0VsZW1lbnRBbmltYXRlZChhYm91dCwgMTAwLCA4MDApXG4gICAgICAgIH0sIDApXG4gICAgICAgIH0sXG4gICAgICBvbkV4aXQ6ICgkcm9vdFNjb3BlKSA9PiB7XG4gICAgICAgICRyb290U2NvcGUudW5BbmltYXRlZCA9IGZhbHNlO1xuICAgICAgfVxuICB9KTtcbn0pO1xuIiwiYXBwLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIpID0+IHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShgYmxvZ2AsIHtcbiAgICAgICAgdXJsOiBgL2Jsb2dgLFxuICAgICAgICB0ZW1wbGF0ZVVybDogYGpzL2Jsb2cvYmxvZy5odG1sYCxcbiAgICAgICAgb25FbnRlcjogKCRyb290U2NvcGUpID0+IHtcbiAgICAgICAgICAkcm9vdFNjb3BlLmhpZGRlbiA9IHRydWU7XG4gICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIG9uRXhpdDogKCRyb290U2NvcGUpID0+IHtcbiAgICAgICAgICAkcm9vdFNjb3BlLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBjb250cm9sbGVyOiBgYmxvZ2N0cmxgXG4gICAgfSk7XG59KTtcblxuIFxuYXBwLmNvbnRyb2xsZXIoYGJsb2djdHJsYCwgKCRzY29wZSkgPT4ge1xuICAgIGNvbnN0ICRibG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jsb2cnKTtcbiAgICAkc2NvcGUuZG9uZWxvYWRpbmcgPSBmYWxzZTsgICBcbiAgICB3aW5kb3cub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQuZGF0YSA9PSBgZG9uZWxvYWRpbmdgKSB7IFxuICAgICAgICAkc2NvcGUuZG9uZWxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICRibG9nLnN0eWxlLmhlaWdodCA9ICcxMDB2aCdcbiAgICAgIH1cbiAgICB9O1xufSk7XG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NvZGUnLCB7XG4gICAgICAgIHVybDogJy9jb2RlJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb2RlL2NvZGUuaHRtbCcsXG4gICAgICAgIG9uRW50ZXI6IGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBvbkV4aXQ6IGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgY29udHJvbGxlcjogJ2NvZGVjdHJsJ1xuICAgIH0pO1xufSk7XG5cblxuYXBwLmNvbnRyb2xsZXIoJ2NvZGVjdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkcSkge1xuICAkc2NvcGUuaW50ZXJlc3RzID0gW1xuICAgIHtuYW1lOiAnY29tcHV0ZXJTY2llbmNlJyxcbiAgICAgJ3VybCcgOiAnaHR0cDovL3M5LnBvc3RpbWcub3JnL2F2NzJrYzV3di9jb2RlXzJfMjU2LnBuZycsXG4gICAgICdtZXNzYWdlJzogJ0dlbmVyYWwgQ29tcHV0ZXIgU2NpZW5jZSBGdW4nfSxcbiAgICB7bmFtZTogJ2QzJyxcbiAgICAgdXJsIDogJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kMy9kMy1sb2dvL21hc3Rlci9kMy5wbmcnLFxuICAgICBtZXNzYWdlOiAnRGF0YSBWaXMgU3R1ZmYnfSxcbiAgICB7bmFtZTogJ2FuZ3VsYXInLFxuICAgICB1cmwgOiAnaHR0cHM6Ly9hbmd1bGFyanMub3JnL2ltZy9uZy1sb2dvLnBuZycsXG4gICAgIG1lc3NhZ2U6ICdBbmd1bGFyJ30sXG4gICAgIHtuYW1lOiAncmVhY3QnLFxuICAgICB1cmwgOiAnaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy90aHVtYi81LzU3L1JlYWN0LmpzX2xvZ28uc3ZnLzIwMDBweC1SZWFjdC5qc19sb2dvLnN2Zy5wbmcnLFxuICAgICBtZXNzYWdlOiAnUmVhY3QgLyBGbHV4IC8gUmVkdXgnfSxcbiAgICB7bmFtZTogJ25vZGUnLFxuICAgICB1cmwgOiAnaHR0cHM6Ly9ub2RlanMub3JnL3N0YXRpYy9pbWFnZXMvbG9nb3Mvbm9kZWpzLW5ldy13aGl0ZS1wYW50b25lLnBuZycsXG4gICAgIG1lc3NhZ2U6ICdCYWNrIEVuZCBTdHVmZid9XG5dO1xuICAgIFxudmFyIHBsYWNlaG9sZGVyO1xuXG4kc2NvcGUubW91c2VlbnRlcmZuID0gZnVuY3Rpb24gKCkge1xuICAgIHBsYWNlaG9sZGVyID0gdGhpcy5pbnRlcmVzdC51cmw7XG4gICAgdGhpcy5pbnRlcmVzdC51cmwgPSAnJztcbn07XG5cbiRzY29wZS5tb3VzZWxlYXZlZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pbnRlcmVzdC51cmwgPSBwbGFjZWhvbGRlcjtcbn07XG5cbiRzY29wZS5ydW5mdW5jdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICRzdGF0ZS5nbyh0aGlzLmludGVyZXN0Lm5hbWUpXG4gICAgICBcblxufTtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY29udGFjdCcsIHtcbiAgICAgICAgdXJsOiAnL2NvbnRhY3QnLFxuICAgICAgICBvbkVudGVyOiAoJGRvY3VtZW50LCAkcm9vdFNjb3BlKSA9PiB7XG4gICAgICAgICRyb290U2NvcGUudW5BbmltYXRlZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IGZvb3RlciA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9vdGVyJykpXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAkZG9jdW1lbnQuc2Nyb2xsVG9FbGVtZW50QW5pbWF0ZWQoZm9vdGVyLCAxMDAsIDgwMClcbiAgICAgICAgfSwgMClcbiAgICAgICAgfSxcbiAgICAgIFx0b25FeGl0OiAoJHJvb3RTY29wZSkgPT4ge1xuICAgICAgICAkcm9vdFNjb3BlLnVuQW5pbWF0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2QzJywgW10pXG4gIC5mYWN0b3J5KCdkM1NlcnZpY2UnLCBbJyRkb2N1bWVudCcsICckcScsICckcm9vdFNjb3BlJyxcbiAgICBmdW5jdGlvbigkZG9jdW1lbnQsICRxLCAkcm9vdFNjb3BlKSB7XG4gICAgICB2YXIgZCA9ICRxLmRlZmVyKCk7XG4gICAgICBmdW5jdGlvbiBvblNjcmlwdExvYWQoKSB7XG4gICAgICAgIC8vIExvYWQgY2xpZW50IGluIHRoZSBicm93c2VyXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkgeyBkLnJlc29sdmUod2luZG93LmQzKTsgfSk7XG4gICAgICB9XG4gICAgICAvLyBDcmVhdGUgYSBzY3JpcHQgdGFnIHdpdGggZDMgYXMgdGhlIHNvdXJjZVxuICAgICAgLy8gYW5kIGNhbGwgb3VyIG9uU2NyaXB0TG9hZCBjYWxsYmFjayB3aGVuIGl0XG4gICAgICAvLyBoYXMgYmVlbiBsb2FkZWRcbiAgICAgIHZhciBzY3JpcHRUYWcgPSAkZG9jdW1lbnRbMF0uY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBzY3JpcHRUYWcudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBcbiAgICAgIHNjcmlwdFRhZy5hc3luYyA9IHRydWU7XG4gICAgICBzY3JpcHRUYWcuc3JjID0gJ2h0dHA6Ly9kM2pzLm9yZy9kMy52My5taW4uanMnO1xuICAgICAgc2NyaXB0VGFnLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykgb25TY3JpcHRMb2FkKCk7XG4gICAgICB9O1xuICAgICAgc2NyaXB0VGFnLm9ubG9hZCA9IG9uU2NyaXB0TG9hZDtcblxuICAgICAgdmFyIHMgPSAkZG9jdW1lbnRbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcbiAgICAgIHMuYXBwZW5kQ2hpbGQoc2NyaXB0VGFnKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZDM6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZC5wcm9taXNlOyB9XG4gICAgICB9O1xufV0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICBcdG9uRW50ZXI6ICgkZG9jdW1lbnQsICRyb290U2NvcGUpID0+IHtcblx0ICAgICAgICAkcm9vdFNjb3BlLnVuQW5pbWF0ZWQgPSB0cnVlO1xuXHQgICAgICAgIGNvbnN0IHRvcCA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9wJykpXG5cdCAgICAgICAgICAkZG9jdW1lbnQuc2Nyb2xsVG9FbGVtZW50QW5pbWF0ZWQodG9wLCAwLCA4MDApXG4gICAgICAgIH0sXG4gICAgICBcdG9uRXhpdDogKCRyb290U2NvcGUpID0+IHtcblx0ICAgICAgICAkcm9vdFNjb3BlLnVuQW5pbWF0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvamVjdHMnLCB7XG4gICAgICAgIHVybDogJy9wcm9qZWN0cycsXG4gICAgICAgIG9uRW50ZXI6ICgkZG9jdW1lbnQsICRyb290U2NvcGUpID0+IHtcbiAgICAgICAgJHJvb3RTY29wZS51bkFuaW1hdGVkID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgcHJvamVjdHMgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3RzJykpXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkZG9jdW1lbnQuc2Nyb2xsVG9FbGVtZW50QW5pbWF0ZWQocHJvamVjdHMsIC03NSwgODAwKVxuICAgICAgICB9LCAwKSAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIG9uRXhpdDogKCRyb290U2NvcGUpID0+IHtcbiAgICAgICAgJHJvb3RTY29wZS51bkFuaW1hdGVkID0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgICBjb250cm9sbGVyOiAncHJvamVjdGNvbnRyb2xsZXInXG4gICAgfSk7XG59KTtcblxuXG5hcHAuY29udHJvbGxlcigncHJvamVjdGNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlKSB7XG5cbiAgICBjb25zdCBnZXRTaWJsaW5ncyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGxldCBzaWJsaW5ncyA9IFtdO1xuICAgICAgICBsZXQgc2libGluZyA9IGVsZW1lbnQucGFyZW50Tm9kZS5maXJzdENoaWxkO1xuICAgICAgICBmb3IgKCA7IHNpYmxpbmc7IHNpYmxpbmcgPSBzaWJsaW5nLm5leHRTaWJsaW5nICkge1xuICAgICAgICAgICAgaWYgKCBzaWJsaW5nLm5vZGVUeXBlID09PSAxICkge1xuICAgICAgICAgICAgICAgIHNpYmxpbmdzLnB1c2goIHNpYmxpbmcgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2libGluZ3M7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbW92ZVNpYmxpbmdDbGFzc2VzID0gKG5vZGUpID0+IHtcbiAgICAgICAgbGV0IHNpYmxpbmdzID0gZ2V0U2libGluZ3Mobm9kZSlcbiAgICAgICAgc2libGluZ3MuZm9yRWFjaChmdW5jdGlvbihzaWJsaW5nKSB7XG4gICAgICAgICAgICBzaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgc2libGluZy5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZS1pbicpO1xuICAgICAgICAgICAgc2libGluZy5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZS1pbi1yZXZlcnNlJyk7XG4gICAgICAgICAgICBzaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3NsaWRlLW91dCcpO1xuICAgICAgICAgICAgc2libGluZy5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZS1vdXQtcmV2ZXJzZScpO1xuICAgICAgICAgICAgc2libGluZy5jbGFzc0xpc3QucmVtb3ZlKCduZXh0Jyk7XG4gICAgICAgICAgICBzaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZXYnKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAkc2NvcGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgIGxldCBjdXJyZW50SXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2l0ZW0gYWN0aXZlJylbMF07XG4gICAgICAgbGV0IHNpYmxpbmdzID0gZ2V0U2libGluZ3MoY3VycmVudEl0ZW0pO1xuICAgICAgIGxldCBpZHggPSBzaWJsaW5ncy5pbmRleE9mKGN1cnJlbnRJdGVtKSArIDEgPT09IHNpYmxpbmdzLmxlbmd0aCA/ICAwIDogc2libGluZ3MuaW5kZXhPZihjdXJyZW50SXRlbSkgKyAxO1xuICAgICAgIHJlbW92ZVNpYmxpbmdDbGFzc2VzKGN1cnJlbnRJdGVtKTtcbiAgICAgICBjdXJyZW50SXRlbS5jbGFzc0xpc3QuYWRkKCdzbGlkZS1vdXQnKVxuICAgICAgIGN1cnJlbnRJdGVtLmNsYXNzTGlzdC5hZGQoJ3ByZXYnKVxuICAgICAgIGN1cnJlbnRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgIHNpYmxpbmdzW2lkeF0uY2xhc3NMaXN0LmFkZCgnc2xpZGUtaW4nKVxuICAgICAgIHNpYmxpbmdzW2lkeF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9XG5cbiAgICAkc2NvcGUucHJldiA9IGZ1bmN0aW9uKCkge1xuICAgICAgIGxldCBjdXJyZW50SXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2l0ZW0gYWN0aXZlJylbMF07XG4gICAgICAgbGV0IHNpYmxpbmdzID0gZ2V0U2libGluZ3MoY3VycmVudEl0ZW0pO1xuICAgICAgIGxldCBpZHggPSBzaWJsaW5ncy5pbmRleE9mKGN1cnJlbnRJdGVtKSAtIDEgPT09IC0xID8gc2libGluZ3MubGVuZ3RoIC0xIDogc2libGluZ3MuaW5kZXhPZihjdXJyZW50SXRlbSkgLSAxO1xuICAgICAgIHJlbW92ZVNpYmxpbmdDbGFzc2VzKGN1cnJlbnRJdGVtKTtcbiAgICAgICBjdXJyZW50SXRlbS5jbGFzc0xpc3QuYWRkKCdzbGlkZS1vdXQtcmV2ZXJzZScpXG4gICAgICAgY3VycmVudEl0ZW0uY2xhc3NMaXN0LmFkZCgnbmV4dCcpXG4gICAgICAgY3VycmVudEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICBzaWJsaW5nc1tpZHhdLmNsYXNzTGlzdC5hZGQoJ3NsaWRlLWluLXJldmVyc2UnKVxuICAgICAgIHNpYmxpbmdzW2lkeF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNoYW5nZWp1bWJvID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBsZXQgdGFyZ2V0SXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUpXG4gICAgICAgIGxldCBjdXJyZW50SXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2l0ZW0gYWN0aXZlJylbMF07XG4gICAgICAgIGxldCBzaWJsaW5ncyA9IGdldFNpYmxpbmdzKGN1cnJlbnRJdGVtKTtcbiAgICAgICAgcmVtb3ZlU2libGluZ0NsYXNzZXModGFyZ2V0SXRlbSk7XG4gICAgICAgIHRhcmdldEl0ZW0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfTtcbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ3Jlc3VtZUZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3Jlc3VtZScsIHtyZXNwb25zZVR5cGU6J2FycmF5YnVmZmVyJ30pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgIHZhciBmaWxlID0gbmV3IEJsb2IoW3Jlcy5kYXRhXSwge3R5cGU6ICdhcHBsaWNhdGlvbi9wZGYnfSk7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVVUkwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlVVJMO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Jlc3VtZScsIHtcbiAgICAgICAgdXJsOiAnL3Jlc3VtZScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcmVzdW1lL3Jlc3VtZS5odG1sJyxcbiAgICAgICAgb25FbnRlcjogZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLmhpZGRlbiA9IHRydWU7XG4gICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIG9uRXhpdDogZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICByZXN1bWUgOiBmdW5jdGlvbihyZXN1bWVGYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VtZUZhY3RvcnkuZ2V0RGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb250cm9sbGVyOiAncmVzdW1lY3RybCdcbiAgICB9KTtcbn0pO1xuXG5cbmFwcC5jb250cm9sbGVyKCdyZXN1bWVjdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgcmVzdW1lLCAkc2NlKSB7XG5cbiAgICAgICAkc2NvcGUucmVzdW1lID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwocmVzdW1lKTtcbn0pO1xuIiwiYXBwLmNvbmZpZyggKCRzdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYGFuZ3VsYXJgLCB7XG4gICAgICAgIHVybDogYC9jb2RlL2FuZ3VsYXJgLFxuICAgICAgICB0ZW1wbGF0ZVVybDogYGpzL2NvZGUvYW5ndWxhci9hbmd1bGFyc3RhdGUuaHRtbGAsXG4gICAgICAgIG9uRW50ZXI6ICgkcm9vdFNjb3BlKSA9PiB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBvbkV4aXQ6ICgkcm9vdFNjb3BlKSA9PiB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbiIsImFwcC5jb25maWcoICgkc3RhdGVQcm92aWRlcikgPT4ge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGBjb21wdXRlclNjaWVuY2VgLCB7XG4gICAgICAgIHVybDogYC9jb2RlL2NvbXB1dGVyc2NpZW5jZWAsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBganMvY29kZS9jb21wdXRlclNjaWVuY2UvY29tcHV0ZXJzY2llbmNlLmh0bWxgLFxuICAgICAgICBvbkVudGVyOiAoJHJvb3RTY29wZSkgPT4ge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgb25FeGl0OiAoJHJvb3RTY29wZSkgPT4ge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnZDMnLCB7XG4gICAgICAgIHVybDogJy9jb2RlL2QzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb2RlL2QzL2Qzc3RhdGUuaHRtbCcsXG4gICAgICAgIG9uRW50ZXI6IGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICBvbkV4aXQ6IGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdub2RlJywge1xuICAgICAgICB1cmw6ICcvY29kZS9ub2RlJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb2RlL25vZGUvbm9kZXN0YXRlLmh0bWwnLFxuICAgICAgICBvbkVudGVyOiBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgb25FeGl0OiBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncmVhY3QnLCB7XG4gICAgICAgIHVybDogJy9jb2RlL3JlYWN0JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb2RlL3JlYWN0L3JlYWN0c3RhdGUuaHRtbCcsXG4gICAgICAgIG9uRW50ZXI6IGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICBvbkV4aXQ6IGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdDb2RlLUUnLCB7XG4gICAgICAgIHVybDogJy9wcm9qZWN0cy9jb2RlLUUnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3Byb2plY3RzL0NvZGUtRS9Db2RlLUUuaHRtbCcsXG4gICAgICAgIG9uRW50ZXI6ICgkZG9jdW1lbnQsICRyb290U2NvcGUpID0+IHtcbiAgICAgICAgICAkcm9vdFNjb3BlLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXhpdDogKCRyb290U2NvcGUsICRsb2NhdGlvbikgPT4ge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgJHJvb3RTY29wZS51bkFuaW1hdGVkID0gZmFsc2U7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wcm9qZWN0cycpO1xuICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdub3RvJywge1xuICAgICAgICB1cmw6ICcvcHJvamVjdHMvbm90bycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcHJvamVjdHMvTm90by9Ob3RvLmh0bWwnLFxuICAgICAgICAgb25FbnRlcjogKCRkb2N1bWVudCwgJHJvb3RTY29wZSkgPT4ge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25FeGl0OiAoJHJvb3RTY29wZSwgJGxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgICAkcm9vdFNjb3BlLnVuQW5pbWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2plY3RzJylcbiAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbm93YWl0Jywge1xuICAgICAgICB1cmw6ICcvcHJvamVjdHMvTm93YWl0JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9wcm9qZWN0cy9Ob3dhaXQvTm93YWl0Lmh0bWwnLFxuICAgICAgICBvbkVudGVyOiAoJGRvY3VtZW50LCAkcm9vdFNjb3BlKSA9PiB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBvbkV4aXQ6ICgkcm9vdFNjb3BlLCAkbG9jYXRpb24pID0+IHtcbiAgICAgICAgICAkcm9vdFNjb3BlLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICRyb290U2NvcGUudW5BbmltYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcHJvamVjdHMnKVxuICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdmaWx0ZXJzJywge1xuICAgICAgICB1cmw6ICcvY29kZS9hbmd1bGFyL2ZpbHRlcnMnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvZGUvYW5ndWxhci9maWx0ZXJzL2ZpbHRlcnMuaHRtbCcsXG4gICAgICAgIG9uRW50ZXI6IGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICBvbkV4aXQ6IGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgY29udHJvbGxlcjogJ2ZpbHRlcnNjdHJsJ1xuICAgIH0pO1xufSk7XG5cblxuYXBwLmNvbnRyb2xsZXIoJ2ZpbHRlcnNjdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJGZpbHRlcikge1xuICAgICRzY29wZS5leGFtcGxlVGV4dCA9IHtcbiAgICAgICAgXCJpcHN1bVwiIDogXCJMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0IGFuaW0gaWQgZXN0IGxhYm9ydW0uXCIsXG4gICAgICAgIFwiaGlwc3VtXCIgOiBcIlBvdXItb3ZlciB3aGF0ZXZlciBmYXNoaW9uIGF4ZSBlY2hvIHBhcmsgc3dhZywga29tYnVjaGEgbG9jYXZvcmUgZmluZ2Vyc3RhY2hlIGNvcm5ob2xlIGNodXJjaC1rZXkgZ2VudHJpZnkgcG9wLXVwLiBFdGhpY2FsIHNlaXRhbiBxdWlub2EgcGFic3Qgc2luZ2xlLW9yaWdpbiBjb2ZmZWUgY2h1cmNoLWtleS4gVmVubW8geXVjY2llIGxlZ2dpbmdzICsxIHZpY2Ugc3ludGguIFdhaXN0Y29hdCBsb21vIHJldHJvIGdvY2h1amFuZyBnb2RhcmQsIGNvbGQtcHJlc3NlZCBjcmFmdCBiZWVyIHN3YWcgc3F1aWQgc3VzdGFpbmFibGUgdHlwZXdyaXRlciBxdWlub2EgdGF0dG9vZWQuIENyYXkgUEJSJkIgbWl4dGFwZSwgaHVtYmxlYnJhZyBuZXV0cmEgbWFyZmEgYmVmb3JlIHRoZXkgc29sZCBvdXQgc2luZ2xlLW9yaWdpbiBjb2ZmZWUgdG9mdSBjcmVkIFlPTE8gaXJvbnkuIENvbGQtcHJlc3NlZCB0d2VlIGlQaG9uZSB0eXBld3JpdGVyLCBmbGV4aXRhcmlhbiByZWFkeW1hZGUgYmFuam8gbWxrc2hrIHBvbGFyb2lkLiBNbGtzaGsgc3ludGggdW1hbWksIGdyZWVuIGp1aWNlIG5ldXRyYSBraXRzY2ggYml0dGVycy5cXFxuR2FzdHJvcHViIGxldHRlcnByZXNzIGNvcm5ob2xlLCB0YWNvcyBzY2hsaXR6IGZyZWVnYW4gZW5udWkgY2xpY2hlLiBQaG90byBib290aCBzaW5nbGUtb3JpZ2luIGNvZmZlZSBrZXl0YXIsIHBvc3QtaXJvbmljIHRydWZmYXV0IHlvdSBwcm9iYWJseSBoYXZlbid0IGhlYXJkIG9mIHRoZW0gc3VzdGFpbmFibGUgZ29kYXJkIGRpcmVjdCB0cmFkZSB3YWlzdGNvYXQgVkhTIHZlbm1vIHN0cmVldCBhcnQuIFJhdyBkZW5pbSBzZWl0YW4gc3VzdGFpbmFibGUgamVhbiBzaG9ydHMgZmFubnkgcGFjay4gQmljeWNsZSByaWdodHMgY2h1cmNoLWtleSBrZXl0YXIgKzEgcGhvdG8gYm9vdGggdGF0dG9vZWQsIGJpb2RpZXNlbCBwaXRjaGZvcmsgYXN5bW1ldHJpY2FsIHB1ZyBmYXAgcG9yayBiZWxseSBjaGFydHJldXNlIGludGVsbGlnZW50c2lhLiBGYXJtLXRvLXRhYmxlIHl1Y2NpZSBnZW50cmlmeSBhdXRoZW50aWMgcHV0IGEgYmlyZCBvbiBpdC4gTGl0ZXJhbGx5IHRvdXNsZWQgYWZmb2dhdG8gcHVnIGRpcmVjdCB0cmFkZSBjcnVjaWZpeCBncmVlbiBqdWljZSwgbm9ybWNvcmUgYml0dGVycyByYW1wcyBzZWl0YW4geW91IHByb2JhYmx5IGhhdmVuJ3QgaGVhcmQgb2YgdGhlbSAzIHdvbGYgbW9vbiBjaHVyY2gta2V5IHN3YWcuIFBCUiZCIGJyb29rbHluIHN1c3RhaW5hYmxlLCB0b3RlIGJhZyBwaWNrbGVkIGJlZm9yZSB0aGV5IHNvbGQgb3V0IGV2ZXJ5ZGF5IGNhcnJ5IGZvb2QgdHJ1Y2sgY3J1Y2lmaXggd2F5ZmFyZXJzIGZvcmFnZSBnb2RhcmQgbHVtYmVyc2V4dWFsLlxcXG5Ub2Z1IGFmZm9nYXRvIHN3YWcgZGlzdGlsbGVyeSwgdW1hbWkgZ2VudHJpZnkgaHVtYmxlYnJhZyBzcXVpZCBmcmFuemVuIGRlZXAgdiBrYWxlIGNoaXBzIHN0cmVldCBhcnQgYnJ1bmNoIGxlZ2dpbmdzIGdsdXRlbi1mcmVlLiBUaWxkZSBoZWlybG9vbSBmaXhpZSBYT1hPIHRodW5kZXJjYXRzIHJlYWR5bWFkZSBtZWRpdGF0aW9uLCBuZXh0IGxldmVsIGZyYW56ZW4gdGF0dG9vZWQuIENyb251dCBwb3VyLW92ZXIgc2VtaW90aWNzIHBvcC11cCBuZXV0cmEuIERpcmVjdCB0cmFkZSBzdXN0YWluYWJsZSBtbGtzaGssIG5hcndoYWwgcHV0IGEgYmlyZCBvbiBpdCBjaHVyY2gta2V5IHR3ZWUgYmVmb3JlIHRoZXkgc29sZCBvdXQgY3JheSBtYW4gYnJhaWQgbG9jYXZvcmUuIE1pY3JvZG9zaW5nIHJlYWR5bWFkZSBjcmVkIG9mZmFsLCBzZWl0YW4gaGFzaHRhZyBkZWVwIHYuIE1hc3RlciBjbGVhbnNlIGNyZWQgY2hpYSBrZWZmaXllaC4gVmljZSBwbGFpZCBnb2RhcmQgd2hhdGV2ZXIuXFxcbkRyaW5raW5nIHZpbmVnYXIgZ2FzdHJvcHViIG5ldXRyYSwgY2VsaWFjIGJpb2RpZXNlbCBmb3JhZ2UgcmVhZHltYWRlIG1pZ2FzIHBob3RvIGJvb3RoIGJ1dGNoZXIgY2hhcnRyZXVzZSBrYWxlIGNoaXBzLiBUeXBld3JpdGVyIHRhY29zIG1peHRhcGUgdW1hbWkgbGl0ZXJhbGx5IHlyLiBESVkgYXVzdGluIG1lc3NlbmdlciBiYWcga2luZm9sayBiaWN5Y2xlIHJpZ2h0cyBmaXhpZSwgcG9ydGxhbmQgdHJ1ZmZhdXQgdGh1bmRlcmNhdHMgc2VpdGFuIHRvZnUgcG9yayBiZWxseS4gVGF4aWRlcm15IGthbGUgY2hpcHMgdG9mdSByb29mIHBhcnR5IGZhbm55IHBhY2suIE1hbiBicmFpZCBzdXN0YWluYWJsZSBzZWl0YW4gZXRoaWNhbC4gV29sZiB0YXhpZGVybXkgc2VsZmllcywgc3ludGgga2luZm9sayBiZWZvcmUgdGhleSBzb2xkIG91dCBzYXJ0b3JpYWwgZWNobyBwYXJrIGRpc3J1cHQgZGlyZWN0IHRyYWRlLiBEcmlua2luZyB2aW5lZ2FyIHR5cGV3cml0ZXIgbmV1dHJhIG5leHQgbGV2ZWwsIGdvY2h1amFuZyBYT1hPIGJydW5jaCBwaWNrbGVkLlwiLFxuJ3Rlc3ROdW1iZXInIDogMTAwMjMwMTIzNyxcbid0ZXN0QXJyYXknIDogWydGcnknLCAnUHJvZmVzc29yJywgJ0hlcm1lcycsICdQcm9mZXNzb3InLCAnTGVlbGEnLCAnQmVuZGVyJywgJ0tpZicsICdOaWJibGVyJywgNzg0OTkzMCwgeydraXR0ZW5zJyA6ICdmZWxpbmUnLCAncHVwcGllcycgOiAnY2FuaW5lJ30sIHRydWUsIGZhbHNlLCBudWxsLCB1bmRlZmluZWQsICcnLCAwXSxcbid0ZXN0T2JqZWN0JyA6IHtcbiAgICBcImdsb3NzYXJ5XCI6IHtcbiAgICAgICAgXCJ0aXRsZVwiOiBcImV4YW1wbGUgZ2xvc3NhcnlcIixcbiAgICAgICAgXCJHbG9zc0RpdlwiOiB7XG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiU1wiLFxuICAgICAgICAgICAgXCJHbG9zc0xpc3RcIjoge1xuICAgICAgICAgICAgICAgIFwiR2xvc3NFbnRyeVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiSURcIjogXCJTR01MXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiU29ydEFzXCI6IFwiU0dNTFwiLFxuICAgICAgICAgICAgICAgICAgICBcIkdsb3NzVGVybVwiOiBcIlN0YW5kYXJkIEdlbmVyYWxpemVkIE1hcmt1cCBMYW5ndWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIkFjcm9ueW1cIjogXCJTR01MXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQWJicmV2XCI6IFwiSVNPIDg4Nzk6MTk4NlwiLFxuICAgICAgICAgICAgICAgICAgICBcIkdsb3NzRGVmXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYVwiOiBcIkEgbWV0YS1tYXJrdXAgbGFuZ3VhZ2UsIHVzZWQgdG8gY3JlYXRlIG1hcmt1cCBsYW5ndWFnZXMgc3VjaCBhcyBEb2NCb29rLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJHbG9zc1NlZUFsc29cIjogW1wiR01MXCIsIFwiWE1MXCJdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiR2xvc3NTZWVcIjogXCJtYXJrdXBcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbn07XG5cbiRzY29wZS5jdXJyZW50VGV4dCA9ICRzY29wZS5leGFtcGxlVGV4dC5pcHN1bTtcblxuJHNjb3BlLm15RmlsdGVyID0gJ2xvd2VyY2FzZSc7XG4gJHNjb3BlLmFwcGx5RmlsdGVyID0gZnVuY3Rpb24obW9kZWwsIGZpbHRlcikge1xuICAgICAgICByZXR1cm4gJGZpbHRlcihmaWx0ZXIpKG1vZGVsKTtcbiAgICB9O1xuXG52YXIgaGFzcnVuMT0gZmFsc2U7XG52YXIgaGFzcnVuMj0gZmFsc2U7XG5cbiRzY29wZS4kd2F0Y2goJ3VzZXJUZXh0JywgZnVuY3Rpb24oKSB7XG4gICAgIGlmKGhhc3J1bjIpIHsgICAgICAgIFxuICAgICRzY29wZS5jdXJyZW50VGV4dCA9ICRzY29wZS51c2VyVGV4dDtcbiAgICB9XG5oYXNydW4yID0gdHJ1ZTtcbn0pO1xuXG4kc2NvcGUuJHdhdGNoKCdteUlucHV0JywgZnVuY3Rpb24oKSB7XG4gICAgaWYoaGFzcnVuMSkgeyAgICAgICAgXG4gICAgJHNjb3BlLmN1cnJlbnRUZXh0ID0gJHNjb3BlLmV4YW1wbGVUZXh0WyRzY29wZS5teUlucHV0XTtcbiAgICB9XG4gICAgaGFzcnVuMSA9IHRydWU7XG59KTtcblxuXG4kc2NvcGUucnVudGhpc2Z1bmMgPSBmdW5jdGlvbigpIHtcbiAgICRzY29wZS5jdXJyZW50VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVUZXh0QXJlYScpLnZhbHVlO1xuICAgJHNjb3BlLmFwcGx5RmlsdGVyKCRzY29wZS5jdXJyZW50VGV4dCwgJHNjb3BlLm15RmlsdGVyKTtcbn07XG59KTtcblxuLy8vIGN1c3RvbSBmaWx0ZXJzXG5cbmFwcC5maWx0ZXIoJ3JldmVyc2UnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlucHV0ID0gaW5wdXQgfHwgJyAnO1xuICAgIHZhciBvdXQgPSBcIlwiO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgIG91dCA9IGlucHV0LmNoYXJBdChpKSArIG91dDtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbn0pO1xuXG5hcHAuZmlsdGVyKCdkZWxldGVQdW5jdHVhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgaWYodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykgaW5wdXQgPSAnICc7XG4gICAgICAgIHZhciByZSA9IC9cXHcrL2c7XG4gICAgICAgcmV0dXJuIGlucHV0Lm1hdGNoKHJlKS5qb2luKCcgJyk7XG4gICAgfTtcbn0pO1xuXG5hcHAuZmlsdGVyKCdvbmx5UHVuY3R1YXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIGlucHV0ID0gJyAnO1xuICAgICAgICB2YXIgcmUgPSAvXFxXKy9nO1xuICAgICAgIHJldHVybiBpbnB1dC5tYXRjaChyZSkuam9pbignICcpO1xuICAgIH07XG59KTtcblxuYXBwLmZpbHRlcignc29ydCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0LnNvcnQoKTtcbiAgICB9O1xufSk7XG5cbmFwcC5maWx0ZXIoJ3VuaXF1ZScsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgaWYodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykgaW5wdXQgPSBKU09OLnBhcnNlKGlucHV0KTtcbiAgICAgICAgcmV0dXJuIGlucHV0LmZpbHRlcihmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5pbmRleE9mKGl0ZW0pID09PSBpbmRleDtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuXG5hcHAuZmlsdGVyKCd0cnV0aHknLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIGlucHV0ID0gSlNPTi5wYXJzZShpbnB1dCk7XG4gICAgICAgIHJldHVybiBpbnB1dC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiAhIWl0ZW07XG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcblxuYXBwLmZpbHRlcignZmFsc3knLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIGlucHV0ID0gSlNPTi5wYXJzZShpbnB1dCk7XG4gICAgICAgIHJldHVybiBpbnB1dC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiAhaXRlbTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmZpbHRlcignbWFwdG9mYScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dCA9PT0gJ3NxdWlnZ2xlJykgcmV0dXJuICdzY3JpYmQnOyBcbiAgICAgICAgZWxzZSBpZiAoaW5wdXQgPT09ICdvdmFsJykgcmV0dXJuICdsZW1vbi1vJzsgXG4gICAgICAgIGVsc2UgcmV0dXJuIGlucHV0O1xuICAgIH07XG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2V0Jywge1xuICAgICAgICB1cmw6ICcvY29kZS9hbmd1bGFyL3NldCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29kZS9hbmd1bGFyL3NldC9zZXQuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXG4gICAgICAgIG9uRW50ZXI6ICgkcm9vdFNjb3BlKSA9PiB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBvbkV4aXQ6ICgkcm9vdFNjb3BlKSA9PiB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cblxuYXBwLmZhY3RvcnkoJ2NhcmRzRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuICByZXR1cm4ge1xuICAgIGdldEFsbENhcmRzOiBmdW5jdGlvbiBnZXRBbGxDYXJkcygpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9jYXJkcycpLnRoZW4oZnVuY3Rpb24gKGNhcmRzKSB7XG4gICAgICAgIHJldHVybiBjYXJkcy5kYXRhO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkaW50ZXJ2YWwsIGNhcmRzRmFjdG9yeSwgbWV0aG9kc0ZhY3RvcnkpIHtcblxuICAgIC8vTG9jYWwgYW5kIHNjb3BlIHZhcnMuXG5cbiAgICAkc2NvcGUubWVzc2FnZSA9IFtbJ0NPTVBVVEVSXFwnUyBTRVRTOiddLCBbJ1lPVVIgU0VUUzonXV07XG4gICAgJHNjb3BlLmNvbXB1dGVyc2NvcmUgPSAwO1xuICAgICRzY29wZS5wbGF5ZXJzY29yZSA9IDA7XG4gICAgJHNjb3BlLnBsYXlUaW1lciA9IDQ1O1xuICAgIHZhciBwbGF5ZXJTZXQgPSBbXSxcbiAgICAgICAgZ2FtZXJ1bm5pbmcgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBBamF4IGNhbGwgZm9yIGNhcmRzIFxuICAgIGNhcmRzRmFjdG9yeS5nZXRBbGxDYXJkcygpLnRoZW4oZnVuY3Rpb24gKGNhcmRzKSB7XG4gICAgICAgICRzY29wZS5hbGxDYXJkcyA9IF8uc2h1ZmZsZShjYXJkcyk7XG4gICAgICAgICRzY29wZS50YWJsZSA9ICRzY29wZS5hbGxDYXJkcy5zcGxpY2UoMCwgMTIpO1xuICAgIH0pO1xuXG4gICAgLy8gR2FtZSB3YXRjaCBmdW5jdGlvbnNcblxuICAgICRzY29wZS4kd2F0Y2goJ3RhYmxlLmxlbmd0aCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCRzY29wZS50YWJsZSkge1xuICAgICAgICAgICAgaWYgKCRzY29wZS50YWJsZS5sZW5ndGggPCAxMiB8fCAhY2hlY2tGb3JXaW5uZXJzKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5hbGxDYXJkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkVGhyZWVDYXJkcygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWNoZWNrRm9yV2lubmVycygpLmxlbmd0aCAmJiAhJHNjb3BlLmFsbENhcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGdhbWVydW5uaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2hvd21vZGFsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuJHdhdGNoKCdwbGF5VGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkc2NvcGUucGxheVRpbWVyID09PSAwKSB7XG4gICAgICAgICAgICBjb21wdXRlck1vdmUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQ29udHJvbGxlciBtZXRob2RzXG5cbiAgICB2YXIgY2hlY2tGb3JXaW5uZXJzID0gZnVuY3Rpb24gY2hlY2tGb3JXaW5uZXJzKCkge1xuICAgICAgICB2YXIgd2lubmVycyA9IG1ldGhvZHNGYWN0b3J5LmdlbmVyYXRlUG90ZW50aWFscygkc2NvcGUudGFibGUpLmZpbHRlcihmdW5jdGlvbiAocG90ZW50aWFsU2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kc0ZhY3RvcnkudmFsaWRhdGVTZXQocG90ZW50aWFsU2V0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB3aW5uZXJzO1xuICAgIH07XG5cbiAgICB2YXIgYWRkVGhyZWVDYXJkcyA9IGZ1bmN0aW9uIGFkZFRocmVlQ2FyZHMoKSB7XG4gICAgICAgIGlmICgkc2NvcGUuYWxsQ2FyZHMubGVuZ3RoID49IDMpIHtcbiAgICAgICAgICAgICRzY29wZS50YWJsZSA9ICRzY29wZS50YWJsZS5jb25jYXQoJHNjb3BlLmFsbENhcmRzLnNwbGljZSgwLCAzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUudGFibGUgPSAkc2NvcGUudGFibGUuY29uY2F0KCRzY29wZS5hbGxDYXJkcy5zcGxpY2UoMCwgJHNjb3BlLmFsbENhcmRzLmxlbmd0aCkpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBjb21wdXRlck1vdmUgPSBmdW5jdGlvbiBjb21wdXRlck1vdmUoKSB7XG4gICAgICAgIHZhciBjdXJyZW50U2V0ID0gY2hlY2tGb3JXaW5uZXJzKClbMF07XG4gICAgICAgIGlmIChjdXJyZW50U2V0KSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZVswXS5wdXNoKGN1cnJlbnRTZXQpO1xuICAgICAgICAgICAgXy5yZW1vdmUocGxheWVyU2V0LCBmdW5jdGlvbiAocGxheWVyQ2FyZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50U2V0LmluZGV4T2YocGxheWVyQ2FyZCkgIT09IC0xO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfLnJlbW92ZSgkc2NvcGUudGFibGUsIGZ1bmN0aW9uICh0YWJsZUNhcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFNldC5pbmRleE9mKHRhYmxlQ2FyZCkgIT09IC0xO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc2NvcGUuY29tcHV0ZXJzY29yZSsrO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5jYXJkU2VsZWN0ZWQgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgaWYgKGlucHV0LmNsaWNrZWQpIHtcbiAgICAgICAgICAgIGlucHV0LmNsaWNrZWQgPSAhaW5wdXQuY2xpY2tlZDtcbiAgICAgICAgICAgIHBsYXllclNldC5zcGxpY2UocGxheWVyU2V0LmluZGV4T2YoaW5wdXQuY2FyZCksIDEpO1xuICAgICAgICB9IGVsc2UgaWYgKHBsYXllclNldC5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgICBwbGF5ZXJTZXQucHVzaChpbnB1dC5jYXJkKTtcbiAgICAgICAgICAgIGlucHV0LmNsaWNrZWQgPSAhaW5wdXQuY2xpY2tlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxheWVyU2V0Lmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgaWYgKG1ldGhvZHNGYWN0b3J5LnZhbGlkYXRlU2V0KHBsYXllclNldCkpIHtcbiAgICAgICAgICAgICAgICBfLnJlbW92ZSgkc2NvcGUudGFibGUsIGZ1bmN0aW9uICh0YWJsZUNhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllclNldC5pbmRleE9mKHRhYmxlQ2FyZCkgIT09IC0xO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHBsYXllclNldCA9IFtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5wbGF5ZXJzY29yZSsrO1xuICAgICAgICAgICAgICAgICRzY29wZS5wbGF5VGltZXIgPSA0NTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBCdXR0b24gTWV0aG9kc1xuXG4gICAgJHNjb3BlLmxvZ1Njb3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUubWVzc2FnZSk7XG4gICAgfTtcblxuICAgICRzY29wZS5jaGVhdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRTZXQgPSBjaGVja0Zvcldpbm5lcnMoKVswXTtcbiAgICAgICAgaWYgKGN1cnJlbnRTZXQpIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlWzFdLnB1c2goY3VycmVudFNldCk7XG4gICAgICAgICAgICBfLnJlbW92ZSgkc2NvcGUudGFibGUsIGZ1bmN0aW9uICh0YWJsZUNhcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFNldC5pbmRleE9mKHRhYmxlQ2FyZCkgIT09IC0xO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc2NvcGUucGxheWVyc2NvcmUrKztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucGxheVdob2xlR2FtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2FtZXJ1bm5pbmcgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHNjb3BlLmNoZWF0KCk7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgfTtcblxuICAgIC8vIFRpbWVyXG5cbiAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJHNjb3BlLnBsYXlUaW1lciA9PT0gMCkge1xuICAgICAgICAgICAgJHNjb3BlLnBsYXlUaW1lciA9IDQ1O1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5wbGF5VGltZXItLTtcbiAgICB9LCAxMDAwKTtcblxuICAgIC8vIGdhbWUgZW5kIE1vZGFsXG5cbiAgICAvLyB2YXIgc2hvd21vZGFsID0gZnVuY3Rpb24gc2hvd21vZGFsKCkge1xuXG4gICAgLy8gICAgIHZhciBlbmRNb2RhbCA9ICR1aWJNb2RhbC5vcGVuKHtcbiAgICAvLyAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAvLyAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ByZS1idWlsZC9ob21lL21vZGFsLmh0bWwnLFxuICAgIC8vICAgICAgICAgY29udHJvbGxlcjogJ21vZGFsQ3RybCcsXG4gICAgLy8gICAgICAgICBzaXplOiAnbGcnLFxuICAgIC8vICAgICAgICAgcmVzb2x2ZToge1xuICAgIC8vICAgICAgICAgICAgIHdpbm5lcjogZnVuY3Rpb24gd2lubmVyKCkge1xuICAgIC8vICAgICAgICAgICAgICAgICB2YXIgdGhlV2lubmVyID0gJHNjb3BlLnBsYXllcnNjb3JlID49ICRzY29wZS5jb21wdXRlcnNjb3JlID8gJ1BsYXllcicgOiAnQ29tcHV0ZXInO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXR1cm4gdGhlV2lubmVyO1xuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfTtcbn0pO1xuXG4vL21vZGFsIENvbnRyb2xsZXJcblxuLy8gYXBwLmNvbnRyb2xsZXIoJ21vZGFsQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCB3aW5uZXIpIHtcbi8vICAgICAkc2NvcGUucmVsb2FkID0gZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4vLyAgICAgfTtcbi8vICAgICAkc2NvcGUud2lubmVyID0gd2lubmVyO1xuLy8gfSk7XG5cbi8vIFF1aWNrIGZpbHRlci5cblxuXG5cbmFwcC5mYWN0b3J5KCdtZXRob2RzRmFjdG9yeScsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICBnZW5lcmF0ZVBvdGVudGlhbHM6IGZ1bmN0aW9uIGdlbmVyYXRlUG90ZW50aWFscyhpbnB1dEFycikge1xuICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgdmFyIHRlbXBBcnIgPSBbXTtcbiAgICAgIHZhciBpdGVtT25lID0gaW5wdXRBcnIuc2xpY2UoKTtcbiAgICAgIHdoaWxlIChpdGVtT25lLmxlbmd0aCkge1xuICAgICAgICB0ZW1wQXJyLnB1c2goaXRlbU9uZS5zaGlmdCgpKTtcbiAgICAgICAgdmFyIGl0ZW1Ud28gPSBpdGVtT25lLnNsaWNlKCk7XG4gICAgICAgIHdoaWxlIChpdGVtVHdvLmxlbmd0aCkge1xuICAgICAgICAgIHRlbXBBcnIucHVzaChpdGVtVHdvLnNoaWZ0KCkpO1xuICAgICAgICAgIHZhciBpdGVtVGhyZWUgPSBpdGVtVHdvLnNsaWNlKCk7XG4gICAgICAgICAgd2hpbGUgKGl0ZW1UaHJlZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRlbXBBcnIucHVzaChpdGVtVGhyZWUuc2hpZnQoKSk7XG4gICAgICAgICAgICBvdXRwdXQucHVzaCh0ZW1wQXJyKTtcbiAgICAgICAgICAgIHRlbXBBcnIgPSB0ZW1wQXJyLnNsaWNlKDAsIHRlbXBBcnIubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRlbXBBcnIgPSB0ZW1wQXJyLnNsaWNlKDAsIHRlbXBBcnIubGVuZ3RoIC0gMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEFyciA9IHRlbXBBcnIuc2xpY2UoMCwgdGVtcEFyci5sZW5ndGggLSAxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSxcbiAgICB2YWxpZGF0ZVNldDogZnVuY3Rpb24gdmFsaWRhdGVTZXQoY3VyclNldCkge1xuICAgICAgdmFyIGlzU2V0ID0gdHJ1ZTtcbiAgICAgIHZhciBtYXN0ZXJzZXQgPSBbXTtcbiAgICAgIC8vIGNyZWF0ZSBhIGJpZyBhcnJheSBvZiBhbGwgcHJlc2VudCB2YWx1ZXNcbiAgICAgIGN1cnJTZXQuZm9yRWFjaChmdW5jdGlvbiAoY2FyZCkge1xuICAgICAgICBtYXN0ZXJzZXQgPSBtYXN0ZXJzZXQuY29uY2F0KF8udmFsdWVzKGNhcmQpKTtcbiAgICAgIH0pO1xuICAgICAgLy9jb3VudCB0aGUgdmFsdWVzLCBpZiBhbnkgcHJvcGVydHkgaGFzIGEgY291bnQgb2YgMiwgcmV0dXJuIGZhbHNlXG4gICAgICBpZiAoXy52YWx1ZXMoXy5jb3VudEJ5KG1hc3RlcnNldCkpLmluZGV4T2YoMikgIT09IC0xKSB7XG4gICAgICAgIGlzU2V0ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBlbHNlIHJldHVybiB0cnVlXG4gICAgICByZXR1cm4gaXNTZXQ7XG4gICAgfVxuICB9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnZGlqa3N0cmEnLCB7XG4gICAgICAgIHVybDogJy9jb2RlL2NvbXB1dGVyU2NpZW5jZS9kaWprc3RyYScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29kZS9jb21wdXRlclNjaWVuY2UvZGlqa3N0cmEvZGlqa3N0cmFzLmh0bWwnLFxuICAgICAgICBvbkVudGVyOiBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25FeGl0OiBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRyb2xsZXI6ICdkaWprQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignZGlqa0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSB2YXJpYWJsZXNcbiAgICBsZXQgaW5pdGlhbGx5Q3JlYXRlZCA9IGZhbHNlO1xuICAgIGxldCBzcHJpdGVzaGVldExvYWRlZCA9IGZhbHNlO1xuICAgIGxldCBjdXJyZW50UGF0aCA9IFtdO1xuICAgIGNvbnN0IHdvcmxkID0gW1tdXTtcbiAgICBjb25zdCB0ZXJyYWluU2hlZXQgPSBuZXcgSW1hZ2UoKTtcbiAgICB0ZXJyYWluU2hlZXQuc3JjID0gJ3Nwcml0ZXNoZWV0LnBuZyc7XG4gICAgY29uc3QgdGVycmFpblNoZWV0UmV2ZXJzZSA9IG5ldyBJbWFnZSgpO1xuICAgIHRlcnJhaW5TaGVldFJldmVyc2Uuc3JjID0gJ3Nwcml0ZXNoZWV0UmV2ZXJzZS5wbmcnO1xuICAgIGNvbnN0IGdvb21iYSA9ICBuZXcgSW1hZ2UoKVxuICAgIGdvb21iYS5zcmMgPSAnZ29vbWJhLnBuZyc7XG4gICAgbGV0IFBBR0VIRUlHSFQgPSAyNjtcbiAgICBsZXQgUEFHRVdJRFRIID0gMjY7XG4gICAgY29uc3QgVElMRVdJRFRIID0gMzI7XG4gICAgY29uc3QgVElMRUhFSUdIVCA9IDMyO1xuICAgIGxldCBwYXRoU3RhcnQgPSBbUEFHRUhFSUdIVCxQQUdFV0lEVEhdXG4gICAgbGV0IHBhdGhFbmQgPSBbMCwwXTtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFyaW9DYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSBQQUdFV0lEVEggKiBUSUxFV0lEVEg7XG4gICAgY2FudmFzLmhlaWdodCA9IFBBR0VIRUlHSFQgKiBUSUxFSEVJR0hUO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgdGVycmFpblNoZWV0Lm9ubG9hZCA9IGxvYWRlZDtcblxuICAgIC8vbW9iaWxlIGNoZWNrXG5cbiAgICBpZihzY3JlZW4ud2lkdGggPD0gMTAyNCkge1xuICAgICAgICBQQUdFSEVJR0hUID0gMjI7XG4gICAgICAgIFBBR0VXSURUSCA9IDIyO1xuICAgICAgICBjYW52YXMud2lkdGggPSBQQUdFV0lEVEggKiBUSUxFV0lEVEg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBQQUdFSEVJR0hUICogVElMRUhFSUdIVDtcbiAgICB9XG4gICAgZnVuY3Rpb24gbG9hZGVkKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdTcHJpdGVzaGVldCBsb2FkZWQuJyk7XG4gICAgICAgICAgc3ByaXRlc2hlZXRMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICRzY29wZS5jcmVhdGVXb3JsZCgpO1xuICAgICAgfVxuXG4gICAgLy9HT09NQkEgQ1JFQVRJT04sIE1BUklPIEFORCBQSVBFIERSQUdHSU5HXG5cbiAgICBsZXQgZGllR29vbWJhID0gKGUpID0+IHtcbiAgICAgICAgbGV0IGNsaWNrWCA9IE1hdGguZmxvb3IoZS5sYXllclggLyBUSUxFV0lEVEgpICogVElMRVdJRFRIO1xuICAgICAgICBsZXQgY2xpY2tZID0gTWF0aC5mbG9vcihlLmxheWVyWSAvIFRJTEVIRUlHSFQpICogVElMRUhFSUdIVDtcbiAgICAgICAgbGV0IGdyaWRQb3NpdGlvbiA9IHdvcmxkW2NsaWNrWC9USUxFV0lEVEhdW2NsaWNrWS9USUxFSEVJR0hUXVxuICAgICAgICAgICAgaWYoZ3JpZFBvc2l0aW9uID09PSAyIHx8IGdyaWRQb3NpdGlvbiA9PT0gMykgcmV0dXJuXG4gICAgICAgIHdvcmxkW2NsaWNrWC9USUxFV0lEVEhdW2NsaWNrWS9USUxFSEVJR0hUXSA9IDA7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGVycmFpblNoZWV0LCAwKlRJTEVXSURUSCwgMCwgVElMRVdJRFRILCBUSUxFSEVJR0hULCBjbGlja1gsIGNsaWNrWSwgVElMRVdJRFRILCBUSUxFSEVJR0hUKTtcbiAgICB9XG5cbiAgICBsZXQgbWFrZUdvb21iYSA9IChlKSA9PiB7XG4gICAgICAgIGxldCBjbGlja1g7XG4gICAgICAgIGxldCBjbGlja1k7XG4gICAgICAgIGlmKGUubGF5ZXJYICE9PSB1bmRlZmluZWQgJiYgZS5sYXllclkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2xpY2tYID0gTWF0aC5mbG9vcihlLmxheWVyWCAvIFRJTEVXSURUSCkgKiBUSUxFV0lEVEg7XG4gICAgICAgICAgICBjbGlja1kgPSBNYXRoLmZsb29yKGUubGF5ZXJZIC8gVElMRUhFSUdIVCkgKiBUSUxFSEVJR0hUO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoZS50b3VjaGVzWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNsaWNrWSA9IE1hdGguZmxvb3IoKGUudG91Y2hlc1swXS5wYWdlWSAtIGNhbnZhcy5vZmZzZXRUb3ApIC8gVElMRUhFSUdIVCkgKiBUSUxFSEVJR0hUXG4gICAgICAgICAgICBjbGlja1ggPSBNYXRoLmZsb29yKChlLnRvdWNoZXNbMF0ucGFnZVggLSBjYW52YXMub2Zmc2V0TGVmdCkgLyBUSUxFV0lEVEgpICogVElMRVdJRFRIXG4gICAgICAgIH0gICAgIFxuICAgICAgICBsZXQgZ3JpZFBvc2l0aW9uID0gd29ybGRbY2xpY2tYL1RJTEVXSURUSF1bY2xpY2tZL1RJTEVIRUlHSFRdXG4gICAgICAgIGlmKGdyaWRQb3NpdGlvbiA9PT0gMiB8fCBncmlkUG9zaXRpb24gPT09IDMpIHJldHVyblxuICAgICAgICBjdHguZHJhd0ltYWdlKGdvb21iYSwgXG4gICAgICAgICAgICBjbGlja1gsIGNsaWNrWSk7XG4gICAgICAgICAgICB3b3JsZFtjbGlja1gvVElMRVdJRFRIXVtjbGlja1kvVElMRUhFSUdIVF0gPSAnZ29vbWJhJztcbiAgICAgICAgfVxuXG4gICAgbGV0IHBpcGVNb3ZlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBsZXQgY2xpY2tYO1xuICAgICAgICBsZXQgY2xpY2tZO1xuICAgICAgICBpZihlLmxheWVyWCAhPT0gdW5kZWZpbmVkICYmIGUubGF5ZXJZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNsaWNrWCA9IE1hdGguZmxvb3IoZS5sYXllclggLyBUSUxFV0lEVEgpICogVElMRVdJRFRIO1xuICAgICAgICAgICAgY2xpY2tZID0gTWF0aC5mbG9vcihlLmxheWVyWSAvIFRJTEVIRUlHSFQpICogVElMRUhFSUdIVDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNsaWNrWSA9IE1hdGguZmxvb3IoKGUudG91Y2hlc1swXS5wYWdlWSAtIGNhbnZhcy5vZmZzZXRUb3ApIC8gVElMRUhFSUdIVCkgKiBUSUxFSEVJR0hUXG4gICAgICAgICAgICBjbGlja1ggPSBNYXRoLmZsb29yKChlLnRvdWNoZXNbMF0ucGFnZVggLSBjYW52YXMub2Zmc2V0TGVmdCkgLyBUSUxFV0lEVEgpICogVElMRVdJRFRIXG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBmb3IgKGxldCB4PTA7IHggPCBQQUdFV0lEVEg7IHgrKyl7XG4gICAgICAgICAgICBmb3IgKGxldCB5PTA7IHkgPCBQQUdFSEVJR0hUOyB5Kyspe1xuICAgICAgICAgICAgICAgIGlmICh3b3JsZFt4XVt5XSA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgIHdvcmxkW3hdW3ldID0gMFxuICAgICAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKHRlcnJhaW5TaGVldCwgMCpUSUxFV0lEVEgsIDAsIFRJTEVXSURUSCwgVElMRUhFSUdIVCwgeCpUSUxFV0lEVEgsIHkqVElMRUhFSUdIVCwgVElMRVdJRFRILCBUSUxFSEVJR0hUKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0ZXJyYWluU2hlZXQsIDEqIFRJTEVXSURUSCwgMCwgVElMRVdJRFRILCBUSUxFSEVJR0hULCBjbGlja1gsIGNsaWNrWSwgVElMRVdJRFRILCBUSUxFSEVJR0hUKVxuICAgICAgICB3b3JsZFtjbGlja1gvVElMRVdJRFRIXVtjbGlja1kvVElMRUhFSUdIVF0gPSAyO1xuICAgIH0gICAgXG5cbiAgICBsZXQgbWFyaW9Nb3ZlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBsZXQgY2xpY2tYO1xuICAgICAgICBsZXQgY2xpY2tZO1xuICAgICAgICBpZihlLmxheWVyWCAhPT0gdW5kZWZpbmVkICYmIGUubGF5ZXJZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNsaWNrWCA9IE1hdGguZmxvb3IoZS5sYXllclggLyBUSUxFV0lEVEgpICogVElMRVdJRFRIO1xuICAgICAgICAgICAgY2xpY2tZID0gTWF0aC5mbG9vcihlLmxheWVyWSAvIFRJTEVIRUlHSFQpICogVElMRUhFSUdIVDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGUudG91Y2hlc1swXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjbGlja1kgPSBNYXRoLmZsb29yKChlLnRvdWNoZXNbMF0ucGFnZVkgLSBjYW52YXMub2Zmc2V0VG9wKSAvIFRJTEVIRUlHSFQpICogVElMRUhFSUdIVFxuICAgICAgICAgICAgY2xpY2tYID0gTWF0aC5mbG9vcigoZS50b3VjaGVzWzBdLnBhZ2VYIC0gY2FudmFzLm9mZnNldExlZnQpIC8gVElMRVdJRFRIKSAqIFRJTEVXSURUSFxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHg9MDsgeCA8IFBBR0VXSURUSDsgeCsrKXtcbiAgICAgICAgICAgIGZvciAobGV0IHk9MDsgeSA8IFBBR0VIRUlHSFQ7IHkrKyl7XG4gICAgICAgICAgICAgICAgaWYgKHdvcmxkW3hdW3ldID09PSAzKXtcbiAgICAgICAgICAgICAgICAgICAgd29ybGRbeF1beV0gPSAwXG4gICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGVycmFpblNoZWV0LCAwKlRJTEVXSURUSCwgMCwgVElMRVdJRFRILCBUSUxFSEVJR0hULCB4KlRJTEVXSURUSCwgeSpUSUxFSEVJR0hULCBUSUxFV0lEVEgsIFRJTEVIRUlHSFQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdHguZHJhd0ltYWdlKHRlcnJhaW5TaGVldCwgMiogVElMRVdJRFRILCAwLCBUSUxFV0lEVEgsIFRJTEVIRUlHSFQsIGNsaWNrWCwgY2xpY2tZLCBUSUxFV0lEVEgsIFRJTEVIRUlHSFQpXG4gICAgICAgIHdvcmxkW2NsaWNrWC9USUxFV0lEVEhdW2NsaWNrWS9USUxFSEVJR0hUXSA9IDM7XG4gICAgfSAgICBcblxuICAgIC8vRVZFTlQgTElTVEVORVJTXG5cbiAgICAvLyBDTElDS1NcblxuICAgIGNhbnZhcy5vbmRibGNsaWNrID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBkaWVHb29tYmEoZSlcbiAgICB9XG4gICAgY2FudmFzLm9uY2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIG1ha2VHb29tYmEoZSk7XG4gICAgfVxuICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgbGV0IGNsaWNrWCA9IE1hdGguZmxvb3IoZS5sYXllclggLyBUSUxFV0lEVEgpICogVElMRVdJRFRIO1xuICAgICAgICBsZXQgY2xpY2tZID0gTWF0aC5mbG9vcihlLmxheWVyWSAvIFRJTEVIRUlHSFQpICogVElMRUhFSUdIVDtcbiAgICAgICAgbGV0IGdyaWRQb3NpdGlvbiA9IHdvcmxkW2NsaWNrWC9USUxFV0lEVEhdW2NsaWNrWS9USUxFSEVJR0hUXVxuICAgICAgICBpZihncmlkUG9zaXRpb24gPT09IDIpe1xuICAgICAgICAgICAgY2FudmFzLm9ubW91c2Vtb3ZlID0gcGlwZU1vdmU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihncmlkUG9zaXRpb24gPT09IDMpe1xuICAgICAgICAgICAgY2FudmFzLm9ubW91c2Vtb3ZlID0gbWFyaW9Nb3ZlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgIGNhbnZhcy5vbm1vdXNlbW92ZSA9IG1ha2VHb29tYmE7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY2FudmFzLm9ubW91c2V1cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYW52YXMub25tb3VzZW1vdmUgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBUT1VDSEVTXG5cbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgbGV0IGNsaWNrWCA9IE1hdGguZmxvb3IoKGUudG91Y2hlc1swXS5wYWdlWCAtIGNhbnZhcy5vZmZzZXRMZWZ0KSAvIFRJTEVXSURUSCkgKiBUSUxFV0lEVEhcbiAgICAgICAgbGV0IGNsaWNrWSA9IE1hdGguZmxvb3IoKGUudG91Y2hlc1swXS5wYWdlWSAtIGNhbnZhcy5vZmZzZXRUb3ApIC8gVElMRUhFSUdIVCkgKiBUSUxFSEVJR0hUXG4gICAgICAgIGxldCBncmlkUG9zaXRpb24gPSB3b3JsZFtjbGlja1gvVElMRVdJRFRIXVtjbGlja1kvVElMRUhFSUdIVF1cbiAgICAgICAgaWYoZ3JpZFBvc2l0aW9uID09PSAyKXtcbiAgICAgICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwaXBlTW92ZSwgZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihncmlkUG9zaXRpb24gPT09IDMpe1xuICAgICAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG1hcmlvTW92ZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBtYWtlR29vbWJhLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9LCBmYWxzZSlcblxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHBpcGVNb3ZlKTtcbiAgICAgICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG1hcmlvTW92ZSk7XG4gICAgICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBtYWtlR29vbWJhKTtcbiAgICB9KVxuICAgIC8vIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGNhbnZhcy5vbm1vdXNldXAsIGZhbHNlKVxuICAgIC8vIGNhbnZhcy5vbnRvdWNoZW5kID0gY2FudmFzLm9ubW91c2V1cDtcblxuXG4gICAgLy9VU0VSIElOVEVSQUNUSU9OU1xuXG4gICAgJHNjb3BlLmNyZWF0ZVdvcmxkID0gKGdvb21iYXMpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NyZWF0aW5nIHdvcmxkLi4uJyk7XG4gICAgICAgIGluaXRpYWxseUNyZWF0ZWQgPSB0cnVlXG4gICAgICAvLyBjcmVhdGUgZW1wdGluZXNzXG4gICAgICBmb3IgKGxldCB4PTA7IHggPCBQQUdFV0lEVEg7IHgrKyl7XG4gICAgICAgIHdvcmxkW3hdID0gW107XG4gICAgICAgIGZvciAobGV0IHk9MDsgeSA8IFBBR0VIRUlHSFQ7IHkrKyl7XG4gICAgICAgICAgd29ybGRbeF1beV0gPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZihnb29tYmFzKSB7XG4gICAgICAvLyBzY2F0dGVyIGdvb21iYXNcbiAgICAgIGZvciAobGV0IHg9MDsgeCA8IFBBR0VXSURUSDsgeCsrKXtcbiAgICAgICAgZm9yIChsZXQgeT0wOyB5IDwgUEFHRUhFSUdIVDsgeSsrKXtcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC43KXtcbiAgICAgICAgICAgICAgICB3b3JsZFt4XVt5XSA9ICdnb29tYmEnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB9XG4gICAgICB3b3JsZFtNYXRoLmNlaWwoVElMRVdJRFRILzMpXVtNYXRoLmNlaWwoVElMRUhFSUdIVC8zKV0gPSAyO1xuICAgICAgd29ybGRbTWF0aC5jZWlsKFRJTEVXSURUSC8zKSArIDFdW01hdGguY2VpbChUSUxFSEVJR0hULzMpXSA9IDM7XG4gICAgICByZWRyYXcoKTtcbiAgICB9XG5cblxuICAgICRzY29wZS5wYXRoVG9QaXBlID0gKCkgPT4ge1xuICAgICAgICAvLyBmaW5kIHN0YXJ0IGFuZCBlbmQgcG9pbnRzIGFuZCB0aGVuIGNyZWF0ZSBwYXRoIGFycmF5XG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHdvcmxkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajx3b3JsZFtpXS5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICAgICAgaWYod29ybGRbaV1bal0gPT09IDIpIHBhdGhTdGFydCA9IFtpLGpdO1xuICAgICAgICAgICAgICAgIGlmKHdvcmxkW2ldW2pdID09PSAzKSBwYXRoRW5kID0gW2ksal07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBhdGggPSAwO1xuICAgICAgICBsZXQgbWFyaW8gPSAwO1xuICAgICAgICBsZXQgcGlwZVBvcyA9IGN1cnJlbnRQYXRoLnNoaWZ0KCk7XG4gICAgICAgIGN1cnJlbnRQYXRoID0gZmluZFBhdGgod29ybGQscGF0aFN0YXJ0LHBhdGhFbmQpO1xuICAgICAgICBjdXJyZW50UGF0aCA9IGN1cnJlbnRQYXRoLnJldmVyc2UoKTtcblxuICAgICAgICAvLyBhbmltYXRlIHBhdGggZnVuY3Rpb25cbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShwYXRoKSB7XG4gICAgICAgICAgICBpZihjdXJyZW50UGF0aFtwYXRoXSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKHRlcnJhaW5TaGVldCwgXG4gICAgICAgICAgICAgICAgNCpUSUxFV0lEVEgsIDAsIFxuICAgICAgICAgICAgICAgIFRJTEVXSURUSCwgVElMRUhFSUdIVCxcbiAgICAgICAgICAgICAgICBjdXJyZW50UGF0aFtwYXRoXVswXSpUSUxFV0lEVEgsIFxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXRoW3BhdGhdWzFdKlRJTEVIRUlHSFQsXG4gICAgICAgICAgICAgICAgVElMRVdJRFRILCBUSUxFSEVJR0hUKTsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50UGF0aFtwYXRoXSA9PT0gdW5kZWZpbmVkICYmIGN1cnJlbnRQYXRoW21hcmlvXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeD0wOyB4IDwgUEFHRVdJRFRIOyB4Kyspe1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB5PTA7IHkgPCBQQUdFSEVJR0hUOyB5Kyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmxkW3hdW3ldID09PSAzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JsZFt4XVt5XSA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKHRlcnJhaW5TaGVldCwgMCpUSUxFV0lEVEgsIDAsIFRJTEVXSURUSCwgVElMRUhFSUdIVCwgeCpUSUxFV0lEVEgsIHkqVElMRUhFSUdIVCwgVElMRVdJRFRILCBUSUxFSEVJR0hUKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgd2hpY2htYXJpbyA9IG1hcmlvICUgMiA9PT0gMCA/IDMgOiAyO1xuICAgICAgICAgICAgICAgIGxldCBtYXJpb1NoZWV0ID0gdGVycmFpblNoZWV0XG4gICAgICAgICAgICAgICAgaWYoY3VycmVudFBhdGhbbWFyaW8rMV0pe1xuICAgICAgICAgICAgICAgIG1hcmlvU2hlZXQgPSAoIGN1cnJlbnRQYXRoW21hcmlvXVswXSA8IGN1cnJlbnRQYXRoW21hcmlvKzFdWzBdID8gdGVycmFpblNoZWV0IDogdGVycmFpblNoZWV0UmV2ZXJzZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKG1hcmlvU2hlZXQsIFxuICAgICAgICAgICAgICAgIHdoaWNobWFyaW8qVElMRVdJRFRILCAwLCBcbiAgICAgICAgICAgICAgICBUSUxFV0lEVEgsIFRJTEVIRUlHSFQsXG4gICAgICAgICAgICAgICAgY3VycmVudFBhdGhbbWFyaW9dWzBdKlRJTEVXSURUSCwgXG4gICAgICAgICAgICAgICAgY3VycmVudFBhdGhbbWFyaW9dWzFdKlRJTEVIRUlHSFQsXG4gICAgICAgICAgICAgICAgVElMRVdJRFRILCBUSUxFSEVJR0hUKTtcblxuICAgICAgICAgICAgICAgIHdvcmxkW2N1cnJlbnRQYXRoW21hcmlvXVswXV1bY3VycmVudFBhdGhbbWFyaW9dWzFdXSA9IDNcbiAgICAgICAgICAgICAgICBtYXJpbysrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICBmb3IgKGxldCB4PTA7IHggPCBQQUdFV0lEVEg7IHgrKyl7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHk9MDsgeSA8IFBBR0VIRUlHSFQ7IHkrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29ybGRbeF1beV0gPT09IDMgfHwgd29ybGRbeF1beV0gPT09IDIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkW3hdW3ldID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGVycmFpblNoZWV0LCAwKlRJTEVXSURUSCwgMCwgVElMRVdJRFRILCBUSUxFSEVJR0hULCB4KlRJTEVXSURUSCwgeSpUSUxFSEVJR0hULCBUSUxFV0lEVEgsIFRJTEVIRUlHSFQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGF0aCsrO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGFuaW1hdGUocGF0aCk7XG4gICAgICAgICAgICB9LCAxMjApXG4gICAgICAgIH1cbiAgICAgICAgLy8gSU5WT0tFIElUXG4gICAgICAgIGFuaW1hdGUocGF0aCk7ICAgIFxuICAgIH1cblxuLy8gRFJBVyBGVU5DVElPTiBcblxuICAgIGZ1bmN0aW9uIHJlZHJhdygpIHtcbiAgICAgIGlmICghc3ByaXRlc2hlZXRMb2FkZWQpIHJldHVybjtcblxuICAgICAgICBjb25zb2xlLmxvZygncmVkcmF3aW5nLi4uJyk7XG5cbiAgICAgICAgdmFyIHNwcml0ZU51bSA9IDA7XG5cbiAgICAgICAgLy8gY2xlYXIgdGhlIHNjcmVlblxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAwMDAnO1xuICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblxuICAgICAgICBmb3IgKHZhciB4PTA7IHggPCBQQUdFV0lEVEg7IHgrKyl7XG4gICAgICAgICAgICBmb3IgKHZhciB5PTA7IHkgPCBQQUdFSEVJR0hUOyB5Kyspe1xuICAgICAgICAgICAgLy8gY3R4LmRyYXdJbWFnZShpbWcsc3gsc3ksc3dpZHRoLHNoZWlnaHQseCx5LHdpZHRoLGhlaWdodCk7XG4gICAgICAgICAgICAvLyBsYXkgZG93biBncmFzcyBiYXNlXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKHRlcnJhaW5TaGVldCwgMCpUSUxFV0lEVEgsIDAsIFRJTEVXSURUSCwgVElMRUhFSUdIVCwgeCpUSUxFV0lEVEgsIHkqVElMRUhFSUdIVCwgVElMRVdJRFRILCBUSUxFSEVJR0hUKTtcbiAgICAgICAgICAgIGlmKHdvcmxkW3hdW3ldID09PSAyKSB7XG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0ZXJyYWluU2hlZXQsIDEqIFRJTEVXSURUSCwgMCwgVElMRVdJRFRILCBUSUxFSEVJR0hULCB4KlRJTEVXSURUSCwgeSpUSUxFSEVJR0hULCBUSUxFV0lEVEgsIFRJTEVIRUlHSFQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih3b3JsZFt4XVt5XSA9PT0gMykge1xuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGVycmFpblNoZWV0LCAyKiBUSUxFV0lEVEgsIDAsIFRJTEVXSURUSCwgVElMRUhFSUdIVCwgeCpUSUxFV0lEVEgsIHkqVElMRUhFSUdIVCwgVElMRVdJRFRILCBUSUxFSEVJR0hUKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYod29ybGRbeF1beV0gPT09ICdnb29tYmEnKSB7XG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShnb29tYmEsIHgqVElMRVdJRFRILCB5KlRJTEVIRUlHSFQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG4vLy8vLyBEamlrc3RyYSdzIC8gQSogUGF0aGZpbmRpbmdcbiBcblxuZnVuY3Rpb24gZmluZFBhdGgod29ybGQsIHBhdGhTdGFydCwgcGF0aEVuZCl7XG4gICAgLy8gc2hvcnRjdXRzIGZvciBzcGVlZFxuICAgIHZhciBhYnMgPSBNYXRoLmFicztcbiAgICB2YXIgbWF4ID0gTWF0aC5tYXg7XG4gICAgdmFyIHBvdyA9IE1hdGgucG93O1xuICAgIHZhciBzcXJ0ID0gTWF0aC5zcXJ0O1xuXG5cbiAgICB2YXIgd29ybGRXaWR0aCA9IHdvcmxkWzBdLmxlbmd0aDtcbiAgICB2YXIgd29ybGRIZWlnaHQgPSB3b3JsZC5sZW5ndGg7XG4gICAgdmFyIHdvcmxkU2l6ZSA9IHdvcmxkV2lkdGggKiB3b3JsZEhlaWdodDtcblxuICAgIC8vIHdoaWNoIGhldXJpc3RpYyBzaG91bGQgd2UgdXNlP1xuICAgIC8vIGRlZmF1bHQ6IG5vIGRpYWdvbmFscyAoTWFuaGF0dGFuKVxuICAgIHZhciBkaXN0YW5jZUZ1bmN0aW9uID0gTWFuaGF0dGFuRGlzdGFuY2U7XG4gICAgdmFyIGZpbmROZWlnaGJvdXJzID0gZnVuY3Rpb24oKXt9OyAvLyBlbXB0eVxuXG4gICAgZnVuY3Rpb24gTWFuaGF0dGFuRGlzdGFuY2UoUG9pbnQsIEdvYWwpXG4gICAgeyAgIC8vIGxpbmVhciBtb3ZlbWVudCAtIG5vIGRpYWdvbmFscyAtIGp1c3QgY2FyZGluYWwgZGlyZWN0aW9ucyAoTlNFVylcbiAgICAgICAgcmV0dXJuIGFicyhQb2ludC54IC0gR29hbC54KSArIGFicyhQb2ludC55IC0gR29hbC55KTtcbiAgICB9XG5cbiAgICAvLyBOZWlnaGJvdXJzIGZ1bmN0aW9ucywgdXNlZCBieSBmaW5kTmVpZ2hib3VycyBmdW5jdGlvblxuICAgIC8vIHRvIGxvY2F0ZSBhZGphY2VudCBhdmFpbGFibGUgY2VsbHMgdGhhdCBhcmVuJ3QgYmxvY2tlZFxuXG4gICAgLy8gUmV0dXJucyBldmVyeSBhdmFpbGFibGUgTm9ydGgsIFNvdXRoLCBFYXN0IG9yIFdlc3RcbiAgICAvLyBjZWxsIHRoYXQgaXMgZW1wdHkuIE5vIGRpYWdvbmFscyxcbiAgICAvLyB1bmxlc3MgZGlzdGFuY2VGdW5jdGlvbiBmdW5jdGlvbiBpcyBub3QgTWFuaGF0dGFuXG4gICAgZnVuY3Rpb24gTmVpZ2hib3Vycyh4LCB5KVxuICAgIHtcbiAgICAgICAgdmFyIE4gPSB5IC0gMSxcbiAgICAgICAgUyA9IHkgKyAxLFxuICAgICAgICBFID0geCArIDEsXG4gICAgICAgIFcgPSB4IC0gMSxcbiAgICAgICAgbXlOID0gTiA+IC0xICYmIGNhbldhbGtIZXJlKHgsIE4pLFxuICAgICAgICBteVMgPSBTIDwgd29ybGRIZWlnaHQgJiYgY2FuV2Fsa0hlcmUoeCwgUyksXG4gICAgICAgIG15RSA9IEUgPCB3b3JsZFdpZHRoICYmIGNhbldhbGtIZXJlKEUsIHkpLFxuICAgICAgICBteVcgPSBXID4gLTEgJiYgY2FuV2Fsa0hlcmUoVywgeSksXG4gICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICBpZihteU4pXG4gICAgICAgIHJlc3VsdC5wdXNoKHt4OngsIHk6Tn0pO1xuICAgICAgICBpZihteUUpXG4gICAgICAgIHJlc3VsdC5wdXNoKHt4OkUsIHk6eX0pO1xuICAgICAgICBpZihteVMpXG4gICAgICAgIHJlc3VsdC5wdXNoKHt4OngsIHk6U30pO1xuICAgICAgICBpZihteVcpXG4gICAgICAgIHJlc3VsdC5wdXNoKHt4OlcsIHk6eX0pO1xuICAgICAgICBmaW5kTmVpZ2hib3VycyhteU4sIG15UywgbXlFLCBteVcsIE4sIFMsIEUsIFcsIHJlc3VsdCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyBldmVyeSBhdmFpbGFibGUgTm9ydGggRWFzdCwgU291dGggRWFzdCxcbiAgICAvLyBTb3V0aCBXZXN0IG9yIE5vcnRoIFdlc3QgY2VsbCAtIG5vIHNxdWVlemluZyB0aHJvdWdoXG4gICAgLy8gXCJjcmFja3NcIiBiZXR3ZWVuIHR3byBkaWFnb25hbHNcbiAgICBmdW5jdGlvbiBEaWFnb25hbE5laWdoYm91cnMobXlOLCBteVMsIG15RSwgbXlXLCBOLCBTLCBFLCBXLCByZXN1bHQpXG4gICAge1xuICAgICAgICBpZihteU4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKG15RSAmJiBjYW5XYWxrSGVyZShFLCBOKSlcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHt4OkUsIHk6Tn0pO1xuICAgICAgICAgICAgaWYobXlXICYmIGNhbldhbGtIZXJlKFcsIE4pKVxuICAgICAgICAgICAgcmVzdWx0LnB1c2goe3g6VywgeTpOfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYobXlTKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZihteUUgJiYgY2FuV2Fsa0hlcmUoRSwgUykpXG4gICAgICAgICAgICByZXN1bHQucHVzaCh7eDpFLCB5OlN9KTtcbiAgICAgICAgICAgIGlmKG15VyAmJiBjYW5XYWxrSGVyZShXLCBTKSlcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHt4OlcsIHk6U30pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyBldmVyeSBhdmFpbGFibGUgTm9ydGggRWFzdCwgU291dGggRWFzdCxcbiAgICAvLyBTb3V0aCBXZXN0IG9yIE5vcnRoIFdlc3QgY2VsbCBpbmNsdWRpbmcgdGhlIHRpbWVzIHRoYXRcbiAgICAvLyB5b3Ugd291bGQgYmUgc3F1ZWV6aW5nIHRocm91Z2ggYSBcImNyYWNrXCJcbiAgICBmdW5jdGlvbiBEaWFnb25hbE5laWdoYm91cnNGcmVlKG15TiwgbXlTLCBteUUsIG15VywgTiwgUywgRSwgVywgcmVzdWx0KVxuICAgIHtcbiAgICAgICAgbXlOID0gTiA+IC0xO1xuICAgICAgICBteVMgPSBTIDwgd29ybGRIZWlnaHQ7XG4gICAgICAgIG15RSA9IEUgPCB3b3JsZFdpZHRoO1xuICAgICAgICBteVcgPSBXID4gLTE7XG4gICAgICAgIGlmKG15RSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYobXlOICYmIGNhbldhbGtIZXJlKEUsIE4pKVxuICAgICAgICAgICAgcmVzdWx0LnB1c2goe3g6RSwgeTpOfSk7XG4gICAgICAgICAgICBpZihteVMgJiYgY2FuV2Fsa0hlcmUoRSwgUykpXG4gICAgICAgICAgICByZXN1bHQucHVzaCh7eDpFLCB5OlN9KTtcbiAgICAgICAgfVxuICAgICAgICBpZihteVcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKG15TiAmJiBjYW5XYWxrSGVyZShXLCBOKSlcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHt4OlcsIHk6Tn0pO1xuICAgICAgICAgICAgaWYobXlTICYmIGNhbldhbGtIZXJlKFcsIFMpKVxuICAgICAgICAgICAgcmVzdWx0LnB1c2goe3g6VywgeTpTfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIGJvb2xlYW4gdmFsdWUgKHdvcmxkIGNlbGwgaXMgYXZhaWxhYmxlIGFuZCBvcGVuKVxuICAgIGZ1bmN0aW9uIGNhbldhbGtIZXJlKHgsIHkpXG4gICAge1xuICAgICAgICByZXR1cm4gKCh3b3JsZFt4XSAhPSBudWxsKSAmJlxuICAgICAgICAgICAgKHdvcmxkW3hdW3ldICE9IG51bGwpICYmXG4gICAgICAgICAgICAod29ybGRbeF1beV0gIT0gJ2dvb21iYScpKTtcbiAgICB9O1xuXG4gICAgLy8gTm9kZSBmdW5jdGlvbiwgcmV0dXJucyBhIG5ldyBvYmplY3Qgd2l0aCBOb2RlIHByb3BlcnRpZXNcbiAgICAvLyBVc2VkIGluIHRoZSBjYWxjdWxhdGVQYXRoIGZ1bmN0aW9uIHRvIHN0b3JlIHJvdXRlIGNvc3RzLCBldGMuXG4gICAgZnVuY3Rpb24gTm9kZShQYXJlbnQsIFBvaW50KVxuICAgIHtcbiAgICAgICAgdmFyIG5ld05vZGUgPSB7XG4gICAgICAgICAgICAvLyBwb2ludGVyIHRvIGFub3RoZXIgTm9kZSBvYmplY3RcbiAgICAgICAgICAgIFBhcmVudDpQYXJlbnQsXG4gICAgICAgICAgICAvLyBhcnJheSBpbmRleCBvZiB0aGlzIE5vZGUgaW4gdGhlIHdvcmxkIGxpbmVhciBhcnJheVxuICAgICAgICAgICAgdmFsdWU6UG9pbnQueCArIChQb2ludC55ICogd29ybGRXaWR0aCksXG4gICAgICAgICAgICAvLyB0aGUgbG9jYXRpb24gY29vcmRpbmF0ZXMgb2YgdGhpcyBOb2RlXG4gICAgICAgICAgICB4OlBvaW50LngsXG4gICAgICAgICAgICB5OlBvaW50LnksXG4gICAgICAgICAgICAvLyB0aGUgaGV1cmlzdGljIGVzdGltYXRlZCBjb3N0XG4gICAgICAgICAgICAvLyBvZiBhbiBlbnRpcmUgcGF0aCB1c2luZyB0aGlzIG5vZGVcbiAgICAgICAgICAgIGY6MCxcbiAgICAgICAgICAgIC8vIHRoZSBkaXN0YW5jZUZ1bmN0aW9uIGNvc3QgdG8gZ2V0XG4gICAgICAgICAgICAvLyBmcm9tIHRoZSBzdGFydGluZyBwb2ludCB0byB0aGlzIG5vZGVcbiAgICAgICAgICAgIGc6MFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXdOb2RlO1xuICAgIH1cblxuICAgIC8vIFBhdGggZnVuY3Rpb24sIGV4ZWN1dGVzIEFTdGFyIGFsZ29yaXRobSBvcGVyYXRpb25zXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlUGF0aCgpXG4gICAge1xuICAgICAgICAvLyBjcmVhdGUgTm9kZXMgZnJvbSB0aGUgU3RhcnQgYW5kIEVuZCB4LHkgY29vcmRpbmF0ZXNcbiAgICAgICAgdmFyIG15cGF0aFN0YXJ0ID0gTm9kZShudWxsLCB7eDpwYXRoU3RhcnRbMF0sIHk6cGF0aFN0YXJ0WzFdfSk7XG4gICAgICAgIHZhciBteXBhdGhFbmQgPSBOb2RlKG51bGwsIHt4OnBhdGhFbmRbMF0sIHk6cGF0aEVuZFsxXX0pO1xuICAgICAgICAvLyBjcmVhdGUgYW4gYXJyYXkgdGhhdCB3aWxsIGNvbnRhaW4gYWxsIHdvcmxkIGNlbGxzXG4gICAgICAgIHZhciBBU3RhciA9IG5ldyBBcnJheSh3b3JsZFNpemUpO1xuICAgICAgICAvLyBsaXN0IG9mIGN1cnJlbnRseSBvcGVuIE5vZGVzXG4gICAgICAgIHZhciBPcGVuID0gW215cGF0aFN0YXJ0XTtcbiAgICAgICAgLy8gbGlzdCBvZiBjbG9zZWQgTm9kZXNcbiAgICAgICAgdmFyIENsb3NlZCA9IFtdO1xuICAgICAgICAvLyBsaXN0IG9mIHRoZSBmaW5hbCBvdXRwdXQgYXJyYXlcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAvLyByZWZlcmVuY2UgdG8gYSBOb2RlICh0aGF0IGlzIG5lYXJieSlcbiAgICAgICAgdmFyIG15TmVpZ2hib3VycztcbiAgICAgICAgLy8gcmVmZXJlbmNlIHRvIGEgTm9kZSAodGhhdCB3ZSBhcmUgY29uc2lkZXJpbmcgbm93KVxuICAgICAgICB2YXIgbXlOb2RlO1xuICAgICAgICAvLyByZWZlcmVuY2UgdG8gYSBOb2RlICh0aGF0IHN0YXJ0cyBhIHBhdGggaW4gcXVlc3Rpb24pXG4gICAgICAgIHZhciBteVBhdGg7XG4gICAgICAgIC8vIHRlbXAgaW50ZWdlciB2YXJpYWJsZXMgdXNlZCBpbiB0aGUgY2FsY3VsYXRpb25zXG4gICAgICAgIHZhciBsZW5ndGgsIG1heCwgbWluLCBpLCBqO1xuICAgICAgICAvLyBpdGVyYXRlIHRocm91Z2ggdGhlIG9wZW4gbGlzdCB1bnRpbCBub25lIGFyZSBsZWZ0XG4gICAgICAgIHdoaWxlKGxlbmd0aCA9IE9wZW4ubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICBtYXggPSB3b3JsZFNpemU7XG4gICAgICAgICAgICBtaW4gPSAtMTtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGxlbmd0aDsgaSsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKE9wZW5baV0uZiA8IG1heClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1heCA9IE9wZW5baV0uZjtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBncmFiIHRoZSBuZXh0IG5vZGUgYW5kIHJlbW92ZSBpdCBmcm9tIE9wZW4gYXJyYXlcbiAgICAgICAgICAgIG15Tm9kZSA9IE9wZW4uc3BsaWNlKG1pbiwgMSlbMF07XG4gICAgICAgICAgICAvLyBpcyBpdCB0aGUgZGVzdGluYXRpb24gbm9kZT9cbiAgICAgICAgICAgIGlmKG15Tm9kZS52YWx1ZSA9PT0gbXlwYXRoRW5kLnZhbHVlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG15UGF0aCA9IENsb3NlZFtDbG9zZWQucHVzaChteU5vZGUpIC0gMV07XG4gICAgICAgICAgICAgICAgZG9cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFtteVBhdGgueCwgbXlQYXRoLnldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2hpbGUgKG15UGF0aCA9IG15UGF0aC5QYXJlbnQpO1xuICAgICAgICAgICAgICAgIC8vIGNsZWFyIHRoZSB3b3JraW5nIGFycmF5c1xuICAgICAgICAgICAgICAgIEFTdGFyID0gQ2xvc2VkID0gT3BlbiA9IFtdO1xuICAgICAgICAgICAgICAgIC8vIHdlIHdhbnQgdG8gcmV0dXJuIHN0YXJ0IHRvIGZpbmlzaFxuICAgICAgICAgICAgICAgIHJlc3VsdC5yZXZlcnNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIC8vIG5vdCB0aGUgZGVzdGluYXRpb25cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBmaW5kIHdoaWNoIG5lYXJieSBub2RlcyBhcmUgd2Fsa2FibGVcbiAgICAgICAgICAgICAgICBteU5laWdoYm91cnMgPSBOZWlnaGJvdXJzKG15Tm9kZS54LCBteU5vZGUueSk7XG4gICAgICAgICAgICAgICAgLy8gdGVzdCBlYWNoIG9uZSB0aGF0IGhhc24ndCBiZWVuIHRyaWVkIGFscmVhZHlcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDAsIGogPSBteU5laWdoYm91cnMubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbXlQYXRoID0gTm9kZShteU5vZGUsIG15TmVpZ2hib3Vyc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghQVN0YXJbbXlQYXRoLnZhbHVlXSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXN0aW1hdGVkIGNvc3Qgb2YgdGhpcyBwYXJ0aWN1bGFyIHJvdXRlIHNvIGZhclxuICAgICAgICAgICAgICAgICAgICAgICAgbXlQYXRoLmcgPSBteU5vZGUuZyArIGRpc3RhbmNlRnVuY3Rpb24obXlOZWlnaGJvdXJzW2ldLCBteU5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXN0aW1hdGVkIGNvc3Qgb2YgZW50aXJlIGd1ZXNzZWQgcm91dGUgdG8gdGhlIGRlc3RpbmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBteVBhdGguZiA9IG15UGF0aC5nICsgZGlzdGFuY2VGdW5jdGlvbihteU5laWdoYm91cnNbaV0sIG15cGF0aEVuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1lbWJlciB0aGlzIG5ldyBwYXRoIGZvciB0ZXN0aW5nIGFib3ZlXG4gICAgICAgICAgICAgICAgICAgICAgICBPcGVuLnB1c2gobXlQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hcmsgdGhpcyBub2RlIGluIHRoZSB3b3JsZCBncmFwaCBhcyB2aXNpdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBBU3RhcltteVBhdGgudmFsdWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyByZW1lbWJlciB0aGlzIHJvdXRlIGFzIGhhdmluZyBubyBtb3JlIHVudGVzdGVkIG9wdGlvbnNcbiAgICAgICAgICAgICAgICBDbG9zZWQucHVzaChteU5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IC8vIGtlZXAgaXRlcmF0aW5nIHVudGlsIHRoZSBPcGVuIGxpc3QgaXMgZW1wdHlcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBhY3R1YWxseSBjYWxjdWxhdGUgdGhlIGEtc3RhciBwYXRoIVxuICAgIC8vIHRoaXMgcmV0dXJucyBhbiBhcnJheSBvZiBjb29yZGluYXRlc1xuICAgIC8vIHRoYXQgaXMgZW1wdHkgaWYgbm8gcGF0aCBpcyBwb3NzaWJsZVxuICAgIHJldHVybiBjYWxjdWxhdGVQYXRoKCk7XG5cbn0gLy8gZW5kIG9mIGZpbmRQYXRoKCkgZnVuY3Rpb25cblxuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdnb2wnLCB7XG4gICAgICAgIHVybDogJy9jb2RlL2NvbXB1dGVyc2NpZW5jZS9nb2wnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvZGUvY29tcHV0ZXJTY2llbmNlL2dvbC9nb2wuaHRtbCcsXG4gICAgICAgIG9uRW50ZXI6IGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICBvbkV4aXQ6IGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgY29udHJvbGxlcjogJ2dvbGN0cmwnXG4gICAgfSk7XG59KTtcblxuXG5hcHAuY29udHJvbGxlcignZ29sY3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxudmFyIGhhc3J1biA9IGZhbHNlO1xuJHNjb3BlLnBsYXl2YWwgPSAnUGxheSc7XG4kc2NvcGUuZ29saGVpZ2h0ID0gJHNjb3BlLmdvbHdpZHRoID0gMjU7XG5cbmZ1bmN0aW9uIGhlaWdodFdpZHRoQ2hhbmdlICgpIHtcbmlmKGhhc3J1bikgeyAgXG4gICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIilbMF07XG4gICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICBnYW1lT2ZMaWZlLmhlaWdodCA9ICRzY29wZS5nb2xoZWlnaHQ7XG4gICBnYW1lT2ZMaWZlLndpZHRoID0gJHNjb3BlLmdvbHdpZHRoO1xuICAgZ2FtZU9mTGlmZS5jcmVhdGVBbmRTaG93Qm9hcmQoKTtcbiAgIH1cbiAgIGhhc3J1biA9IHRydWU7XG59XG4kc2NvcGUuJHdhdGNoKCdnb2xoZWlnaHQnLCBmdW5jdGlvbigpIHtcbiAgICBoZWlnaHRXaWR0aENoYW5nZSgpO1xufSk7XG5cbiRzY29wZS4kd2F0Y2goJ2dvbHdpZHRoJywgZnVuY3Rpb24oKSB7XG4gICBoZWlnaHRXaWR0aENoYW5nZSgpO1xufSk7XG5cblxudmFyIGdhbWVPZkxpZmUgPSB7XG4gIHdpZHRoOiAkc2NvcGUuZ29sd2lkdGgsXG4gIGhlaWdodDogJHNjb3BlLmdvbGhlaWdodCxcbiAgc3RlcEludGVydmFsOiBudWxsLFxuXG4gIGNyZWF0ZUFuZFNob3dCb2FyZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGNyZWF0ZSA8dGFibGU+IGVsZW1lbnRcbiAgICB2YXIgZ29sdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIik7XG4gICAgXG4gICAgLy8gYnVpbGQgVGFibGUgSFRNTFxuICAgIHZhciB0YWJsZWh0bWwgPSAnJztcbiAgICBmb3IgKHZhciBoPTA7IGg8dGhpcy5oZWlnaHQ7IGgrKykge1xuICAgICAgdGFibGVodG1sICs9IFwiPHRyIGlkPSdyb3crXCIgKyBoICsgXCInPlwiO1xuICAgICAgZm9yICh2YXIgdz0wOyB3PHRoaXMud2lkdGg7IHcrKykge1xuICAgICAgICB0YWJsZWh0bWwgKz0gXCI8dGQgZGF0YS1zdGF0dXM9J2RlYWQnIGlkPSdcIiArIHcgKyBcIi1cIiArIGggKyBcIic+PC90ZD5cIjtcbiAgICAgIH1cbiAgICAgIHRhYmxlaHRtbCArPSBcIjwvdHI+XCI7XG4gICAgfVxuICAgIGdvbHRhYmxlLmlubmVySFRNTCA9IHRhYmxlaHRtbDtcbiAgICBcbiAgICAvLyBhZGQgdGFibGUgdG8gdGhlICNib2FyZCBlbGVtZW50XG4gICAgdmFyIGJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvYXJkJyk7XG4gICAgYm9hcmQuYXBwZW5kQ2hpbGQoZ29sdGFibGUpO1xuICAgIFxuICAgIC8vIG9uY2UgaHRtbCBlbGVtZW50cyBhcmUgYWRkZWQgdG8gdGhlIHBhZ2UsIGF0dGFjaCBldmVudHMgdG8gdGhlbVxuICAgIHRoaXMuc2V0dXBCb2FyZEV2ZW50cygpO1xuICB9LFxuXG4gIGZvckVhY2hDZWxsOiBmdW5jdGlvbiAoaXRlcmF0b3JGdW5jKSB7XG4gICAgZm9yICh2YXIgaD0wOyBoPHRoaXMuaGVpZ2h0OyBoKyspIHtcbiAgICAgIGZvciAodmFyIHc9MDsgdzx0aGlzLndpZHRoOyB3KyspIHtcbiAgICAgICAgdmFyIGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh3K1wiLVwiK2gpO1xuICAgICAgICBpZiAoY2VsbCkge1xuICAgICAgICAgIGl0ZXJhdG9yRnVuYyhjZWxsLCB3LCBoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvKiBcbiAgICAgIFdyaXRlIGZvckVhY2hDZWxsIGhlcmUuIFlvdSB3aWxsIGhhdmUgdG8gdmlzaXRcbiAgICAgIGVhY2ggY2VsbCBvbiB0aGUgYm9hcmQsIGNhbGwgdGhlIFwiaXRlcmF0b3JGdW5jXCIgZnVuY3Rpb24sXG4gICAgICBhbmQgcGFzcyBpbnRvIGZ1bmMsIHRoZSBjZWxsIGFuZCB0aGUgY2VsbCdzIHggJiB5XG4gICAgICBjb29yZGluYXRlcy4gRm9yIGV4YW1wbGU6IGl0ZXJhdG9yRnVuYyhjZWxsLCB4LCB5KVxuICAgICovXG4gIH0sXG4gIFxuICBzZXR1cEJvYXJkRXZlbnRzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdG9nZ2xlQ2VsbCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgY2VsbCA9IGUudGFyZ2V0O1xuICAgICAgaWYgKGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXR1cycpID09ICdkZWFkJykge1xuICAgICAgICBjZWxsLmNsYXNzTmFtZSA9IFwiYWxpdmVcIjtcbiAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdHVzJywgJ2FsaXZlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjZWxsLmNsYXNzTmFtZSA9IFwiZGVhZFwiO1xuICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0dXMnLCAnZGVhZCcpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIG1ha2VBbGl2ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBjZWxsID0gZS50YXJnZXQ7XG4gICAgICAgIGNlbGwuY2xhc3NOYW1lID0gXCJhbGl2ZVwiO1xuICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0dXMnLCAnYWxpdmUnKTtcbiAgICB9O1xuICAgIHZhciBib2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib2FyZCcpO1xuICAgIGJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG1ha2VBbGl2ZSk7XG4gICAgfSk7XG4gICAgYm9hcmQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGJvYXJkLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScpO1xuICAgIH0pO1xuICAgIGJvYXJkLm9ubW91c2Vkb3duID0gZnVuY3Rpb24oKSB7XG4gICAgICBib2FyZC5vbm1vdXNlbW92ZSA9IG1ha2VBbGl2ZTtcbiAgICAgIGJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnKTtcbiAgICB9O1xuICAgIGJvYXJkLm9ubW91c2V1cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgYm9hcmQub25tb3VzZW1vdmUgPSBudWxsO1xuICAgIH07XG4gICAgYm9hcmQub25jbGljayA9IHRvZ2dsZUNlbGw7XG4gICAgXG4gICAgdGhpcy5hZGRCdXR0b25FdmVudHMoKTtcbiAgfSxcblxuICBhZGRCdXR0b25FdmVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RlcF9idG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RlcF9idG4nKTtcbiAgICBpZiAoc3RlcF9idG4pIHtcbiAgICAgIHN0ZXBfYnRuLm9uY2xpY2sgPSB0aGlzLnN0ZXAuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICB2YXIgcGxheV9idG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheV9idG4nKTtcbiAgICBpZiAocGxheV9idG4pIHtcbiAgICAgIHBsYXlfYnRuLm9uY2xpY2sgPSB0aGlzLmVuYWJsZUF1dG9QbGF5LmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgdmFyIHJlc2V0X2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNldF9idG4nKTtcbiAgICBpZiAocmVzZXRfYnRuKSB7XG4gICAgICByZXNldF9idG4ub25jbGljayA9IHRoaXMucmVzZXQuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICB2YXIgY2xlYXJfYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFyX2J0bicpO1xuICAgIGlmIChjbGVhcl9idG4pIHtcbiAgICAgIGNsZWFyX2J0bi5vbmNsaWNrID0gdGhpcy5jbGVhckJvYXJkLmJpbmQodGhpcyk7XG4gICAgfVxuICB9LFxuXG4gIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmZvckVhY2hDZWxsKGZ1bmN0aW9uKGNlbGwpIHtcbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDw9IC41KSB7XG4gICAgICAgIGNlbGwuY2xhc3NOYW1lID0gXCJhbGl2ZVwiO1xuICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0dXMnLCAnYWxpdmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNlbGwuY2xhc3NOYW1lID0gXCJkZWFkXCI7XG4gICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXR1cycsICdkZWFkJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGNsZWFyQm9hcmQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZm9yRWFjaENlbGwoZnVuY3Rpb24oY2VsbCkge1xuICAgICAgICBjZWxsLmNsYXNzTmFtZSA9IFwiZGVhZFwiO1xuICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0dXMnLCAnZGVhZCcpO1xuICAgIH0pO1xuICB9LFxuICBzdGVwOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mb3JFYWNoQ2VsbChmdW5jdGlvbihjZWxsLCB4LCB5KSB7XG4gICAgICB2YXIgYWxpdmVOZWlnaGJvcnMgPSAwLCBuZWlnaF9pZCwgbmNlbGw7XG5cbiAgICAgIGZvcih2YXIgaSA9IC0xOyBpIDw9IDE7IGkrKykge1xuICAgICAgICBmb3IodmFyIGogPSAtMTsgaiA8PSAxOyBqKyspIHtcbiAgICAgICAgICBuZWlnaF9pZCA9ICh4K2kpKyctJysoeStqKTtcbiAgICAgICAgICBpZiAoIShpPT09MCAmJiBqPT09MCkpIHtcbiAgICAgICAgICAgIG5jZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmVpZ2hfaWQpO1xuICAgICAgICAgICAgaWYgKG5jZWxsICYmIG5jZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS1zdGF0dXMnKSA9PSBcImFsaXZlXCIpIHtcbiAgICAgICAgICAgICAgYWxpdmVOZWlnaGJvcnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbmVpZ2hib3JzJywgYWxpdmVOZWlnaGJvcnMpO1xuICAgIH0pO1xuXG4gICAgdmFyIGRldGVybWluZU5leHRTdGF0ZSA9IGZ1bmN0aW9uIChjZWxsKSB7XG4gICAgICB2YXIgY3VyclN0YXRlID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdHVzJyk7XG4gICAgICB2YXIgbnVtTmVpZ2hib3JzID0gcGFyc2VJbnQoY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmVpZ2hib3JzJykpO1xuICAgICAgdmFyIG5leHRTdGF0ZSA9IGN1cnJTdGF0ZTtcblxuICAgICAgaWYgKGN1cnJTdGF0ZSA9PSBcImFsaXZlXCIgJiYgKG51bU5laWdoYm9yczwyIHx8IG51bU5laWdoYm9ycyA+IDMpKSB7XG4gICAgICAgIG5leHRTdGF0ZSA9IFwiZGVhZFwiO1xuICAgICAgfSBlbHNlIGlmIChjdXJyU3RhdGUgPT0gXCJkZWFkXCIgJiYgbnVtTmVpZ2hib3JzID09PSAzKSB7XG4gICAgICAgIG5leHRTdGF0ZSA9IFwiYWxpdmVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgfTtcblxuICAgIHRoaXMuZm9yRWFjaENlbGwoZnVuY3Rpb24oY2VsbCwgeCwgeSkge1xuICAgICAgdmFyIG5leHRTdGF0ZSA9IGRldGVybWluZU5leHRTdGF0ZShjZWxsKTtcbiAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXR1cycsIG5leHRTdGF0ZSk7XG4gICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnZGF0YS1uZWlnaGJvcnMnLCAtMSk7XG4gICAgICBjZWxsLmNsYXNzTmFtZSA9IG5leHRTdGF0ZTtcbiAgICB9KTtcbiAgICBcbiAgfSxcblxuICBlbmFibGVBdXRvUGxheTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLnN0ZXBJbnRlcnZhbCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuc3RlcEludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnN0ZXAoKTtcbiAgICAgICAgfSwgKDEwMDAgLyAkc2NvcGUucGxheXNwZWVkKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN0ZXBJbnRlcnZhbCk7XG4gICAgICAgIHRoaXMuc3RlcEludGVydmFsID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKCRzY29wZS5wbGF5dmFsID09PSAnUGxheScpIHtcbiAgICAgICAgJHNjb3BlLnBsYXl2YWwgPSAnU3RvcCc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5X2J0bicpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9J3JlZCc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLnBsYXl2YWwgPSAnUGxheSc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5X2J0bicpLnN0eWxlLmJhY2tncm91bmRDb2xvcj0nIzMzN2FiNyc7XG4gICAgfVxuICAgICRzY29wZS4kZGlnZXN0KCk7XG59LFxuICBsb2FkcHJlc2V0OiBmdW5jdGlvbihhcnIpIHtcbiAgICAgICAgaWYoYXJyKSB7XG4gICAgICAgIHRoaXMuY2xlYXJCb2FyZCgpO1xuICAgICAgICB0aGlzLmZvckVhY2hDZWxsKGZ1bmN0aW9uKGNlbGwpIHtcbiAgICAgIGlmIChhcnIuaW5kZXhPZihjZWxsLmlkKSAhPT0gLTEpIHtcbiAgICAgICAgY2VsbC5jbGFzc05hbWUgPSBcImFsaXZlXCI7XG4gICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXR1cycsICdhbGl2ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2VsbC5jbGFzc05hbWUgPSBcImRlYWRcIjtcbiAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdHVzJywgJ2RlYWQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB9XG4gICAgfVxuXG59O1xudmFyIHByZXNldE9iaiA9IHtcbiAgICAnR29zcGVyIEdsaWRlciBHdW4nIDogWzQ1LDQ1LCc0LTEwJywnNS0xMCcsJzQtMTEnLCc1LTExJywnMTQtMTAnLCcxNC0xMScsJzE0LTEyJywnMTUtOScsJzE1LTEzJywnMTYtOCcsJzE3LTgnLCcxNi0xNCcsJzE3LTE0JywnMTgtMTEnLCcxOS05JywnMTktMTMnLCcyMC0xMCcsJzIwLTExJywnMjAtMTInLCcyMS0xMScsJzI0LTgnLCcyNC05JywnMjQtMTAnLCcyNS04JywnMjUtOScsJzI1LTEwJywnMjYtNycsJzI2LTExJywnMjgtNicsJzI4LTcnLCcyOC0xMScsJzI4LTEyJywnMzgtOCcsJzM4LTknLCAnMzktOCcsICczOS05J10sXG4gICAgJzEwLWNlbGwgU3RhYmxlJyA6IFsyNSwyNSwnNy0xMicsJzgtMTInLCc5LTEyJywnMTAtMTInLCcxMS0xMicsJzEyLTEyJywnMTMtMTInLCcxNC0xMicsJzE1LTEyJywnMTYtMTInXSxcbiAgICAnRmxpcHBlcnMnIDogWzI1LDI1LCc0LTMnLCc1LTMnLCczLTMnLCcxLTUnLCcxLTYnLCcxLTcnLCc3LTUnLCc3LTYnLCc3LTcnLCczLTknLCc0LTknLCc1LTknLCcxNy01JywnMTgtNScsJzE5LTUnLCcxNS03JywnMTUtOCcsJzE1LTknLCcyMS03JywnMjEtOCcsJzIxLTknLCcxNy0xMScsJzE4LTExJywnMTktMTEnLCcxMC0xMScsJzEwLTEyJywnMTAtMTMnLCcxMC0xNycsJzEwLTE4JywnMTAtMTknLCc2LTE1JywnNy0xNScsJzgtMTUnLCcxMi0xNScsJzEzLTE1JywnMTQtMTUnXSxcbiAgICAnR2xpZGVyIENvbGxpZGVyJyA6IFsyOSwyNiwnMS0wJywnMjctMCcsJzItMScsJzI2LTEnLCcwLTInLCcxLTInLCcyLTInLCcyNi0yJywnMjctMicsJzI4LTInLCcwLTIzJywnMS0yMycsJzItMjMnLCcyNi0yMycsJzI3LTIzJywnMjgtMjMnLCcyLTI0JywnMjYtMjQnLCcxLTI1JywnMjctMjUnXVxufTtcbiRzY29wZS4kd2F0Y2goJ3ByZXNldCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBteXByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIHZhciBwcmUgPSBwcmVzZXRPYmpbJHNjb3BlLnByZXNldF07XG4gICAgaWYocHJlKXtcbiAgICAkc2NvcGUuZ29sd2lkdGggPSBwcmVbMF07XG4gICAgJHNjb3BlLmdvbGhlaWdodCA9IHByZVsxXTtcbiAgICByZXNvbHZlKHByZSk7XG4gIH1cbn0pLnRoZW4oZnVuY3Rpb24gKHByZSkge1xuICAgIGdhbWVPZkxpZmUubG9hZHByZXNldChwcmUpO1xufSk7XG59KTtcbiRzY29wZS5wbGF5c3BlZWQgPSAyO1xuJHNjb3BlLiR3YXRjaCgncGxheXNwZWVkJywgZnVuY3Rpb24oKXtcbiAgICBcbn0pO1xuXG4gIGdhbWVPZkxpZmUuY3JlYXRlQW5kU2hvd0JvYXJkKCk7XG59KTtcbiIsImFwcC5mYWN0b3J5KCdleG9GYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS9kMy9leG9wbGFuZXRzJykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4b3BsYW5ldHMnLCB7XG4gICAgICAgIHVybDogJy9jb2RlL2QzL2V4b3BsYW5ldHMnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvZGUvZDMvZXhvcGxhbmV0cy9leG9wbGFuZXRzLmh0bWwnLFxuICAgICAgICBvbkVudGVyOiBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgb25FeGl0OiBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHBsYW5ldGRhdGEgOiBmdW5jdGlvbihleG9GYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4b0ZhY3RvcnkuZ2V0RGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb250cm9sbGVyOiAnZXhvY3RybCdcbiAgICB9KTtcbn0pO1xuXG5cbmFwcC5jb250cm9sbGVyKCdleG9jdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgZXhvRmFjdG9yeSwgcGxhbmV0ZGF0YSwgZDNTZXJ2aWNlKSB7XG4gICAgJHNjb3BlLnBsYW5ldERhdGEgPSBwbGFuZXRkYXRhLmRhdGEuc2xpY2UoMTMsKHBsYW5ldGRhdGEuZGF0YS5sZW5ndGgpKS5maWx0ZXIoZnVuY3Rpb24gKGRhdHVtKSB7XG4gICAgICAgIHJldHVybihkYXR1bVs0XSAmJiBkYXR1bVs4XSk7XG4gICAgfSk7XG5cbmQzU2VydmljZS5kMygpLnRoZW4oZnVuY3Rpb24oZDMpIHtcbiAgICB2YXIgZDNib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkM2JveCcpWzBdO1xuXG4gICAgdmFyIHdpZHRoID0gZDNib3gub2Zmc2V0V2lkdGgtMTA7XG4gICAgdmFyIGhlaWdodCA9IDE2MDA7XG5cbiAgICB2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAgIC5kb21haW4oWzAsIHdpZHRoXSlcbiAgICAgICAgLnJhbmdlKFswLCB3aWR0aF0pO1xuXG4gICAgdmFyIHkgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgICAuZG9tYWluKFswLCBoZWlnaHRdKVxuICAgICAgICAucmFuZ2UoW2hlaWdodCwgMF0pO1xuXG4gICAgZnVuY3Rpb24gZ2V0SWQoZCkge1xuICAgICAgICByZXR1cm4gZFs2XTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0U2l6ZShkKSB7XG4gICAgICAgIHJldHVybiBOdW1iZXIoZFs4XSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldENvbG9yKGQpIHtcbiAgICAgICAgdmFyIHRlbXAgPSBkWzddIC8gMTAwO1xuICAgICAgICBpZighdGVtcCkgcmV0dXJuICd3aGl0ZSc7XG4gICBlbHNlIGlmKHRlbXAgPD0gMC4yNSkgcmV0dXJuICcjNzk5RkZGJztcbiAgIGVsc2UgaWYodGVtcCA+IDAuMjUgJiYgdGVtcCA8PSAwLjUgKSByZXR1cm4gJyM4OUE5RjYnO1xuICAgZWxzZSBpZih0ZW1wID4gMC41ICYmIHRlbXAgPD0gMSApIHJldHVybiAnI0EzQjZFMCc7XG4gICBlbHNlIGlmKHRlbXAgPiAxICYmIHRlbXAgPD0gMiApIHJldHVybiAnI0I5QkRDQyc7XG4gICBlbHNlIGlmKHRlbXAgPiAyICYmIHRlbXAgPD0gMyApIHJldHVybiAnI0NDQzFCOCc7XG4gICBlbHNlIGlmKHRlbXAgPiAzICYmIHRlbXAgPD0gNCApIHJldHVybiAnI0U4QzM5OSc7XG4gICBlbHNlIGlmKHRlbXAgPiA0ICYmIHRlbXAgPD0gNSApIHJldHVybiAnI0ZCQzE4MCc7XG4gICBlbHNlIGlmKHRlbXAgPiA1ICYmIHRlbXAgPD0gNiApIHJldHVybiAnI0ZGQzA3OCc7XG4gICBlbHNlIGlmKHRlbXAgPiA2ICYmIHRlbXAgPD0gNyApIHJldHVybiAnI0ZGQjg1Mic7XG4gICBlbHNlIGlmKHRlbXAgPiA3ICYmIHRlbXAgPD0gOCApIHJldHVybiAnI0ZGQjAzNyc7XG4gICBlbHNlIGlmKHRlbXAgPiA4ICYmIHRlbXAgPD0gOSApIHJldHVybiAnI0ZGQTcxMic7XG4gICBlbHNlIGlmKHRlbXAgPiA5ICYmIHRlbXAgPD0gMTAgKSByZXR1cm4gJyNGRkEyMDAnO1xuICAgZWxzZSBpZih0ZW1wID4gMTAgJiYgdGVtcCA8PSAxMSApIHJldHVybiAnI0ZGOEQwMCc7XG4gICBlbHNlIGlmKHRlbXAgPiAxMSAmJiB0ZW1wIDw9IDEyICkgcmV0dXJuICcjRkY4MzAwJztcbiAgIGVsc2UgaWYodGVtcCA+IDEyICYmIHRlbXAgPD0gMTMgKSByZXR1cm4gJyNGRjc1MDAnO1xuICAgZWxzZSBpZih0ZW1wID4gMTMgJiYgdGVtcCA8PSAxNCApIHJldHVybiAnI0ZGNkIwMCc7XG4gICBlbHNlIGlmKHRlbXAgPiAxNCAmJiB0ZW1wIDw9IDE1ICkgcmV0dXJuICcjRkY2MTAwJztcbiAgIGVsc2UgaWYodGVtcCA+IDE1ICYmIHRlbXAgPD0gMTYgKSByZXR1cm4gJyNGRjYwMDAnO1xuICAgZWxzZSBpZih0ZW1wID4gMTYgJiYgdGVtcCA8PSAxNyApIHJldHVybiAnI0ZGNTQwMCc7XG4gICBlbHNlIGlmKHRlbXAgPiAxNyAmJiB0ZW1wIDw9IDE4ICkgcmV0dXJuICcjRkY1MTAwJztcbiAgIGVsc2UgaWYodGVtcCA+IDE4ICYmIHRlbXAgPD0gMTkgKSByZXR1cm4gJyNGRjQ4MDAnO1xuICAgZWxzZSBpZih0ZW1wID4gMTkgJiYgdGVtcCA8PSAyMCApIHJldHVybiAnI0ZGM0UwMCc7XG4gICBlbHNlIGlmKHRlbXAgPiAyMCAmJiB0ZW1wIDw9IDIxICkgcmV0dXJuICcjRkYzRTAwJztcbiAgIGVsc2UgaWYodGVtcCA+IDIxICYmIHRlbXAgPD0gMjIgKSByZXR1cm4gJyNlNjM4MDAnO1xuICAgZWxzZSBpZih0ZW1wID4gMjIgJiYgdGVtcCA8PSAyMyApIHJldHVybiAnI2NjMzIwMCc7XG4gICBlbHNlIGlmKHRlbXAgPiAyMyAmJiB0ZW1wIDw9IDI0ICkgcmV0dXJuICcjRjUyNzI3JztcbiAgIGVsc2UgaWYodGVtcCA+IDI0ICYmIHRlbXAgPD0gMjUgKSByZXR1cm4gJyNGRjBBMEEnO1xuICAgZWxzZSBpZih0ZW1wID4gMjUgJiYgdGVtcCA8PSAyNiApIHJldHVybiAnI0Y3NjMwNyc7XG4gICBlbHNlIGlmKHRlbXAgPiAyNiAmJiB0ZW1wIDw9IDI3ICkgcmV0dXJuICcjQ0YxMDIwJztcbiAgIGVsc2UgaWYodGVtcCA+IDI3KSByZXR1cm4gJyNDRjEwMjAnO1xuICAgIH1cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm0oZCkge1xuICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHgoTWF0aC5jb3MoTnVtYmVyKGRbMl0pKSAqIE51bWJlcihkWzRdKSArNTgwKSArIFwiLFwiICsgeShNYXRoLnNpbihOdW1iZXIoZFsyXSkpICogTnVtYmVyKGRbNF0pKzgwMCkgKyBcIilcIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gem9vbSgpIHtcbiAgICBjaXJjbGUuYXR0cihcInRyYW5zZm9ybVwiLCB0cmFuc2Zvcm0pO1xuICAgIH1cblxuICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIuZDNib3hcIikuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG4gICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgXCJidWJibGVcIilcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAnMCAwICcgKyB3aWR0aCArICcgJyArIGhlaWdodClcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpXG4gICAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5jYWxsKGQzLmJlaGF2aW9yLnpvb20oKS54KHgpLnkoeSkuc2NhbGVFeHRlbnQoWzEsIDhdKS5vbihcInpvb21cIiwgem9vbSkpO1xuXG4gICAgIHN2Zy5hcHBlbmQoXCJyZWN0XCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcIm92ZXJsYXlcIilcbiAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XG5cbiAgIHZhciBjaXJjbGUgPSBzdmcuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgLmRhdGEoJHNjb3BlLnBsYW5ldERhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoXCJyXCIsIGdldFNpemUpXG4gICAgLmF0dHIoJ2lkJywgZ2V0SWQpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ3BsYW5ldCcpXG4gICAgLmF0dHIoXCJmaWxsXCIsIGdldENvbG9yKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIHRyYW5zZm9ybSlcbiAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzdmcuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEoJHNjb3BlLnBsYW5ldERhdGEpLmFwcGVuZCgndGl0bGUnKS50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgaWYoZFs2XSA9PT0gJ0VhcnRoJykgcmV0dXJuIChkWzZdICsgJ1xcbicgKyAnVGVtcGVyYXR1cmU6ICcgKyAoZFs3XSB8fCAnTi9BJykgKyAnIEtlbHZpbicgKTtcbiAgICAgICAgZWxzZSByZXR1cm4gKGRbNl0gKyAnXFxuJyArICdEaXN0YW5jZTogJyArIHBhcnNlSW50KGRbNF0pICsgJyBQYXJzZWNzICgnICsgcGFyc2VJbnQoZFs0XSozLjI2MTU2KSArICcgTGlnaHQgWWVhcnMpJyArICdcXG4nICsgJ1NpemU6ICcgKyBkWzhdICsgJyBFYXJ0aCByYWRpaScgKyAnXFxuJyArICdUZW1wZXJhdHVyZTogJyArIChkWzddIHx8ICdOL0EnKSArICcgS2VsdmluJyApO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBkMy5zZWxlY3QoJyNlYXJ0aCcpLmF0dHIoJ2ZpbGwnLCAnbGlnaHRibHVlJyk7XG59KTtcblxufSk7XG5cblxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncmVzdCcsIHtcbiAgICAgICAgdXJsOiAnL2NvZGUvbm9kZS9yZXN0JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb2RlL25vZGUvUmVzdC9yZXN0Lmh0bWwnLFxuICAgICAgICBvbkVudGVyOiBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgb25FeGl0OiBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAgICRyb290U2NvcGUuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3RhdGljJywge1xuICAgICAgICB1cmw6ICcvY29kZS9yZWFjdC9zdGF0aWMnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvZGUvcmVhY3Qvc3RhdGljL3N0YXRpYy5odG1sJyxcbiAgICAgICAgb25FbnRlcjogZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLmhpZGRlbiA9IHRydWU7XG4gICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIG9uRXhpdDogZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiIsIiAgYXBwLmRpcmVjdGl2ZSgnd2hlZWxpZXNlbGVjdG9yJywgWydkM1NlcnZpY2UnLCBmdW5jdGlvbihkM1NlcnZpY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICBzY29wZToge30sXG4gICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL2QzX0JhbGwvZDNfQmFsbC5odG1sJyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgIHNjb3BlLnVwZGF0ZVZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGQzU2VydmljZS5kMygpLnRoZW4oZnVuY3Rpb24oZDMpIHtcbiAgICAgICAgICAgIGQzLnNlbGVjdCgnI3RoaW5neScpLmFwcGVuZCgnc3F1YXJlJykuc3R5bGUoJ2hlaWdodCcsICczMDBweCcpLnN0eWxlKCdoZWlnaHQnLCAnMzAwcHgnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgc2NvcGUuJHdhdGNoKCdyJywgZnVuY3Rpb24gKG5ld3ZhbCwgb2xkdmFsKXtcbiAgICAgICAgICBjb25zb2xlLmxvZygnaGl0IHdhdGNoIGZ1bmN0aW9uIHJhZGl1cycsIG9sZHZhbCwgbmV3dmFsKTtcbiAgICAgICAgICBkM1NlcnZpY2UuZDMoKS50aGVuKGZ1bmN0aW9uKGQzKSB7XG4gICAgICAgICAgICBkMy5zZWxlY3QoJ2NpcmNsZScpLmF0dHIoJ3InLCBuZXd2YWwpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgICBzY29wZS4kd2F0Y2goJ2N4JywgZnVuY3Rpb24gKG5ld3ZhbCwgb2xkdmFsKXtcbiAgICAgICAgICBjb25zb2xlLmxvZygnaGl0IHdhdGNoIGZ1bmN0aW9uIGN4Jywgb2xkdmFsLCBuZXd2YWwpO1xuICAgICAgICAgIGQzU2VydmljZS5kMygpLnRoZW4oZnVuY3Rpb24oZDMpIHtcbiAgICAgICAgICAgIGQzLnNlbGVjdCgnY2lyY2xlJykuYXR0cignY3gnLCBuZXd2YWwpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgICBzY29wZS4kd2F0Y2goJ2N5JywgZnVuY3Rpb24gKG5ld3ZhbCwgb2xkdmFsKXtcbiAgICAgICAgICBjb25zb2xlLmxvZygnaGl0IHdhdGNoIGZ1bmN0aW9uIGN5Jywgb2xkdmFsLCBuZXd2YWwpO1xuICAgICAgICAgIGQzU2VydmljZS5kMygpLnRoZW4oZnVuY3Rpb24oZDMpIHtcbiAgICAgICAgICAgIGQzLnNlbGVjdCgnY2lyY2xlJykuYXR0cignY3knLCBuZXd2YWwpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgc2NvcGUuJHdhdGNoKCdjb2xvcicsIGZ1bmN0aW9uIChuZXd2YWwsIG9sZHZhbCl7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2hpdCB3YXRjaCBmdW5jdGlvbicsIG9sZHZhbCwgbmV3dmFsKTtcbiAgICAgICAgICBkM1NlcnZpY2UuZDMoKS50aGVuKGZ1bmN0aW9uKGQzKSB7XG4gICAgICAgICAgICBkMy5zZWxlY3QoJ2NpcmNsZScpLnN0eWxlKCdmaWxsJywgbmV3dmFsKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGQzU2VydmljZS5kMygpLnRoZW4oZnVuY3Rpb24oZDMpIHtcbiAgICAgICAgICAgIGQzLnNlbGVjdChcIiN0aGluZ3lcIilcbiAgICAgICAgICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgc2NvcGUuY3ggfHwgMzAwKVxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBzY29wZS5jeSB8fCAzMDApXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgc2NvcGUuciB8fCAxMDApIFxuICAgICAgICAgICAgLnN0eWxlKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCAncmVkJyk7XG5cbiAgICAgICAgfSk7XG4gICAgICB9fTtcbiAgfV0pO1xuXG4iLCJhcHAuZGlyZWN0aXZlKCdsb2dvJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9sb2dvL2xvZ28uaHRtbCcsXG4gICAgfTtcbn0pO1xuXG4iLCJhcHAuZGlyZWN0aXZlKCduYXZiYXInLCBmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge30sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG5cbiAgICAgICAgICAgIHNjb3BlLml0ZW1zID0gW1xuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdBYm91dCBNZScsIHN0YXRlOiAnYWJvdXQnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ1BvcnRmb2xpbycsIHN0YXRlOiAncHJvamVjdHMnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0dldCBpbiBUb3VjaCcsIHN0YXRlOiAnY29udGFjdCcgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnQmxvZycsIHN0YXRlOiAnYmxvZycgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnQ29kZScsIHN0YXRlOiAnY29kZScgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
