app.config(function ($stateProvider) {
    $stateProvider.state('gol', {
        url: '/code/computerscience/gol',
        templateUrl: 'js/code/computerScience/gol/gol.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        },
        controller: 'golctrl'
    });
});


app.controller('golctrl', function ($scope, $q) {

var hasrun = false;
$scope.playval = 'Play';
$scope.golheight = $scope.golwidth = 25;

function heightWidthChange (height, width) {
if(hasrun) {  
   var element = document.getElementsByTagName("tbody")[0];
   element.parentNode.removeChild(element);
   gameOfLife.height = $scope.golheight;
   gameOfLife.width = $scope.golwidth;
   gameOfLife.createAndShowBoard();
   }
   hasrun = true;
}
$scope.$watch('golheight', function() {
    heightWidthChange($scope.golheight, $scope.golwidth);
});

$scope.$watch('golwidth', function() {
   heightWidthChange($scope.golheight, $scope.golwidth);
});


var gameOfLife = {
  width: $scope.golwidth,
  height: $scope.golheight,
  stepInterval: null,

  createAndShowBoard: function () {
    // create <table> element
    var goltable = document.createElement("tbody");
    
    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
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

  forEachCell: function (iteratorFunc) {
    for (var h=0; h<this.height; h++) {
      for (var w=0; w<this.width; w++) {
        var cell = document.getElementById(w+"-"+h);
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
  
  setupBoardEvents: function() {
    var toggleCell = function (e) {
      var cell = e.target;
      if (cell.getAttribute('data-status') == 'dead') {
        cell.className = "alive";
        cell.setAttribute('data-status', 'alive');
      } else {
        cell.className = "dead";
        cell.setAttribute('data-status', 'dead');
      }
    };
    var makeAlive = function (e) {
        var cell = e.target;
        cell.className = "alive";
        cell.setAttribute('data-status', 'alive');
    };
    var board = document.getElementById('board');
    board.onmousedown = function() {
      board.onmousemove = makeAlive;
    };
    board.onmouseup = function() {
      board.onmousemove = null;
    };
    board.onclick = toggleCell;
    
    this.addButtonEvents();
  },

  addButtonEvents: function () {
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

  reset: function() {
    this.forEachCell(function(cell) {
      if (Math.random() <= .5) {
        cell.className = "alive";
        cell.setAttribute('data-status', 'alive');
      } else {
        cell.className = "dead";
        cell.setAttribute('data-status', 'dead');
      }
    });
  },
  clearBoard: function() {
    this.forEachCell(function(cell) {
        cell.className = "dead";
        cell.setAttribute('data-status', 'dead');
    });
  },
  step: function () {
    this.forEachCell(function(cell, x, y) {
      var aliveNeighbors = 0, neigh_id, ncell;

      for(var i = -1; i <= 1; i++) {
        for(var j = -1; j <= 1; j++) {
          neigh_id = (x+i)+'-'+(y+j);
          if (!(i===0 && j===0)) {
            ncell = document.getElementById(neigh_id);
            if (ncell && ncell.getAttribute('data-status') == "alive") {
              aliveNeighbors++;
            }
          }
        }
      }

      cell.setAttribute('data-neighbors', aliveNeighbors);
    });

    var determineNextState = function (cell) {
      var currState = cell.getAttribute('data-status');
      var numNeighbors = parseInt(cell.getAttribute('data-neighbors'));
      var nextState = currState;

      if (currState == "alive" && (numNeighbors<2 || numNeighbors > 3)) {
        nextState = "dead";
      } else if (currState == "dead" && numNeighbors === 3) {
        nextState = "alive";
      }

      return nextState;
    };

    this.forEachCell(function(cell, x, y) {
      var nextState = determineNextState(cell);
      cell.setAttribute('data-status', nextState);
      cell.setAttribute('data-neighbors', -1);
      cell.className = nextState;
    });
    
  },

  enableAutoPlay: function() {
    if (!this.stepInterval) {
        var self = this;
        this.stepInterval = setInterval(function() {
            self.step();
        }, (1000 / $scope.playspeed));
    } else {
        clearInterval(this.stepInterval);
        this.stepInterval = null;
    }
    if ($scope.playval === 'Play') {
        $scope.playval = 'Stop';
        $('#play_btn').css({'background-color': 'red'});
    } else {
        $scope.playval = 'Play';
         $('#play_btn').css({'background-color': '#337ab7'});
    }
    $scope.$digest();
},
  loadpreset: function(arr) {
        if(arr) {
        this.clearBoard();
        this.forEachCell(function(cell) {
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
    'Gosper Glider Gun' : [45,45,'4-10','5-10','4-11','5-11','14-10','14-11','14-12','15-9','15-13','16-8','17-8','16-14','17-14','18-11','19-9','19-13','20-10','20-11','20-12','21-11','24-8','24-9','24-10','25-8','25-9','25-10','26-7','26-11','28-6','28-7','28-11','28-12','38-8','38-9', '39-8', '39-9'],
    '10-cell Stable' : [25,25,'7-12','8-12','9-12','10-12','11-12','12-12','13-12','14-12','15-12','16-12'],
    'Flippers' : [25,25,'4-3','5-3','3-3','1-5','1-6','1-7','7-5','7-6','7-7','3-9','4-9','5-9','17-5','18-5','19-5','15-7','15-8','15-9','21-7','21-8','21-9','17-11','18-11','19-11','10-11','10-12','10-13','10-17','10-18','10-19','6-15','7-15','8-15','12-15','13-15','14-15'],
    'Glider Collider' : [29,26,'1-0','27-0','2-1','26-1','0-2','1-2','2-2','26-2','27-2','28-2','0-23','1-23','2-23','26-23','27-23','28-23','2-24','26-24','1-25','27-25']
};
$scope.$watch('preset', function() {
    var mypromise = new Promise(function (resolve, reject) {
    var pre = presetObj[$scope.preset];
    $scope.golwidth = pre[0];
    $scope.golheight = pre[1];
    resolve(pre);
}).then(function (pre) {
    gameOfLife.loadpreset(pre);
});
});
$scope.playspeed = 2;
$scope.$watch('playspeed', function(){
    
});

  gameOfLife.createAndShowBoard();
});
