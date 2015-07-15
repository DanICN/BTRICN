angular.module('btr')
.controller('fixtureController', function($scope, $firebaseAuth, $routeParams, $firebaseObject, $route, $location) {
  // login section and auth
  var ref = new Firebase("https://btr-icn-backup.firebaseapp.com/");
  $scope.authObj = $firebaseAuth(ref);
  var authData = $scope.authObj.$getAuth();
  if (authData) {
    console.log("Logged in as:", authData.uid);
    $location.path( "/fixture/"+authData.uid+"/"+$routeParams.match_id);
  } else {
    console.log("Logged out");
    $location.path( "/" );
  }
  // user ref 
  var syncObject = $firebaseObject(ref.child('users/'+ authData.uid));
  syncObject.$bindTo($scope, "data");

  // match ref
  function countdownTimer(time) {
    var daytime = time.split(' ')[1]
    var day = time.split(".")[0]
    var month = time.split(".")[1]
    var year = time.split(".")[2].split(" ")[0]
    var date = year+'/'+month+'/'+day+' '+daytime;
    return date;
  }

  var matchobj = $firebaseObject(ref.child('matches/'+ $routeParams.match_id));
  $scope.matchData = matchobj;

  matchobj.$loaded().then(function() {
    $(".dateCountdown").countdown(countdownTimer($scope.matchData.matchTime), function(event) {
      $(".days").text(
        event.strftime('%D')
         // event.strftime('%D day(s) %H:%M:%S')
      );
      $(".hrs").text(
        event.strftime('%H')
      );
      $(".mins").text(
        event.strftime('%M')
      );
      $(".secs").text(
        event.strftime('%S')
      );
    });
  });


});
