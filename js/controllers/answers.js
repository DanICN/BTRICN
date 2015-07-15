angular.module('btr')
.controller('answersController', function($scope, authService, $firebaseArray, $firebaseObject, $route, $location, $timeout){

  // questions list
  $scope.questionList = $firebaseArray(authService.ref.child('questions'));
  // current match
  $scope.matchlist = $firebaseArray(authService.ref.child('matches').orderByChild("isCurrent").equalTo(true));
  // answers list - waiting for the matchlist to load first
  $scope.matchlist.$loaded()
  .then(function(x) {
    $scope.answerList = $firebaseArray(authService.ref.child('answers').orderByChild("matchId").equalTo($scope.matchlist[0].$id));
  });
  // live score object
  $firebaseObject(authService.ref.child('liveScore')).$bindTo($scope, "liveScore");
  // scope variables 
  $scope.explanation;
  
  // $scope.message;
  // // variables
  var lastQuestionId;
  var selectAnswer = true;
  // var closeVal = 0;
  var qType;
  var existingQuestion = false;
  // // warn users before sending the question twice !
  var question_title;
  var questionObject = {};
  var motmTimerStart = true;

  // only really used if the user doesnt think that their scores have saved 
  $scope.setScore = function(home, away) {
    $scope.liveScore.homeTeam = home;
    $scope.liveScore.awayTeam = away;
  }
  // ------

  // this should be a service used to refresh the users browsers
  $scope.refresh_pages = function() {
    authService.ref.child('refresh').child('count').transaction(function(currentRank) {
      return currentRank+1;
    });
  }
  authService.ref.child('refresh').on('child_changed', function(childSnapshot) {
    $route.reload();
  });
  // ----

  // this function displays the messages from the live-matches page
  $scope.post_message = function(message) {
    authService.ref.child('message').update({ message: message })
    $scope.message = "";
  }
  // ------
  
  // delete function current not implemented and wording needs to be changed
  // $scope.deleteQuestion = function(id) {
  //   swal({   
  //     title: "Are you sure?",   
  //     text: "This will delete the answer from this list (however the answer will still be associated with the current match) to delete it from the match you will have to go into the matches page",   
  //     type: "warning",   
  //     showCancelButton: true,   
  //     confirmButtonColor: "#DD6B55",   
  //     confirmButtonText: "Yes, delete it!",   
  //     cancelButtonText: "No, cancel plx!",   
  //     closeOnConfirm: false,   
  //     closeOnCancel: false 
  //   }, 
  //   function(isConfirm){   
  //     if (isConfirm) {     
  //       swal("Deleted!", "Your Question file has been deleted.", "success");   
  //       authService.ref.child('answers').child(id).remove();
  //     } else {     
  //       swal("Cancelled", "Your imaginary file is safe :)", "error");   
  //     } 
  //   });
  // }
  // // ------
  $scope.select_question = function(item) {
    $('.explanation').text('');
    $scope.explanation = null;
    // if the question has an explanation it populates the box
    if (item.explanation) {
      $scope.explanation = item.explanation;
      $('.explanation').text(item.explanation);
    };
    // checks that the item has a type question or teamsheet
    if (item.type) {
      // checked for id to see if its an exsiting question
      if (item.$id) {
        lastQuestionId = item.$id;
        existingQuestion = true;
        // strips out $values so that the object can be saved and updated
        $.each(item, function( k, v ) {
          if(!/[$]/g.test(k)) {
            questionObject[k] = v;
          }
        });
      }else{
        existingQuestion = false;
        questionObject = item;
      };
      questionObject['matchId'] = $scope.matchlist[0].$id;

      // reset question text
      $('.question_title').text("");
      $('.q1').text("");
      $('.q2').text("");
      $('.q3').text("");
      $('.q4').text("");
      $('.btr_answer').text("");

      // this is used to slide up and down the elements if they are different types
      if (qType) {
        if (qType != item.type) {
          $('.'+qType).fadeOut('slow', function(){
            $('.'+item.type).slideDown('slow');
          });
        };
      }else{
        $('.'+item.type).slideDown('slow');
      };
      // set question type to item type
      qType = item.type;

      // set question text item text 
      $('.question_title').text(item.questionTitle);
      $('.q1').text(item.q1);
      $('.q2').text(item.q2);
      $('.q3').text(item.q3);
      $('.q4').text(item.q4);

      // set question scope item text 
      $scope.questionTitle = item.questionTitle;
      $scope.q1 = item.q1;
      $scope.q2 = item.q2;
      $scope.q3 = item.q3;
      $scope.q4 = item.q4;

      // Hide unused answer boxes
      $('.question-text').each(function( index ) {
        if ($( this ).text() == "" ) {
          $( this ).parents('.question').hide();
        }else{
          $( this ).parents('.question').show();
        };
      });

      // slide down question_title_block
      $('.question_title_block').slideDown('slow');
      $('.explanation-box').slideDown('slow');
      $('.explanation-button').slideDown('slow');
    };
  }

  $scope.send_question = function() {
    if ($('.question_title').text() != "") {
      if ($('.question_title').text() == question_title) {
        swal({   
          title: "Are you sure?",   
          text: "You want to send the same question out again!",   
          type: "warning",   
          showCancelButton: true,   
          confirmButtonColor: "#DD6B55",   
          confirmButtonText: "Yes, send it!",
          closeOnConfirm: false 
        }, function(){   
          swal("Your question has been sent.", "success");
          sendQuestion();
        });
      }else{
        sendQuestion();
      };
      question_title = $('.question_title').text();
    };
  }

  function sendQuestion() {
    if (existingQuestion) {
      // authService.ref.child('matches').child($scope.matchlist[0].$id)
      //   .child('questions').child(lastQuestionId).update(questionObject);
    }else{
      var messageListRef = authService.ref.child('answers');
      var newMessageRef = messageListRef.push();
          newMessageRef.set(questionObject);
      var path = newMessageRef.toString();

      lastQuestionId = path.split("/")[4];
    };
    $('.answer-is-overlay').fadeIn(250);
    $timeout(function() {
      $('.answer-is-overlay').fadeOut(250);
      motmTimeout();
    }, 5000);
  }

  function motmTimeout(){
    $('.motm_button').attr('disabled', true);
    selectAnswer = false;
    // to do: disable click on the select answer as well 
    $('.progress').slideDown('slow');
    $('.question_countdown').slideDown('slow');

    var startTime = 10;
    var time = 10;

    if (motmTimerStart) {
      var motmTimer = setInterval(function () {
        motmTimerStart = false;
        time = time - 0.1;
        $('.question_countdown').text(time.toFixed(1));
        $('.progress-bar').width( (time.toFixed(1) / startTime) * 100 +'%');
        // console.log(time)
        if (time.toFixed(1) == 0.0) {
          time = 10;
          $('.progress').slideUp('slow');
          $('.question_countdown').slideUp('slow');
          $('.progress-bar').width(100 +'%');
          clearInterval(motmTimer);
          motmTimerStart = true;
          // stops propagation
          $('.motm_button').attr('disabled', false);
          selectAnswer = true;
        };
      }, 100);
    };
  }

  var disableSelectAnswer = false;
  $scope.select_answer = function(answer, num) {
    var answer  = answer, 
        num     = num;

    if (!disableSelectAnswer) {

      if (selectAnswer) {
        if (lastQuestionId) {
          if ($scope.explanation) {
            send_answer_from_select(answer, num);
          }else{
            swal({   
              title: "Are you sure?",   
              text: "You want to send out an answer without an explanation?",   
              type: "warning",   
              showCancelButton: true,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "Yes, send it!",
              cancelButtonText: "No, cancel it!",   
              closeOnConfirm: false,   
              closeOnCancel: false 
            }, function(isConfirm){
              if (isConfirm) {     
                swal("Question sent", "success");
                send_answer_from_select(answer, num);
              } else {     
                swal("Cancelled", "Please enter your explanation below :)", "warning");   
              } 
            });
          };
        }else{
          console.log('sorry you havent posted the question ;)');
        };
      }else{
        console.log('please wait until the timer has finished');
      };

      function send_answer_from_select(answer, num) {
        if ($scope.explanation) {
          authService.ref.child('answers').child(lastQuestionId).update({
            explanation: $scope.explanation
          });
          $('.explanation').text($scope.explanation);
        };
        authService.ref.child('answers').child(lastQuestionId).update({
          answer: answer,
          answerNumber: num
        });

        $('.btr_answer').text("BTR's answer is: "+ answer);
      }

    };

    disableSelectAnswer = true;

    $timeout(function() {
      disableSelectAnswer = false;
    }, 10000);

  }

  $scope.reset_players_scores = function() {
    // here is where the admin will be able to reset all user data i.e. match and global scores
    authService.ref.child('users').once('value', function(dataSnapshot) {
      dataSnapshot.forEach(function(childSnapshot) {
        authService.ref.child('users').child(childSnapshot.key()).child('matchScore').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('matches').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('totalCorrect').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('aveBTRScore').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('correctAnswer').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('played').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('prevPosition').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('leaguePosition').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('score').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('totalCorrect').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('totalMatchesPlayed').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('totalQuestionsAnswered').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('totalScore').remove();
        authService.ref.child('users').child(childSnapshot.key()).child('wrongAnswer').remove();
      });
    });

    authService.ref.child('teamsheets').once('value', function(dataSnapshot) {
      dataSnapshot.forEach(function(childSnapshot) {
        authService.ref.child('teamsheets').child(childSnapshot.key()).child('totalScore').remove();
        authService.ref.child('teamsheets').child(childSnapshot.key()).child('matchScore').remove();
      });
    });
    
    authService.ref.child('leaguePosition').remove();
    authService.ref.child('answers').remove();
    authService.ref.child('scores').remove();
    authService.ref.child('liveScore').update({awayTeam: 0, homeTeam: 0});

  }

});
