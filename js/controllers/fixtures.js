angular.module('btr')
.controller('fixturesController', function($scope, authService, $firebaseArray){
  authService.user("fixtures")

  // matches list
  var list = $firebaseArray(authService.ref.child('matches'));
  $scope.list = list;

});
