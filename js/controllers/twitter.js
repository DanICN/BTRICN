angular.module('btr')
.controller('twitterController', function($scope, authService, $timeout, $window) {
  authService.user("twitter")

  // Init twitter
  $scope.$on('$viewContentLoaded', function() {
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
    $.getScript('https://platform.twitter.com/widgets.js', function() {
      twttr.widgets.load();
      $timeout = twttr.widgets.load();
    });
  });

  // Twitter tweer loader
  $('.twitter-timeline').html('' +
    '<div class="loading-overlay">' +
      '<div class="loading-overlay-text">Loading Tweets...</div>' +
      '<div class="loading"></div>' +
    '</div>');

});