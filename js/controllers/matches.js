angular.module('btr')
.controller('matchesController', function($scope, authService, $firebaseArray){
  // matches list
  $scope.list = $firebaseArray(authService.ref.child('matches'));

  // team list
  $scope.teamList = $firebaseArray(authService.ref.child('teamsheets'));

  $scope.data = {};

  $scope.live_match = function(item) {
    authService.ref.child('matches').once('value', function(dataSnapshot) {    
      dataSnapshot.forEach(function(childSnapshot) {
        new Firebase('https://btr-icn-backup.firebaseapp.com//matches/'+ childSnapshot.key() ).update({ isCurrent: false });
      });
    });

    item.isCurrent = true;
    $scope.list.$save(item)
  }

  $scope.teamData = function(team, item) {
    console.log(item, team)
    $('.'+team).text(item.teamName);
    if (team == "homeTeam") {
      $scope.data.homeTeam = item;
      $scope.data.homeTeamId = item.$id;
    }else{
      $scope.data.awayTeam = item;
      $scope.data.awayTeamId = item.$id;
    };
  }

  $('#datetimepicker').datetimepicker({
    format:'d.m.Y H:i'
  });

  $('#datetimepicker').change(function(){
    $scope.data.matchTime = $(this).val();
  });

  $scope.add_new_match = function() {
    // console.log($scope.data)
    $scope.list.$add($scope.data)
    swal("Match Created!", "", "success")
  }


});