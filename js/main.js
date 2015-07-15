// // Online users
// var userList = new Firebase("https://btr-icn-backup.firebaseapp.com//presence/");
// var onlineUserRef = userList.push();

// // Add user to online presence app when connected to app
// var presenceRef = new Firebase("https://btr-icn-backup.firebaseapp.com//.info/connected");
// presenceRef.on("value", function(snap) {
//   if (snap.val()) {
//     onlineUserRef.set(true);
//     // Remove user when disconnected
//     onlineUserRef.onDisconnect().remove();
//   }
// });

// // Number of online users is the number of objects in the presence list.
// userList.on("value", function(snap) {
//   var totalUsersOnline = snap.numChildren();
//   console.log("# of online users = " + totalUsersOnline);
// });

// Click toggle menu
$('.toggle-menu, ul.nav-menu > li > a').click(function() {
  $('.slide-in').toggleClass('on');
});

// Logout
$('#logout').click( function() {
  var ref = new Firebase("https://btr-icn-backup.firebaseapp.com/");
  ref.unauth();
  console.log('Client logged out')
  window.location.replace('/');
});

// Menu swipe functions
$("html").swipe( {
  swipeRight:function(event, direction, distance, duration, fingerCount) {
    // Enter pages to diable menu swipe on
    if(window.location.href.indexOf("tutorials") > 0) {

    }
    else {
      outIn = 'out';
      $('.slide-in').addClass('on');
      console.log('Swiped Right');
    }
  },
  swipeLeft:function(event, direction, distance, duration, fingerCount) {
    // Enter pages to diable menu swipe on
    if(window.location.href.indexOf("tutorials") > 0) {

    }
    else {
	    outIn = 'in';
	    $('.slide-in').removeClass('on');
	    console.log('Swiped Left');
    }
  }
});