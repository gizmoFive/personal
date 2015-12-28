  app.directive('d3Ball', ['d3Service', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {},
      link: function() {
        d3Service.d3().then(function(d3) {
          var colors = ['purple', 'orange', 'red', 'yellow', 'blue', 'pink'];
          for(var i=0; i < 100; i++) {
            d3.select("#thingy")
            .append("circle")
            .attr("cx", 8+(5*i))
            .attr("cy", 8)
            .attr("r", 8)
            .style("position", "absolute")
            .style("fill", colors[(i % colors.length)])
           
          
        }
          setInterval(function() {
            d3.selectAll("circle")
            .transition()
            .delay(400)
            .duration(2000)
            .attr('cx',Math.floor(Math.random(0,400)))
            .attr('cy',Math.floor(Math.random(0,400)))
            .attr('r', Math.floor(Math.random(0,30)));
          }, 1000);
          // if(d3.selectAll('circle')[0].attr("r") === 30) {
          //   console.log("got this far!");
          // }


        

        });
      }};
  }]);

