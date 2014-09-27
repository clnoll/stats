 // create the module
 angular.module('Renzu', ['ngRoute', 'ngResource'])

 .config(function($routeProvider) {
     $routeProvider

     // route for the calculator page
         .when('/', {
         templateUrl: 'partials/display.html',
         controller: 'dataController'
     });
 })

 .controller('dataController', function($scope, $http) {
  $scope.values = {

  }
 })
