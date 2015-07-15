angular.module('btr')
.controller('settingsController', function($scope, authService, $firebaseArray, $timeout, $route) {
  authService.user("settings")
  
  // team list
  var list = $firebaseArray(authService.ref.child('teamsheets'));
  $scope.list = list;

  $scope.currentTeamId;

  $scope.favoriteTeam = function(item){
    $scope.data.favoriteTeam = item.teamName;
    $scope.data.favoriteTeamId = item.$id;
    $scope.data.favoriteTeamImage = item.teamImage;
    console.log($scope.currentTeamId)

    authService.ref.child('teamsheets').child(item.$id).child('supporters').transaction(function(currentRank) {
      if (currentRank) {
        return currentRank + 1;
      }else{
        return currentRank = 1;
      };
    });

    if ($scope.currentTeamId) {
      authService.ref.child('teamsheets').child($scope.currentTeamId).child('supporters').transaction(function(currentRank) {
        if (currentRank) {
          console.log(currentRank);
          return currentRank - 1;
        }else{
          console.log('billy no fans :(');
        };
      });
    }
  }

  $scope.currentTeam = function() {
    if ($scope.data.favoriteTeamId) {
      $scope.currentTeamId = $scope.data.favoriteTeamId;
    };
  }

  // Image uploader
  $scope.uploadFile = function() {
    filepicker.setKey("AZGYefKTvWICru5bjIX1Az");

    filepicker.pick(
      function(Blob){
        console.log(Blob.url);

        $scope.data.profileImage = Blob.url;
        $route.reload();

      }
    );
  }

});