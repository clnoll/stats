app.factory ('nestFunction', ['$rootScope',
  function(){

  // var nestFxn =

  return {

    result: function(d) {

    d3.nest().key(function($rootScope) {
      if ($rootScope.filterOptions.selectedFilter === "App") {
          return d.App;
      } else if ($rootScope.filterOptions.selectedFilter === "Category") {
          return d.Category;
      } else if ($rootScope.filterOptions.selectedFilter === "Platform") {
          return d.Platform; }
    }).key(function(d) {
        return d.Date
    })();
  }

}


}]);
