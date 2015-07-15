angular.module('btr')
.controller('registerController', function(authService, $scope, $http, $routeParams, $firebaseAuth, $location) {

  var ref = new Firebase("https://btr-icn-backup.firebaseapp.com/");
  $scope.authObj = $firebaseAuth(ref)
  
  $scope.createUser = function() {
    $scope.authObj.$createUser({
      email: $scope.email,
      password: $scope.password
    }).then(function(userData) {
      console.log("User " + userData.uid + " created successfully!");

      return $scope.authObj.$authWithPassword({
        email: $scope.email,
        password: $scope.password
      });
    }).then(function(authData) {
      console.log("Logged in as:", authData.uid);
      $location.path( "/settings/"+authData.uid );
    }).catch(function(error) {
      console.error("Error: ", error);
      swal("Email address already in use", "Please try another email address", "error");
    });
  }

});