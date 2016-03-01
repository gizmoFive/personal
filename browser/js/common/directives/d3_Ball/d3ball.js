  app.directive('wheelieselector', ['d3Service', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'js/common/directives/d3_Ball/d3_Ball.html',
      link: function(scope) {
        scope.updateValues = function() {
          d3Service.d3().then(function(d3) {
            d3.select('#thingy').append('square').style('height', '300px').style('height', '300px');
          });
        };
        scope.$watch('r', function (newval, oldval){
          console.log('hit watch function radius', oldval, newval);
          d3Service.d3().then(function(d3) {
            d3.select('circle').attr('r', newval);
          });
        });
          scope.$watch('cx', function (newval, oldval){
          console.log('hit watch function cx', oldval, newval);
          d3Service.d3().then(function(d3) {
            d3.select('circle').attr('cx', newval);
          });
        });
          scope.$watch('cy', function (newval, oldval){
          console.log('hit watch function cy', oldval, newval);
          d3Service.d3().then(function(d3) {
            d3.select('circle').attr('cy', newval);
          });
        });
        scope.$watch('color', function (newval, oldval){
          console.log('hit watch function', oldval, newval);
          d3Service.d3().then(function(d3) {
            d3.select('circle').style('fill', newval);
          });
        });
        d3Service.d3().then(function(d3) {
            d3.select("#thingy")
            .append("circle")
            .attr("cx", scope.cx || 300)
            .attr("cy", scope.cy || 300)
            .attr("r", scope.r || 100) 
            .style("position", "absolute")
            .style("fill", 'red');

        });
      }};
  }]);

