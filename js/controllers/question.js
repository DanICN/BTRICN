angular.module('btr')
.controller('questionController', function($scope, authService, $routeParams, $firebaseObject, $firebaseArray, $location){
  // questions list
  $scope.list = $firebaseArray(authService.ref.child('questions'));
  // questions list
  var questionObj = $firebaseObject(authService.ref.child('questions'));
  questionObj.$bindTo($scope, "questionObj");
  // categories list
  $scope.categoriesList = $firebaseArray(authService.ref.child('categories'));

  // question obj
  var questionRef = authService.ref.child('questions/'+$routeParams.id+'/'+$routeParams.name);
	var obj = $firebaseObject(questionRef);
  $scope.data = obj.$bindTo($scope, "data");

  $scope.moveCategory = function(category) {    
    var newMessageRef = authService.ref.child('questions/'+category).push();
    var moveData = {};
    if ($scope.data.questionTitle) {
      moveData.questionTitle = $scope.data.questionTitle;
    };
    if ($scope.data.q1) {
      moveData.q1 = $scope.data.q1;
    };
    if ($scope.data.q2) {
      moveData.q2 = $scope.data.q2;
    };
    if ($scope.data.q3) {
      moveData.q3 = $scope.data.q3;
    };
    if ($scope.data.q4) {
      moveData.q4 = $scope.data.q4;
    };
    if ($scope.data.type) {
      moveData.type = $scope.data.type;
    };

    newMessageRef.set(moveData);

    var path = newMessageRef.toString();
    console.log(path.split("/"));
    var cat = path.split("/")[4]
    var id = path.split("/")[5]
    questionRef.remove();
    $location.path("question/"+cat+"/"+id);
  }

  $scope.delete = function() {
    swal({   
      title: "Are you sure?",
      text: "You will not be able to recover this question!",   
      type: "warning",   
      showCancelButton: true,   
      confirmButtonColor: "#DD6B55",   
      confirmButtonText: "Yes, delete it!",   
      cancelButtonText: "No, cancel please!",   
      closeOnConfirm: false,   
      closeOnCancel: false 
    }, 
    function(isConfirm){   
      if (isConfirm) {     
        swal("Deleted!", "Question has been deleted.", "success");   
        questionRef.remove();
        $location.path('questions');
      } 
      else {     
        swal("Cancelled", "Question not deleted!", "error");   
      } 
    });
  }
});
