magazine.controller("DisplayController", function($scope, $state, $ionicHistory, $firebaseArray, $cordovaCamera, ManageSQlite, $cordovaSQLite, $localStorage, $timeout){



    // fb.onAuth(function(authData) {
    //   //console.log(authData);
    //   if (authData && isNewUser) {
    //     // save the user's profile into Firebase so we can list users,
    //     // use them in Security and Firebase Rules, and show profiles
    //     // fb.child("users").child(authData.uid).set({
    //     //   provider: authData.provider,
    //     //   name: getName(authData)
    //     // });

    //   var fbAuth = fb.getAuth();
    //   if(fb.child("users/" + fbAuth.uid).length > 0) {
    //     //user existç
    //     console.log('existe');
    //   } else {
    //     fb.child("users").child(authData.uid).set({
    //       provider: authData.provider,
    //       name: getName(authData)
    //     });
    //   }


    //   }else{
    //     $state.go("login");
    //   }
    // });


    // function getName(authData) {
    //   switch(authData.provider) {
    //      case 'password':
    //        return authData.password.email.replace(/@.*/, '');
    //      case 'twitter':
    //        return authData.twitter.displayName;
    //      case 'facebook':
    //        return authData.facebook.displayName;
    //   }
    // }


    //$scope.id = [];
    


        // $timeout (function(){
        // $scope.id = ManageSQlite.select();
        // $scope.id = ManageSQlite.select();
        // }, 1000);



    
    // $timeout(function(){
        
    //     if($scope.faceid.length > 0){
    //         //alert('mas');
    //     }else{
    //         //alert('less');
    //     }

    // }, 3000);






    // $timeout(function getID(){
    //       var query = "SELECT fbid FROM profile WHERE id = 1";
    //       $cordovaSQLite.execute(db, query, []).then(function(res) {
    //           if(res.rows.length > 0) {
    //               //console.log("SELECTED -> " + res.rows.item(0).fbid);

    //               //SQliteService = {nombre:'valor'};
    //               //return SQliteService;
    //               //alert(faceid);
    //               $scope.faceid = res.rows.item(0).fbid;
    //               //return valor;
    //           } else {
    //               console.log("No results found");
    //           }
    //           //return SQliteService;
    //       }, function (err) {
    //           console.error(err);
    //       });
    //       //return valor;
    // }, 1000);
    
    //console.log('Debe ser: ' + $scope.faceid.nombre);






        // if($localStorage.hasOwnProperty("accessToken") === true) {
        //     //$scope.token = $localStorage.accessToken;
        // } else {

        // }


    $scope.logout = function(){
      fb.unauth();
      $state.go("login");
    };
// 

    $ionicHistory.clearHistory();

    $scope.images = [];

    var fbAuth = fb.getAuth();
    if(fbAuth) {
        var userReference = fb.child("users/" + fbAuth.uid);
        var syncArray = $firebaseArray(userReference.child("images"));
        $scope.images = syncArray;
        console.log($scope.images);

    } else {
        $state.go("login");
    }

    $scope.upload = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            syncArray.$add({image: imageData, created_at: new Date().getTime()}).then(function() {
                alert("Image has been uploaded");
            });
        }, function(error) {
            console.log(error);
        });
    }






 
function userExistsCallback(userId, exists) {
  if (exists) {
    alert('user ' + userId + ' exists!');
  } else {
    alert('user ' + userId + ' does not exist!');
  }
}
 
// Tests to see if /users/<userId> has any data. 
function checkIfUserExists(userId) {
    var userReference = fb.child("users/");
  userReference.child(userId).once('value', function(snapshot) {
    var exists = (snapshot.val() !== null);
    userExistsCallback(userId, exists);
    console.log(exists);
  });
}







});