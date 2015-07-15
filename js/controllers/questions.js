angular.module('btr')
.controller('questionsController', function($scope, authService, $firebaseArray, $firebaseObject){
  $scope.data = {};

  // categories list
	$scope.categoriesList = $firebaseArray(authService.ref.child('categories'));

  $scope.add_new_category = function() {
    $scope.categoriesList.$add($scope.categoryData);
    $scope.categoryData = {};
    swal("Category Created!", "", "success");
  }

  // questions list
	var questionObj = $firebaseObject(authService.ref.child('questions'));
	questionObj.$bindTo($scope, "questionObj");


  $scope.add_new_question = function() {
  	$scope.listnew = $firebaseArray(authService.ref.child('questions/'+$scope.data.category));	
    $scope.listnew.$add($scope.data);
    $scope.data = {};
    swal("Question Created!", "", "success");
  }
    
});