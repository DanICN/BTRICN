angular.module('btr', ['ngRoute', 'firebase', 'ui.bootstrap'])
.factory('PresenceService', ['$rootScope',
  function($rootScope) {
    var onlineUsers = 0;

    // Create our references
    var listRef = new Firebase('https://btr-icn-backup.firebaseapp.com//presence/');
    var onlineUserRef = listRef.push(); // This creates a unique reference for each user
    var presenceRef = new Firebase('https://btr-icn-backup.firebaseapp.com//.info/connected');

    // Add ourselves to presence list when online.
    presenceRef.on('value', function(snap) {
      if (snap.val()) {
        onlineUserRef.set(true);
        // Remove ourselves when we disconnect.
        onlineUserRef.onDisconnect().remove();
      }
    });

    // Get the user count and notify the application
    listRef.on('value', function(snap) {
      onlineUsers = snap.numChildren();
      $rootScope.$broadcast('onOnlineUser');
    });

    var getOnlineUserCount = function() {
      return onlineUsers;
    }

    // !important this is the main config of the app and must
    // be registered first after all the dependencies!
    return {
      getOnlineUserCount: getOnlineUserCount
    }
  }
]);