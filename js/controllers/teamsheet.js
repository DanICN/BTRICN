angular.module('btr')
.controller('teamsheetController', function(authService, $scope, $http, $routeParams, $firebaseObject, $location){

  var teamsheetsRef = new Firebase("https://btr-icn-backup.firebaseapp.com//teamsheets/"+$routeParams.id);
	var obj = $firebaseObject(teamsheetsRef);
	// to take an action after the data loads, use the $loaded() promise
	obj.$loaded().then(function() {
  	console.log("loaded record:", obj.$id, obj.someOtherKeyInData);

 	});

 	$scope.data = obj;
 	obj.$bindTo($scope, "data");

  // team ref
  var syncObject = $firebaseObject(teamsheetsRef);
  syncObject.$bindTo($scope, "data");

  // Image uploader
  $scope.uploadFile = function() {
    filepicker.setKey("AZGYefKTvWICru5bjIX1Az");

    filepicker.pick(
      function(Blob){
        console.log(Blob.url);

        teamsheetsRef.update({teamImage: Blob.url})
      }
    );
  }

  // // Image uploader
  // var teamImage = document.getElementById('teamImage');

  // teamImage.addEventListener('change', function(e) {
  //   var file = teamImage.files[0];
  //   var imageType = /image.*/;

  //   if (file.type.match(imageType)) {
  //     var reader = new FileReader();
  //     reader.onload = function(e) {
  //       var img = new Image();
  //       img.src = reader.result;
  //       teamsheetsRef.child('teamImage').set(img.src);
  //       // $('#imageUploadSuccess').fadeIn();
  //       // $scope.imgUploadMessageProfile = function() {
  //       //   $('#imageUploadSuccess').fadeOut();
  //       // }
  //       // $timeout( function(){ $scope.imgUploadMessageProfile(); }, 6000);
  //     }
  //     reader.readAsDataURL(file);
  //   }
  // });

 	$scope.delete = function() {
    swal({   
      title: "Are you sure?",   
      text: "You will not be able to recover this team!",   
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
        teamsheetsRef.remove();
        swal("Deleted!", "Team has been deleted.", "success");   
        $location.path('teamsheets');
      } 
      else {     
        swal("Cancelled", "Team not deleted!", "error");   
      } 
    });
  }
});
