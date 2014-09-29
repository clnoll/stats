// angular.module('appApp.directives')
//   .directive('d3Bars', ['d3Service', function(d3Service) {
//     return {
//       restrict: 'EA',
//       scope: {},
//       link: function(scope, element, attrs) {
//         d3Service.d3().then(function(d3) {
//           var margin = parseInt(attrs.margin) || 20,
//           barHeight = parseInt(attrs.barHeight) || 20,
//           barPadding = parseInt(attrs.barPadding) || 5;
//           var svg = d3.select(ele[0])
//             .append('svg')
//             .style('width', '100%');

//           // Browser onresize event
//           window.onresize = function() {
//             scope.$apply();
//           };

//           // hard-code data
//           scope.data = [
//             {name: "Greg", score: 98},
//             {name: "Ari", score: 96},
//             {name: 'Q', score: 75},
//             {name: "Loser", score: 48}
//           ];

//           // Watch for resize event
//           scope.$watch(function() {
//             return angular.element($window)[0].innerWidth;
//           }, function() {
//             scope.render(scope.data);
//           });

//           scope.render = function(data) {
//               // remove all previous items before render
//               svg.selectAll('*').remove();



//             }
//         });
//       }};
//   }]);
