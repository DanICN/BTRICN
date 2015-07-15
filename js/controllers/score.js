angular.module('btr')
.controller('scoreController', function($scope, $http, $routeParams, $firebaseArray, $firebaseObject, $location){

  var ref = new Firebase("https://btr-icn-backup.firebaseapp.com//scores/"+$routeParams.id);

  $scope.scoreData = $firebaseObject(ref).$bindTo($scope, "scoreData");

  $scope.scoreList = $firebaseArray(ref);

    // // add an item
    // list.$add({ foo: "bar" }).then(...);

    // // remove an item
    // list.$remove(2).then(...);

    // // make the list available in the DOM

});
