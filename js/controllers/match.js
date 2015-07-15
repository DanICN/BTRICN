angular.module('btr')
.controller('matchController', function(authService, $scope, $http, $routeParams, $firebaseArray, $firebaseObject, $location, $filter){
  // team list
  $scope.teamList = $firebaseArray(authService.ref.child('teamsheets'));

  var matchesRef = new Firebase("https://btr-icn-backup.firebaseapp.com//matches/"+$routeParams.id);

  var obj = $firebaseObject(matchesRef);
  $scope.data = obj;
  obj.$bindTo($scope, "data");

  $scope.teamA = function(item){
    $scope.data.homeTeam = item;
    $scope.data.homeTeamId = item.$id;
  }

  $scope.teamB = function(item){
    $scope.data.awayTeam = item;
    $scope.data.awayTeamId = item.$id;
  }

  $('#datetimepicker').datetimepicker({
    format:'d.m.Y H:i'
  });

  $('#datetimepicker').change(function(){
    matchesRef.update({matchTime: $(this).val()})
  });

  $scope.delete = function() {
    swal({   
      title: "Are you sure?",   
      text: "You will not be able to recover this match!",   
      type: "warning",   
      showCancelButton: true,   
      confirmButtonColor: "#DD6B55",   
      confirmButtonText: "Yes, delete it!",   
      cancelButtonText: "No, cancel please!",   
      closeOnConfirm: false,   
      closeOnCancel: false 
    }, 
    function(isConfirm){   
      if (isConfirm) {     
        matchesRef.remove();
        swal("Deleted!", "Match has been deleted.", "success");   
        $location.path('matches');
      } 
      else {     
        swal("Cancelled", "Match not deleted!", "error");   
      } 
    });
  }
});