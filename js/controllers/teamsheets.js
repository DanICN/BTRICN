angular.module('btr')
.controller('teamsheetsController', function($scope, authService, $firebaseArray, $route){
  // teams list
  $scope.list = $firebaseArray(authService.ref.child('teamsheets'));

  $scope.data = {};
  // Image uploader
  $scope.uploadFile = function() {
    filepicker.setKey("AZGYefKTvWICru5bjIX1Az");

    filepicker.pick(
      function(Blob){
        console.log(Blob.url);
        $scope.data.teamImage = Blob.url
      }
    );
  }

  $scope.add_new_teamsheet = function() {
    if ($scope.data.teamName) {
      $scope.list.$add($scope.data);
      $scope.data = {};
      swal("Team Created!", "", "success")
    };
  }
    
});
