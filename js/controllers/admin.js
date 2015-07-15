angular.module('btr')
.controller('adminController', function($scope, authService, PresenceService){
  authService.user("admin")

  $scope.totalPlayers = PresenceService.getOnlineUserCount();

  $scope.$on('onOnlineUser', function() {
    $scope.$apply(function() {
      $scope.totalPlayers = PresenceService.getOnlineUserCount();
      console.log("Current online users: " + $scope.totalPlayers);
    });
  });

});