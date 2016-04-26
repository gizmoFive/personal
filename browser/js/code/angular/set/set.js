'use strict';

app.filter('maptofa', function () {
    return function (input) {
        if (input === 'squiggle') return 'scribd'; 
        else if (input === 'oval') return 'lemon-o'; 
        else return input;
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('set', {
        url: '/code/angular/set',
        templateUrl: 'js/code/angular/set/set.html',
        controller: 'HomeController',
        onEnter: ($rootScope) => {
          $rootScope.hidden = true;
        },
        onExit: ($rootScope) => {
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