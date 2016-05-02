app.config(function ($stateProvider) {
    $stateProvider.state('dijkstra', {
        url: '/code/computerScience/dijkstra',
        templateUrl: 'js/code/computerScience/dijkstra/dijkstras.html',
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        },
        controller: 'dijkCtrl'
    });
});

app.controller('dijkCtrl', function ($scope) {
    // Initialize variables
    let initiallyCreated = false;
    let spritesheetLoaded = false;
    let currentPath = [];
    const world = [[]];
    const terrainSheet = new Image();
    terrainSheet.src = 'spritesheet.png';
    const terrainSheetReverse = new Image();
    terrainSheetReverse.src = 'spritesheetReverse.png';
    const goomba =  new Image()
    goomba.src = 'goomba.png'
    const PAGEHEIGHT = 26;
    const PAGEWIDTH = 26;
    const TILEWIDTH = 32;
    const TILEHEIGHT = 32;
    let pathStart = [PAGEHEIGHT,PAGEWIDTH]
    let pathEnd = [0,0];
    const canvas = document.getElementById('marioCanvas');
    canvas.width = PAGEWIDTH * TILEWIDTH;
    canvas.height = PAGEHEIGHT * TILEHEIGHT;
    const ctx = canvas.getContext("2d");
    terrainSheet.onload = loaded;

    function loaded() {
          console.log('Spritesheet loaded.');
          spritesheetLoaded = true;
          $scope.createWorld();
      }

    //GOOMBA CREATION, MARIO AND PIPE DRAGGING

    let dieGoomba = (e) => {
        let clickX = Math.floor(e.layerX / TILEWIDTH) * TILEWIDTH;
        let clickY = Math.floor(e.layerY / TILEHEIGHT) * TILEHEIGHT;
        let gridPosition = world[clickX/TILEWIDTH][clickY/TILEHEIGHT]
            if(gridPosition === 2 || gridPosition === 3) return
        world[clickX/TILEWIDTH][clickY/TILEHEIGHT] = 0;
        ctx.drawImage(terrainSheet, 0*TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, clickX, clickY, TILEWIDTH, TILEHEIGHT);
    }

    let makeGoomba = (e) => {
        let clickX = Math.floor(e.layerX / TILEWIDTH) * TILEWIDTH;
        let clickY = Math.floor(e.layerY / TILEHEIGHT) * TILEHEIGHT;
        let gridPosition = world[clickX/TILEWIDTH][clickY/TILEHEIGHT]
        if(gridPosition === 2 || gridPosition === 3) return
        ctx.drawImage(goomba, 
            clickX, clickY);
            world[clickX/TILEWIDTH][clickY/TILEHEIGHT] = 'goomba';
        }

    let pipeMove = function(e) {
        let clickX = Math.floor(e.layerX / TILEWIDTH) * TILEWIDTH;
        let clickY = Math.floor(e.layerY / TILEHEIGHT) * TILEHEIGHT;
        for (let x=0; x < PAGEWIDTH; x++){
            for (let y=0; y < PAGEHEIGHT; y++){
                if (world[x][y] === 2){
                    world[x][y] = 0
                    ctx.drawImage(terrainSheet, 0*TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x*TILEWIDTH, y*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                }
            }
        }
        ctx.drawImage(terrainSheet, 1* TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, clickX, clickY, TILEWIDTH, TILEHEIGHT)
        world[clickX/TILEWIDTH][clickY/TILEHEIGHT] = 2;
    }    

    let marioMove = function(e) {
        let clickX = Math.floor(e.layerX / TILEWIDTH) * TILEWIDTH;
        let clickY = Math.floor(e.layerY / TILEHEIGHT) * TILEHEIGHT;
        for (let x=0; x < PAGEWIDTH; x++){
            for (let y=0; y < PAGEHEIGHT; y++){
                if (world[x][y] === 3){
                    world[x][y] = 0
                    ctx.drawImage(terrainSheet, 0*TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x*TILEWIDTH, y*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                }
            }
        }
        ctx.drawImage(terrainSheet, 2* TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, clickX, clickY, TILEWIDTH, TILEHEIGHT)
        world[clickX/TILEWIDTH][clickY/TILEHEIGHT] = 3;
    }    

    //EVENT LISTENERS

    canvas.ondblclick = function(e) {
        dieGoomba(e)
    }
    canvas.onclick = function(e) {
        makeGoomba(e);
    }
    canvas.onmousedown = function(e) {
        let clickX = Math.floor(e.layerX / TILEWIDTH) * TILEWIDTH;
        let clickY = Math.floor(e.layerY / TILEHEIGHT) * TILEHEIGHT;
        let gridPosition = world[clickX/TILEWIDTH][clickY/TILEHEIGHT]
        if(gridPosition === 2){
            canvas.onmousemove = pipeMove;
        }
        else if(gridPosition === 3){
            canvas.onmousemove = marioMove;
        }
        else{
        canvas.onmousemove = makeGoomba;
        }
    };

    canvas.onmouseup = function() {
        // console.log(world.map(x => x.map(y => world[x][y])))
        canvas.onmousemove = null;
    };

    //USER INTERACTIONS

    $scope.createWorld = (goombas) => {
        console.log('Creating world...');
        initiallyCreated = true
      // create emptiness
      for (let x=0; x < PAGEWIDTH; x++){
        world[x] = [];
        for (let y=0; y < PAGEHEIGHT; y++){
          world[x][y] = 0;
        }
      }
      if(goombas) {
      // scatter goombas
      for (let x=0; x < PAGEWIDTH; x++){
        for (let y=0; y < PAGEHEIGHT; y++){
            if (Math.random() > 0.7){
                world[x][y] = 'goomba';
            }
        }
      }
      }
      world[Math.ceil(TILEWIDTH/3)][Math.ceil(TILEHEIGHT/3)] = 2;
      world[Math.ceil(TILEWIDTH/3) + 1][Math.ceil(TILEHEIGHT/3)] = 3;
      redraw();
    }


    $scope.pathToPipe = () => {
        // find start and end points and then create path array
        for(let i=0; i<world.length; i++) {
            for(let j=0; j<world[i].length; j++){
                if(world[i][j] === 2) pathStart = [i,j];
                if(world[i][j] === 3) pathEnd = [i,j];
            }
        }
        let path = 0;
        let mario = 0;
        let pipePos = currentPath.shift();
        currentPath = findPath(world,pathStart,pathEnd);
        currentPath = currentPath.reverse();

        // animate path function
        function animate(path) {
            if(currentPath[path] !== undefined){
                ctx.drawImage(terrainSheet, 
                4*TILEWIDTH, 0, 
                TILEWIDTH, TILEHEIGHT,
                currentPath[path][0]*TILEWIDTH, 
                currentPath[path][1]*TILEHEIGHT,
                TILEWIDTH, TILEHEIGHT); 
            }
            else if (currentPath[path] === undefined && currentPath[mario] !== undefined) {
                for (let x=0; x < PAGEWIDTH; x++){
                    for (let y=0; y < PAGEHEIGHT; y++){
                        if (world[x][y] === 3){
                            world[x][y] = 0
                            ctx.drawImage(terrainSheet, 0*TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x*TILEWIDTH, y*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                        }
                    }
                }
                let whichmario = mario % 2 === 0 ? 3 : 2;
                let marioSheet = terrainSheet
                if(currentPath[mario+1]){
                marioSheet = ( currentPath[mario][0] < currentPath[mario+1][0] ? terrainSheet : terrainSheetReverse );
                }
                ctx.drawImage(marioSheet, 
                whichmario*TILEWIDTH, 0, 
                TILEWIDTH, TILEHEIGHT,
                currentPath[mario][0]*TILEWIDTH, 
                currentPath[mario][1]*TILEHEIGHT,
                TILEWIDTH, TILEHEIGHT);

                world[currentPath[mario][0]][currentPath[mario][1]] = 3
                mario++
            }
            else{
                 for (let x=0; x < PAGEWIDTH; x++){
                    for (let y=0; y < PAGEHEIGHT; y++){
                        if (world[x][y] === 3 || world[x][y] === 2){
                            world[x][y] = 0
                            ctx.drawImage(terrainSheet, 0*TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x*TILEWIDTH, y*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                        }
                    }
                }
                return null;
            }
            path++;
            setTimeout(function(){
                animate(path);
            }, 120)
        }
        // INVOKE IT
        animate(path);    
    }

// DRAW FUNCTION 

    function redraw() {
      if (!spritesheetLoaded) return;

        console.log('redrawing...');

        var spriteNum = 0;

        // clear the screen
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var x=0; x < PAGEWIDTH; x++){
            for (var y=0; y < PAGEHEIGHT; y++){
            // ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
            // lay down grass base
            ctx.drawImage(terrainSheet, 0*TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x*TILEWIDTH, y*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
            if(world[x][y] === 2) {
                ctx.drawImage(terrainSheet, 1* TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x*TILEWIDTH, y*TILEHEIGHT, TILEWIDTH, TILEHEIGHT)
            }
            if(world[x][y] === 3) {
                ctx.drawImage(terrainSheet, 2* TILEWIDTH, 0, TILEWIDTH, TILEHEIGHT, x*TILEWIDTH, y*TILEHEIGHT, TILEWIDTH, TILEHEIGHT)
            }
            if(world[x][y] === 'goomba') {
                ctx.drawImage(goomba, x*TILEWIDTH, y*TILEHEIGHT);
            }
            }
        }

    }



///// Djikstra's / A* Pathfinding
 

function findPath(world, pathStart, pathEnd){
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
    var findNeighbours = function(){}; // empty

    function ManhattanDistance(Point, Goal)
    {   // linear movement - no diagonals - just cardinal directions (NSEW)
        return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
    }

    // Neighbours functions, used by findNeighbours function
    // to locate adjacent available cells that aren't blocked

    // Returns every available North, South, East or West
    // cell that is empty. No diagonals,
    // unless distanceFunction function is not Manhattan
    function Neighbours(x, y)
    {
        var N = y - 1,
        S = y + 1,
        E = x + 1,
        W = x - 1,
        myN = N > -1 && canWalkHere(x, N),
        myS = S < worldHeight && canWalkHere(x, S),
        myE = E < worldWidth && canWalkHere(E, y),
        myW = W > -1 && canWalkHere(W, y),
        result = [];
        if(myN)
        result.push({x:x, y:N});
        if(myE)
        result.push({x:E, y:y});
        if(myS)
        result.push({x:x, y:S});
        if(myW)
        result.push({x:W, y:y});
        findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
        return result;
    }

    // returns every available North East, South East,
    // South West or North West cell - no squeezing through
    // "cracks" between two diagonals
    function DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result)
    {
        if(myN)
        {
            if(myE && canWalkHere(E, N))
            result.push({x:E, y:N});
            if(myW && canWalkHere(W, N))
            result.push({x:W, y:N});
        }
        if(myS)
        {
            if(myE && canWalkHere(E, S))
            result.push({x:E, y:S});
            if(myW && canWalkHere(W, S))
            result.push({x:W, y:S});
        }
    }

    // returns every available North East, South East,
    // South West or North West cell including the times that
    // you would be squeezing through a "crack"
    function DiagonalNeighboursFree(myN, myS, myE, myW, N, S, E, W, result)
    {
        myN = N > -1;
        myS = S < worldHeight;
        myE = E < worldWidth;
        myW = W > -1;
        if(myE)
        {
            if(myN && canWalkHere(E, N))
            result.push({x:E, y:N});
            if(myS && canWalkHere(E, S))
            result.push({x:E, y:S});
        }
        if(myW)
        {
            if(myN && canWalkHere(W, N))
            result.push({x:W, y:N});
            if(myS && canWalkHere(W, S))
            result.push({x:W, y:S});
        }
    }

    // returns boolean value (world cell is available and open)
    function canWalkHere(x, y)
    {
        return ((world[x] != null) &&
            (world[x][y] != null) &&
            (world[x][y] != 'goomba'));
    };

    // Node function, returns a new object with Node properties
    // Used in the calculatePath function to store route costs, etc.
    function Node(Parent, Point)
    {
        var newNode = {
            // pointer to another Node object
            Parent:Parent,
            // array index of this Node in the world linear array
            value:Point.x + (Point.y * worldWidth),
            // the location coordinates of this Node
            x:Point.x,
            y:Point.y,
            // the heuristic estimated cost
            // of an entire path using this node
            f:0,
            // the distanceFunction cost to get
            // from the starting point to this node
            g:0
        };

        return newNode;
    }

    // Path function, executes AStar algorithm operations
    function calculatePath()
    {
        // create Nodes from the Start and End x,y coordinates
        var mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
        var mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
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
        while(length = Open.length)
        {
            max = worldSize;
            min = -1;
            for(i = 0; i < length; i++)
            {
                if(Open[i].f < max)
                {
                    max = Open[i].f;
                    min = i;
                }
            }
            // grab the next node and remove it from Open array
            myNode = Open.splice(min, 1)[0];
            // is it the destination node?
            if(myNode.value === mypathEnd.value)
            {
                myPath = Closed[Closed.push(myNode) - 1];
                do
                {
                    result.push([myPath.x, myPath.y]);
                }
                while (myPath = myPath.Parent);
                // clear the working arrays
                AStar = Closed = Open = [];
                // we want to return start to finish
                result.reverse();
            }
            else // not the destination
            {
                // find which nearby nodes are walkable
                myNeighbours = Neighbours(myNode.x, myNode.y);
                // test each one that hasn't been tried already
                for(i = 0, j = myNeighbours.length; i < j; i++)
                {
                    myPath = Node(myNode, myNeighbours[i]);
                    if (!AStar[myPath.value])
                    {
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