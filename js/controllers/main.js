angular.module('btr')
.controller('mainController', function($scope, authService, PresenceService, $modal, $http, $routeParams, $firebaseObject, $firebaseArray, $firebaseAuth, $location) {
  authService.user("user")
  $scope.Math = window.Math;

  // check user data has been loaded first...
  $firebaseObject(authService.ref).$loaded()
    .then(function(data) {

      if ($scope.data.totalScore && $scope.data.totalMatchesPlayed) {
        $scope.aveScorePerGame = Math.round($scope.data.totalScore / $scope.data.totalMatchesPlayed);
      };
      if ($scope.data.totalCorrect && $scope.data.totalQuestionsAnswered) {
        $scope.aveAccuracy = Math.round(($scope.data.totalCorrect / $scope.data.totalQuestionsAnswered) * 100);
      };

      authService.ref.child('leaguePosition').orderByValue().on("value", function(snapshot) {
        var position = snapshot.numChildren() + 1;

        snapshot.forEach(function(data) {
          position -= 1;
          authService.ref.child('users').child(data.key()).update({
            leaguePosition: position
          })
        });
      });

    });


  function countdownTimer(time) {
    var daytime = time.split(' ')[1]
    var day = time.split(".")[0]
    var month = time.split(".")[1]
    var year = time.split(".")[2].split(" ")[0]
    var date = year+'/'+month+'/'+day+' '+daytime;
    return date;
  }

  // match list
  $scope.matchlist = $firebaseArray(authService.ref.child('matches').orderByChild("isCurrent").equalTo(true));
  
  $scope.matchlist.$watch(function(event) {
    if ($scope.matchlist[0]) {

      $(".dateCountdown").countdown(countdownTimer($scope.matchlist[0].matchTime), function(event) {
        $(this).text(
          event.strftime('%D %H %M %S')
        );
        var timeToKickOff = $(".dateCountdown").text();
        if (timeToKickOff == "00 00 00 00") {
          $(this).text('IN PLAY');
          $('.btn-join-game').slideDown('slow');
          $('.next-match').slideUp('slow');
          $('.time-format').slideUp('slow');
        }else{
          $('.btn-join-game').slideUp('slow');
          $('.next-match').slideDown('slow');
          $('.time-format').slideDown('slow');
        }
      });
    };
  });


  // to take an action after the data loads, use the $loaded() promise
  // 
  // // "2015/03/24  12:56:56"


  // message ref
  var messageRef = new Firebase("https://btr-icn-backup.firebaseapp.com//message/");
  var messageObj = $firebaseObject(messageRef);
  messageObj.$bindTo($scope, "messageData");

  messageRef.on('child_changed', function(dataSnapshot) {
    if (dataSnapshot.key() === 'message') {
      console.log(dataSnapshot.key())
      $('.myModal').modal('show');
    }else{
      $('.myModal').modal('hide');
    };
  });

  $scope.totalPlayers = PresenceService.getOnlineUserCount();

  $scope.$on('onOnlineUser', function() {
    $scope.$apply(function() {
      $scope.totalPlayers = PresenceService.getOnlineUserCount();
      console.log("Current online users: " + $scope.totalPlayers);
    });
  });

});