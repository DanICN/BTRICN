angular.module('btr')
  .controller('liveMatchesController', function ($scope, authService, PresenceService, $timeout, $interval, $modal, $http, $routeParams, $route, $firebaseObject, $firebaseArray, $firebaseAuth, $location) {
  authService.user("live-matches");
  $scope.Math = window.Math;

  var $load = $('<div class="loading"></div>').appendTo('body'), db = authService.ref

  db.on('value', function () {
    $timeout(function() {
      $load.hide();
    }, 1000);
  })

  $scope.totalPlayers = PresenceService.getOnlineUserCount();

  $scope.$on('onOnlineUser', function () {
    $scope.$apply(function () {
      $scope.totalPlayers = PresenceService.getOnlineUserCount();
      // console.log("Current online users: " + $scope.totalPlayers);
    });
  });

  // this section it used to refresh the browser (controlled by the ref)
  authService.ref.child('refresh').on('child_changed', function (childSnapshot, prevChildName) {
    $route.reload();
  });
  // end of refresh ----

  // matches list
  var matchlist = $firebaseArray(authService.ref.child('matches').orderByChild("isCurrent").equalTo(true));
  $scope.matchlist = matchlist;

  // answers list
  $scope.answerList = $firebaseArray(authService.ref.child('answers'));
  // answers object
  $firebaseObject(authService.ref.child('answers')).$bindTo($scope, "answersObject");

  // fave team object
  $firebaseObject(authService.ref.child('teamsheets')).$bindTo($scope, "teamObject");

  // live score ref
  var liveScore = $firebaseObject(authService.ref.child('liveScore'));
  liveScore.$bindTo($scope, "liveScore");

  // message service
  var messageRef = new Firebase("https://btr-icn-backup.firebaseapp.com//message/");
  var messageObj = $firebaseObject(authService.ref.child('message'));
  messageObj.$bindTo($scope, "messageData");
  messageRef.on('child_changed', function (dataSnapshot) {
    $('.myModal').modal('show');
  });

  // variables
  var initialPageLoad = true;
  var qType;
  var questionObject;
  var playerScore;
  var refOfficialAnswer;
  var motmTimerStart = true;

  // scope variables 
  $scope.lastQuestionId;
  $scope.questionSnapshot;
  $scope.disableSelectAnswer = false;

  authService.ref.child('answers').on('value', function (dataSnapshot) {
    if (!dataSnapshot.val()) {
      initialPageLoad = false;
    };
  });

  authService.ref.child('answers').limitToLast(1).on('child_added', function (dataSnapshot, prev) {
    if (!initialPageLoad) {
      document.getElementById('whistle').play();
      $('.answer-is-overlay').fadeIn(250);
      $('.progress-bar').width('100%');
      $timeout(function() {
        $('.answer-is-overlay').fadeOut(250);
        $('.question-modal').modal('show');
        question_selected(dataSnapshot.key(), dataSnapshot.val());
        newQuestionTimer();
      }, 3000);
    };
    initialPageLoad = false;
  });

  function question_selected(key, item) {

    $scope.lastQuestionId = key;
    $scope.questionSnapshot = item;
    // $('.whistle').slideUp('slow');
    // set question text item text 
    $('.question_title').text(item.questionTitle);
    $('.q1').text(item.q1);
    $('.q2').text(item.q2);
    $('.q3').text(item.q3);
    $('.q4').text(item.q4);

    $scope.q1 = item.q1;
    $scope.q2 = item.q2;
    $scope.q3 = item.q3;
    $scope.q4 = item.q4;

    // $('.question_title').slideDown('slow');
    if (item.type == "question_section") {
      $('.teamsheet_section').hide();
      $('.question_section').show();
    }else{
      $('.question_section').hide();
      $('.teamsheet_section').show();
    };

    $('.' + item.type).slideDown('slow');
    // Hide unused answer boxes
    $('.question-text').each(function (index) {
      if ($(this).text() == "") {
        $(this).parents('.question').hide();
      } else {
        $(this).parents('.question').show();
      };
    });
  }

  function newQuestionTimer() {
    $('.progress').slideDown('slow');
    $('.question_countdown').slideDown('slow');

    questionTimer();
  }

  var matchTimer;
  var startTime = 10;
  var time = 10;
  var fixedTime;
 
  function setTimer() {
    $scope.disableSelectAnswer = false;
    motmTimerStart = false;
    startTime = startTime - 0.1;
    fixedTime = startTime.toFixed(1);
    $('.question_countdown').text(fixedTime);
    $('.progress-bar').width((fixedTime / time) * 100 + '%');
    playerScore = Math.round((fixedTime / time) * 10);
    // console.log(fixedTime / startTime)
    if (fixedTime == 0.0) {
      startTime = 10;
      // $('.' + $scope.questionSnapshot.type).slideUp('slow');
      $('.question-modal').modal('hide');
      resets();
      $interval.cancel(matchTimer);
      motmTimerStart = true;
    };
  }

  function questionTimer() {
    startTime = 10;
    matchTimer = $interval(function(){ setTimer() }, 100);
  }
  
  var playerClass;
  $scope.select_answer = function (answer, num) {
    // this is to check the modal doesnt just stay there ....
    removeModal();

    $interval.cancel(matchTimer);
    if (!$scope.disableSelectAnswer) {

      $('.btn-team').attr('disabled','disabled');
      playerClass = $('.q'+num+'_option_player')
      playerClass.addClass('activated');
      
      $scope.disableSelectAnswer = true;
      resetValues();

      authService.ref.child('answers').child($scope.lastQuestionId).child('player_answers').child($scope.data.$id).update({
        answer: answer,
        answerNumber: num,
        points: playerScore
      });
      
      // to add a match ref and be able to count how many matches played
      authService.ref.child('scores')
        .child($scope.data.$id).child('match')
        .child($scope.matchlist[0].$id)
        .child('question')
        .child($scope.lastQuestionId)
        .update({
        answer: answer
      });

      var playerSeconds = 10 - playerScore;
      $('.question_score').slideDown('slow').text('Your answer was ' + answer + ' and you answered in ' + playerSeconds + ' second(s)');
      $('.q' + num).parents('.question').addClass('user-answer');
      $('.q_' + num).addClass('user-answer');
    };
  };

  function removeModal() {
    $timeout(function(){
      if ($('body').hasClass('modal-open')) {
        console.log(      $('body').hasClass( 'modal-open' )        );
        $('.question-modal').modal('hide');
        resets();
      };
    }, 20000);
  }

  var scoreFirstLoad = true;
  authService.ref.child('scores').on('value', function (dataSnapshot) {
    if (scoreFirstLoad) {
      scoreFirstLoad = false;
    }else{
      authService.ref.child('scores').child($scope.data.$id).child('match').once('value', function (dataSnapshot) {
        var totalQuestions = 0;
        var matchObj = {};
        $scope.data.totalMatchesPlayed = dataSnapshot.numChildren();

        dataSnapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key();
          var val = childSnapshot.val();
          var num = childSnapshot.child('question').numChildren();
          totalQuestions += num;
          matchObj[key] = num;
        });

        $scope.data.totalQuestionsAnswered = totalQuestions;
        $scope.data.matches = matchObj;
      });
    };
  });
  
  // we need to check that the child changed is the btr new answer not a players answer!
  authService.ref.child('answers').on('child_changed', function (dataSnapshot) {
    console.log(dataSnapshot)
    if (dataSnapshot.val().answer) {
      if (dataSnapshot.val().answer != refOfficialAnswer) {

        $scope.disableSelectAnswer = true;
        
        $('.refAnswer').text("The official answer was: " + dataSnapshot.val().answer);

        if (dataSnapshot.val().type == "question_section") {
          $('.q' + dataSnapshot.val().answerNumber + '_option').addClass('admin-answer-circle').html('<i class="correct-check fa fa-check"></i>');
        }else{
          $('.q' + dataSnapshot.val().answerNumber + '_option_player').addClass('admin-answer-circle').html('<span class"ref_answer_span">' + dataSnapshot.val().answer + '</span><i style="margin-left:8px;" class="correct-check fa fa-check"></i>');
        };

        refereeAnswer(dataSnapshot.key(), dataSnapshot.val());
        question_selected(dataSnapshot.key(), dataSnapshot.val());
        // questionTimer();
      };
      refOfficialAnswer = dataSnapshot.val().answer;
    };
    percentages(dataSnapshot);
  });

  function percentages(dataSnapshot) {
    var numberOfAnswers = dataSnapshot.child('player_answers').numChildren();
    var obj = {};
    dataSnapshot.child('player_answers').forEach(function (data) {
      if (obj[data.val().answerNumber]) {
        obj[data.val().answerNumber].push(data.val());
      }else {
        obj[data.val().answerNumber] = [];
        obj[data.val().answerNumber].push(data.val());
      }
    });
    $.each(obj, function (key, value) {
      console.log(key + ": " + obj[key].length);
      var percent = Math.round(obj[key].length / numberOfAnswers * 100) + "%";
      $('.playerbase-percentage-' + key).text(percent);
    });
  }

  authService.ref.child('leaguePosition').orderByValue().on("value", function (snapshot) {
    var position = snapshot.numChildren() + 1;
    snapshot.forEach(function (data) {
      position -= 1;
      authService.ref.child('users').child(data.key()).update({
        leaguePosition: position
      });
    });
  });

  function resets() {
    // $('.progress').slideUp('slow');
    // $('.whistle').slideDown('slow');
    // $('.question_title').slideUp('slow');
    // $('.question_countdown').slideUp('slow');
    // $('.explanation-box').slideUp('slow');
    // $('.question_score').hide();

    $('.btn-team').removeAttr('disabled');
    if (playerClass) {
      playerClass.removeClass('activated');
    };

    $('.explanation').text("");
    $('.question-text').text("");
    $('.q1').text("");
    $('.q2').text("");
    $('.q3').text("");
    $('.q4').text("");
    $('.ref_answer_span').remove();
    $('.question_score').text("");
    $('.refAnswer').text("");
    resetValues();
  }

  function resetValues() {
    // this will be run to reset all the values...
    // remove answer style
    $('.question').removeClass('user-answer');
    $('.question').removeClass('admin-answer');
    $('.q1_option').removeClass('admin-answer-circle').html('A');
    $('.q2_option').removeClass('admin-answer-circle').html('B');
    $('.q3_option').removeClass('admin-answer-circle').html('C');
    $('.q4_option').removeClass('admin-answer-circle').html('D');
    $('.option_player').removeClass('admin-answer-circle');
    $('.fa-check').remove();
    $('.fa-times').remove();

    // set percentages to ""
    $('.playerbase-percentage').text("");
  }

  function refereeAnswer(key, item) {
    if (item.player_answers && item.player_answers[$scope.data.$id]) {

      // only show the modal to players who answered the question
      $('.question-modal').modal('show');
      document.getElementById('crowd').play();

      var user_answer = item.player_answers[$scope.data.$id];
      // adding user answer ticks
      $('.q' + user_answer.answerNumber).parents('.question').addClass('user-answer');

      if (item.explanation) {
        $('.explanation').text(item.explanation);
        $('.explanation-box').slideDown('slow');
      };

      if (user_answer.answer == item.answer) {

        $('.question_score').slideDown('slow').text('Well done :) your answer was ' + user_answer.answer + ' and you scored ' + user_answer.points + ' points');
        
        if (item.type == "question_section") {
          $('.q' + user_answer.answerNumber + '_option').addClass('admin-answer-circle').html('<i class="correct-check fa fa-check"></i>');
        }else{
          $('.q' + item.answerNumber + '_option_player').addClass('admin-answer-circle').html('<span class"ref_answer_span">' + item.answer + '</span><i style="margin-left:8px;" class="correct-check fa fa-check"></i>');
        };

        var totalUserScore;
        var totalMatchScore;
        var totalMatchCorrect;
        var totalTeamScore;
        var totalMatchTeamScore;
        var totalCorrectAnswers;

        // user total score
        if ($scope.data.totalScore) {
          totalUserScore = user_answer.points + $scope.data.totalScore;
        } else {
          totalUserScore = user_answer.points;
        };
        // user correct answers increment
        if ($scope.data.totalCorrect) {
          totalCorrectAnswers = $scope.data.totalCorrect + 1;
        } else {
          totalCorrectAnswers = 1;
        };
        // user match score
        if ($scope.data.matchScore) {
          if ($scope.data.matchScore[$scope.matchlist[0].$id]) {
            if ($scope.data.matchScore[$scope.matchlist[0].$id].totalScore) {
              totalMatchScore = user_answer.points + $scope.data.matchScore[$scope.matchlist[0].$id].totalScore;
            } else {
              totalMatchScore = user_answer.points;
            };
            // correct answer increment
            if ($scope.data.matchScore[$scope.matchlist[0].$id].totalCorrect) {
              totalMatchCorrect = $scope.data.matchScore[$scope.matchlist[0].$id].totalCorrect + 1;
            } else {
              totalMatchCorrect = 1;
            };
            
          } else {
            totalMatchScore = user_answer.points;
            totalMatchCorrect = 1;
          };
        } else {
          totalMatchScore = user_answer.points;
          totalMatchCorrect = 1;
        };

        // this is for working out the league position also will be used for btr ave ... to be added 
        var leaguePositionObject = {};
        authService.ref.child('users').once('value', function (dataSnapshot) {
          dataSnapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key();
            var val = childSnapshot.val();
            if (val.leaguePosition) {
              authService.ref.child('users').child(key).update({
                prevPosition: val.leaguePosition
              });
            };
            if (val.totalScore) {
              leaguePositionObject[key] = val.totalScore;
            } else {
              leaguePositionObject[key] = 0;
            };
          });
        });
        authService.ref.child('leaguePosition').update(leaguePositionObject);

        authService.ref.child('users').child($scope.data.$id).update({
          totalScore: totalUserScore,
          totalCorrect: totalCorrectAnswers
        });
        authService.ref.child('users').child($scope.data.$id).child('matchScore').child($scope.matchlist[0].$id).update({ 
          totalCorrect: totalMatchCorrect,
          totalScore: totalMatchScore
        });

        // team total score
        if ($scope.teamObject[$scope.data.favoriteTeamId].totalScore) {
          totalTeamScore = user_answer.points + $scope.teamObject[$scope.data.favoriteTeamId].totalScore;
        } else {
          totalTeamScore = user_answer.points;
        };

        // team match score
        if ($scope.teamObject[$scope.data.favoriteTeamId].matchScore && $scope.teamObject[$scope.data.favoriteTeamId].matchScore[$scope.matchlist[0].$id] && $scope.teamObject[$scope.data.favoriteTeamId].matchScore[$scope.matchlist[0].$id].totalScore) {
          // problem here...          
          // totalMatchTeamScore = user_answer.points + $scope.data.matchScore[$scope.matchlist[0].$id].totalScore;
        } else {
          totalMatchTeamScore = user_answer.points;
        };

        authService.ref.child('teamsheets').child($scope.data.favoriteTeamId).update({ totalScore: totalTeamScore });
        // problem here...
        // authService.ref.child('teamsheets').child($scope.data.favoriteTeamId).child('matchScore').child($scope.matchlist[0].$id).update({ totalScore: totalMatchTeamScore });

      } else {
        var playerSeconds = 10 - user_answer.points;
        $('.question_score').slideDown('slow').text('Sorry :( your answer was ' + user_answer.answer + ' and you answered in ' + playerSeconds + ' second(s)');
        
        if (item.type == "question_section") {
          $('.q' + user_answer.answerNumber + '_option').addClass('admin-answer-circle').html('<i class="incorrect-check fa fa-times"></i>');
        }else{
          $('.q' + user_answer.answerNumber + '_option_player').addClass('admin-answer-circle').html('<span class"ref_answer_span">' + user_answer.answer + '</span><i style="margin-left:8px;" class="incorrect-check fa fa-times"></i>');
        };

      };

      refereeAnswerDoubleTime = true;
      
    }

    $timeout(function() {
      $('.question-modal').modal('hide');
      resets();
    }, 10000);


  }

});
 