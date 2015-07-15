angular.module('btr')
.controller('loginController', function(authService, $scope, $http, $routeParams, $firebaseAuth, $location) {
  var ref = new Firebase("https://btr-icn-backup.firebaseapp.com/");
  $scope.authObj = $firebaseAuth(ref);
  

	var authData = $scope.authObj.$getAuth();
	if (authData) {
	  console.log("Logged in as:", authData.uid);
	  $location.path( "/user/"+authData.uid );
	} else {
	  console.log("Logged out");
	}

	$scope.submit = function(){
		document.getElementById('whistle').play();
		// this is the code from
		// https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-users-and-authentication-authwithpasswordcredentials-options
	  $scope.authObj.$authWithPassword({
		  email: $scope.user.email,
		  password: $scope.user.password
		}).then(function(authData) {
		  console.log("Logged in as:", authData.uid);
		  $location.path( "/user/"+authData.uid );
		}).catch(function(error) {
		  console.error("Authentication failed:", error);
		  swal("Incorrect email or password", "Please try again", "error");  
		});
	}

});
