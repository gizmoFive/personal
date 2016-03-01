app.factory('exoFactory', function ($http) {
    return {
        logit: function() {
            console.log('factoryworking');
        },
        getData: function() {
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
        onEnter: function ($rootScope) {
          $rootScope.hidden = true;
          
        },
        onExit: function ($rootScope) {
          $rootScope.hidden = false;
        },
        resolve: {
            planetdata : function(exoFactory) {
                return exoFactory.getData();
            }
        },
        controller: 'exoctrl'
    });
});


app.controller('exoctrl', function ($scope, exoFactory, planetdata, d3Service) {
    $scope.planetData = planetdata.data.slice(13,(planetdata.data.length)).filter(function (datum) {
        return(datum[4] && datum[8]);
    });
    console.log($scope.planetData);

d3Service.d3().then(function(d3) {
    var width = 1160;
    var height = 1600;

    var x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, height])
        .range([height, 0]);

    var svg = d3.select(".d3box").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('class', "bubble")
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append("g")
        .call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", zoom));

     svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);

   var circle = svg.selectAll("circle")
    .data($scope.planetData)
    .enter().append("circle")
    .attr("r", getSize)
    .attr('id', getId)
    .attr('class', 'planet')
    .attr("fill", getColor)
    .attr("transform", transform)
    .on('mouseover', function() {
        svg.selectAll("circle").data($scope.planetData).append('title').text(function(d) {
        return (d[6] + '\n'  + 'Distance: ' + parseInt(d[4]) + ' Parsecs (' + parseInt(d[4]*3.26156) + ' Light Years)' + '\n' + 'Size: ' + d[8] + ' Earth radii' + '\n' + 'Temperature: ' + (d[7] || 'N/A') + ' Kelvin' );
        });
    });

    function getId(d) {
        return d[6];
    }
    function getSize(d) {
        return Number(d[8]);
    }
    function getColor(d) {
        var temp = d[7] / 100,
        red, green, blue;
        if(!temp) return 'white';
   else if(temp <= 0.25) return '#799FFF';
   else if(temp > 0.25 && temp <= 0.5 ) return '#89A9F6';
   else if(temp > 0.5 && temp <= 1 ) return '#A3B6E0';
   else if(temp > 1 && temp <= 2 ) return '#B9BDCC';
   else if(temp > 2 && temp <= 3 ) return '#CCC1B8';
   else if(temp > 3 && temp <= 4 ) return '#E8C399';
   else if(temp > 4 && temp <= 5 ) return '#FBC180';
   else if(temp > 5 && temp <= 6 ) return '#FFC078';
   else if(temp > 6 && temp <= 7 ) return '#FFB852';
   else if(temp > 7 && temp <= 8 ) return '#FFB037';
   else if(temp > 8 && temp <= 9 ) return '#FFA712';
   else if(temp > 9 && temp <= 10 ) return '#FFA200';
   else if(temp > 10 && temp <= 11 ) return '#FF8D00';
   else if(temp > 11 && temp <= 12 ) return '#FF8300';
   else if(temp > 12 && temp <= 13 ) return '#FF7500';
   else if(temp > 13 && temp <= 14 ) return '#FF6B00';
   else if(temp > 14 && temp <= 15 ) return '#FF6100';
   else if(temp > 15 && temp <= 16 ) return '#FF6000';
   else if(temp > 16 && temp <= 17 ) return '#FF5400';
   else if(temp > 17 && temp <= 18 ) return '#FF5100';
   else if(temp > 18 && temp <= 19 ) return '#FF4800';
   else if(temp > 19 && temp <= 20 ) return '#FF3E00';
   else if(temp > 20 && temp <= 21 ) return '#FF3E00';
   else if(temp > 21 && temp <= 22 ) return '#e63800';
   else if(temp > 22 && temp <= 23 ) return '#cc3200';
   else if(temp > 23 && temp <= 24 ) return '#F52727';
   else if(temp > 24 && temp <= 25 ) return '#FF0A0A';
   else if(temp > 25 && temp <= 26 ) return '#F76307';
   else if(temp > 26 && temp <= 27 ) return '#CF1020';
   else if(temp > 27) return '#CF1020';
    }

    function zoom() {
    circle.attr("transform", transform);
    }

    function transform(d) {
    return "translate(" + x(Math.cos(Number(d[2])) * Number(d[4]) +580) + "," + y(Math.sin(Number(d[2])) * Number(d[4])+800) + ")";
    }

    d3.select('#earth').attr('fill', 'lightblue');

});

});


