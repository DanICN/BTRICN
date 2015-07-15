angular.module('btr')
.controller('liveMatchTeamsheetController', function(authService, $scope, $filter, $http, $routeParams, $firebaseObject, $firebaseArray, $firebaseAuth, $location, $route) {
  
  // login section and auth
  var ref = new Firebase("https://btr-icn-backup.firebaseapp.com/");
  $scope.authObj = $firebaseAuth(ref);
	var authData = $scope.authObj.$getAuth();
	if (authData) {
	  console.log("Logged in as:", authData.uid);
	  $location.path( "/live-match-teamsheet/"+authData.uid );
	} else {
	  console.log("Logged out");
	  $location.path( "/" );
	}
  // user ref 
  var userRef = new Firebase("https://btr-icn-backup.firebaseapp.com//users/"+ authData.uid);
  var syncObject = $firebaseObject(userRef);
  syncObject.$bindTo($scope, "data");

  var list = $firebaseArray(ref.child('matches').orderByChild("isCurrent").equalTo(true));
  list.$loaded()
  .then(function(x) {
    console.log(x[0])
  });
  // make the list available in the DOM
  $scope.list = list;

});
