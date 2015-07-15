angular.module('btr')
.controller('signupController', function(authService, $scope, $timeout){

	$scope.splashScreen = function() {
		$('.loading-screen').addClass('fadeOutDown').fadeOut(600);
		$('.login').delay(800).fadeIn();
  }
  $timeout( function(){ $scope.splashScreen(); }, 1000);

});
