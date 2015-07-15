angular.module('btr')
.controller('forgotPasswordController', function(authService, $scope, $http, $routeParams, $firebaseAuth, $location) {

  var ref = new Firebase("https://btr-icn-backup.firebaseapp.com/");

  $scope.forgotPassword = function(){
    ref.resetPassword({
        email : $scope.email
      }, function(error) {
      if (error === null) {
        console.log("Password reset email sent successfully");
        swal("Password reset sent", "", "success");
        $location.path('#/login');
        $scope.$apply();
      } else {
        console.log("Error sending password reset email:", error);
        swal("Password reset sent", "", "success");
        $location.path('#/login');
        $scope.$apply();
      }
    });
  }
});