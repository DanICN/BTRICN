angular.module('btr')
.controller('performancesController', function($scope, authService, $firebaseArray, $firebaseObject){
  authService.user("performances")
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

  // matches list
  var list = $firebaseArray(authService.ref.child('matches'));
  $scope.list = list;


});
