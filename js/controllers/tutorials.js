angular.module('btr')
.controller('tutorialsController', function($scope, authService){
  authService.user("tutorials")

  $scope.launchTutorial = function() {
  	$('.tutorial-landing-page').fadeOut();
  	$('.tutorial-slides').fadeIn();
  }

  $("#tutorial-slider").owlCarousel({
    navigation : true, // Show next and prev buttons
    slideSpeed : 300,
    paginationSpeed : 400,
    singleItem : true,
    pagination : false,
    navigationText : ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>'],
    addClassActive : true,
    rewindNav : false,
    autoHeight : true
  });

});
