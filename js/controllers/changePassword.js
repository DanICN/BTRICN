angular.module('btr')
.controller('changePasswordController', function($scope, authService, $routeParams, $firebaseObject, $firebaseArray, $firebaseAuth, $location) {
  authService.user("change-password");

  var authData = $firebaseAuth(authService.ref).$getAuth();
  if (authData) {
    $scope.email = authData.password.email;
    console.log("User email is:", authData.password.email);
  } 
  else {
    console.log("Logged out");
  }
  
  $scope.changePassword = function(current, newPassword, confirm) {
    if (newPassword === confirm) {
      console.log(current, newPassword, confirm);
      authService.ref.changePassword({
        email       : $scope.email,
        oldPassword : current,
        newPassword : newPassword
      }, function(error) {
        if (error === null) {
          console.log("Password changed successfully");
          swal("Password Changed", "","success");
          $location.path('settings/:id');
          $scope.$apply();
        } else {
          console.log("Error changing password:", error);
          swal("Incorrect password", "","error");
        }
      });
    }
    else{
      swal("Passwords do not match", "","error");
      console.log('Passwords do not match');
    }
  }
  
});
