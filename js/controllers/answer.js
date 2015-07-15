angular.module('btr')
.controller('answerController', function($scope, $http, $routeParams, $firebaseArray, $firebaseObject, $location, $timeout, $route){

	var questionObj = $firebaseObject(new Firebase("https://btr-icn-backup.firebaseapp.com//questions/"+$routeParams.id));
 	$scope.questionData = questionObj.$bindTo($scope, "questionData");
  
  questionObj.$loaded()
  .then(function(data) {
    console.log(data);
  });

	var answerObj = $firebaseObject(new Firebase("https://btr-icn-backup.firebaseapp.com//answers"));
 	$scope.answerData = answerObj.$bindTo($scope, "answerData");

  var date = new Date().getTime();
  var officalAnswerStamp;
  $scope.explanation = "";

  $scope.officalAnswer = function(id, answer) {
    var officalScoreRef = new Firebase("https://btr-icn-backup.firebaseapp.com//answers/" + officalAnswerStamp + "/official/");
    officalScoreRef.update({ id: id, answer: answer, explanation: $scope.explanation });
  }

  // match ref
  var matchId;
  var ref = new Firebase("https://btr-icn-backup.firebaseapp.com/");
  var list = $firebaseArray(ref.child('matches').orderByChild("isCurrent").equalTo(true));
  list.$loaded()
  .then(function(x) {
    console.log(x[0].$id)
    matchId = x[0].$id;
  });
  
  // Disable buttons
  $(function() {
    jQuery.fn.extend({
      disable: function(state) {
        return this.each(function() {
          this.disabled = state;
        });
      }
    });
    $('.admin-select-question').disable(true);
  });

  $scope.postQuestion = function() {
    // $scope.answerData[date] = $scope.questionData;
    officalAnswerStamp = date;
    ref.child('answers/' + date).update({ 
      matchId: matchId,
      questionId: $scope.questionData.$id,
      adminQuestionTitle: $scope.questionData.adminQuestionTitle,
      q1: $scope.questionData.q1,
      q2: $scope.questionData.q2,
      q3: $scope.questionData.q3,
      q4: $scope.questionData.q4,
      questionTitle: $scope.questionData.questionTitle
    });

    $('.loading-overlay').fadeIn();

    $scope.startPost = function() {
      $('.loading-overlay').fadeOut();

      // Count down bar
      var adminTimer = 100;
      var adminTimerCountDown = setInterval(function(){
        $('.progress-bar').width('100%');
        adminTimer = adminTimer - 1;
        $('.progress-bar').width(adminTimer + -10 + '%');
        if(adminTimer == 0){
          adminCountdownFinished();
        }
      }, 150);

      function adminCountdownFinished() {
        // Enable buttons after admin timer
        $('.admin-select-question').disable(false);

        $('.admin-select-question').click( function() {
          clearInterval(adminTimerCountDown);
          $('.progress-bar').attr('aria-valuenow', '100');
          $('.progress-bar').css('width', '100%');         
          $location.path('/answers/');
        });
      }
    }
    $timeout( function(){ $scope.startPost(); }, 3000);  
  }
});
