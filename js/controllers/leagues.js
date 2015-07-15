angular.module('btr')
.controller('leaguesController', function($scope, authService, $firebaseArray, $firebaseObject, $timeout, $filter) {
  authService.user("leagues")
  $scope.Math = window.Math;
  var $load = $('<div class="loading"></div>').appendTo('body'), db = authService.ref

  db.on('value', function () {
    $timeout(function() {
      $load.hide();
    }, 1000);
  })
  // users list
  $scope.userList = $firebaseArray(authService.ref.child('users'));
  
	$firebaseObject(authService.ref.child('users')).$bindTo($scope, "userObject");

  // league position list
  $scope.leagueList = $firebaseArray(authService.ref.child('leaguePosition').orderByValue());

  var orderBy = $filter('orderBy');

 	var isAveScore = false;
  
  $('.aveBTRScore').hide();

  $scope.scoreList = function() {
   	$('.aveBTRScore').hide();
   	$('.score').show();
  }; 	

  $scope.aveBTRScoreList = function() {
   	$('.score').hide();
   	$('.aveBTRScore').show();
  };	    

  authService.ref.child('users').on('value', function(dataSnapshot) {
	  dataSnapshot.forEach(function(childSnapshot) {
	  	var item = childSnapshot.val();
	  	var key = childSnapshot.key();

		  if(item.score == null){
		  	authService.ref.child('users/'+key ).update({score: 0});
		  }
		  if(item.correctAnswer == null){
		  	authService.ref.child('users/'+key ).update({correctAnswer: 0});
		  }
		  if(item.wrongAnswer == null){
		  	authService.ref.child('users/'+key ).update({wrongAnswer: 0});
		  }

		  if(item.score == 0 || item.correctAnswer == 0 || item.wrongAnswer == 0){
		  	authService.ref.child('users/'+key ).update({aveBTRScore: 0});
		  }else{
			  authService.ref.child('users/'+key ).update({
			  	aveBTRScore: Math.round(item.correctAnswer / (item.correctAnswer + item.wrongAnswer) * 100)
			  });
		  }

		});
	});


  // team list
  $scope.teamList = $firebaseArray(authService.ref.child('teamsheets'));

  $scope.switchLeague = function() {
    $(".player-league, .team-league").toggleClass('hide');
  }
});
