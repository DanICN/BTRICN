angular.module('btr')
.controller('scoresController', function(authService, $scope, $http, $routeParams, $firebaseArray, $firebaseAuth, $location){

  $scope.answerList = $firebaseArray(new Firebase("https://btr-icn-backup.firebaseapp.com//answers"));

  $scope.questionList = $firebaseArray(new Firebase("https://btr-icn-backup.firebaseapp.com//questions"));
  
  $scope.scoreList = $firebaseArray(new Firebase("https://btr-icn-backup.firebaseapp.com//scores"));

});
