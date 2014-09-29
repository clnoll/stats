var app = angular.module("Renzu", ['ngRoute']);

app.config(function($routeProvider) {
     $routeProvider

     // route for the display page
     .when('/', {
         templateUrl: 'partials/display.html',
         controller: 'valController'
     })
     .when('/test', {
         templateUrl: 'partials/test.html',
         controller: 'testController'
     })
 });

app.controller('testController', ['$scope', function($scope){
    $scope.salesData=[
        {hour: 1,sales: 54},
        {hour: 2,sales: 66},
        {hour: 3,sales: 77},
        {hour: 4,sales: 70},
        {hour: 5,sales: 60},
        {hour: 6,sales: 63},
        {hour: 7,sales: 55},
        {hour: 8,sales: 47},
        {hour: 9,sales: 55},
        {hour: 10,sales: 30}
    ];
}]);

app.controller('valController', ['$scope', function($scope){
  d3.csv('resources/challenge-dataset.csv', function(dataset) {
    // console.log(dataset)
    $scope.dataset = dataset
    $scope.dataset.forEach(function(d) {
    // var format = d3.time.format("%Y/%m/%d");
    // var parseFormat = format.parse(d.Date);
    // d.Date = format.parse(d.Date);
    d.jDate = +d.Date.slice(4,6)
    d.Value = +d.Value;
    })
  })
}]);
// .filter( function(d) {
    //   if (d.Metric !== "D1") {
    //     console.log(d)
    //     return d;
    //   }
    // })
