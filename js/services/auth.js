angular.module('btr')
.service('authService', function($rootScope, $routeParams, $firebaseObject, $firebaseArray, $firebaseAuth, $location) {
	var ref = new Firebase("https://btr-icn-backup.firebaseapp.com/");

	return {
		ref: ref,
		user: function(path) {
		  // login section and auth
		  $rootScope.authObj = $firebaseAuth(ref);
		  var authData = $rootScope.authObj.$getAuth();
		  if (authData) {
		    console.log("Logged in as:", authData.uid);
		    userEmail = authData.password.email;
		    $location.path( "/"+path+"/"+authData.uid );
		  } else {
		    console.log("Logged out");
		    $location.path( "/" );
		  }

		  var userRef = new Firebase("https://btr-icn-backup.firebaseapp.com//users/"+ authData.uid);
		  var syncObject = $firebaseObject(userRef);
		  syncObject.$bindTo($rootScope, "data");

		}
	}

});
