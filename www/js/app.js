
var magazine = angular.module('starter', ['ionic', 'ngCordova', 'firebase']);
var fb = new Firebase('https://magazine.firebaseio.com/');

magazine.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


magazine.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state("articles", {
    url: "/articles",
    templateUrl: "templates/articles.html",
    controller: "ArticleController"
  })
    .state("login", {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: "LoginController",
    cache: false
  });
  $urlRouterProvider.otherwise("/articles");
});

magazine.controller("LoginController", function($scope, $state){

    $scope.login = function() {
      fb.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          // the access token will allow us to make Open Graph API calls
          console.log(authData.facebook.accessToken);

          //var isNewUser = true;

          fb.onAuth(function(authData) {
            if (authData && exist() != true) {
              // save the user's profile into Firebase so we can list users,
              // use them in Security and Firebase Rules, and show profiles
              fb.child("users").child(authData.uid).set({
                provider: authData.provider,
                name: getName(authData)
              });
            }
          });

        function getName(authData) {
          switch(authData.provider) {
             case 'password':
               return authData.password.email.replace(/@.*/, '');
             case 'twitter':
               return authData.twitter.displayName;
             case 'facebook':
               return authData.facebook.displayName;
          }
        }


          $state.go("articles");
        }
      }, {
        scope: "email,user_likes" // the permissions requested
      });
    };

    function exist(authData){
      var fbAuth = fb.getAuth();
          if(authData.uid === fbAuth.uid){
            return true;
          }else{
            return false;
          }
    };

});

magazine.controller("ArticleController", function($scope, $state, $ionicHistory, $firebaseArray, $cordovaCamera){



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

    $scope.logout = function(){
      fb.unauth();
      $state.go("login");
    };


    $ionicHistory.clearHistory();

    $scope.images = [];

    var fbAuth = fb.getAuth();
    if(fbAuth) {
        var userReference = fb.child("users/" + fbAuth.uid);
        var syncArray = $firebaseArray(userReference.child("images"));
        $scope.images = syncArray;

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
            syncArray.$add({image: imageData}).then(function() {
                alert("Image has been uploaded");
            });
        }, function(error) {
            console.log(error);
        });
    }

});

