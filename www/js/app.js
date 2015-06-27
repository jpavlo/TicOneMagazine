
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
          $state.go("articles");
        }
      }, {
        scope: "email,user_likes" // the permissions requested
      });
    };

});

magazine.controller("ArticleController", function($scope, $state){

    var isNewUser = true;

    fb.onAuth(function(authData) {
      if (authData && isNewUser) {
        // save the user's profile into Firebase so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        fb.child("users").child(authData.uid).set({
          provider: authData.provider,
          name: getName(authData)
        });
      }else{
        $state.go("login");
      }
    });

    // find a suitable name based on the meta info given by each provider
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

    $scope.logout = function(){
      fb.unauth();
      $state.go("login");
    };


});

