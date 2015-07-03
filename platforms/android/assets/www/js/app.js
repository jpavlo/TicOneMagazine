
var magazine = angular.module('starter', ['ionic', 'ngCordova', 'firebase', 'ngStorage']);
var fb = new Firebase('https://magazine.firebaseio.com/');
var db = null;
var wifiStatus = '';

magazine.run(function($ionicPlatform, $cordovaSQLite, $rootScope, $cordovaNetwork, $cordovaPush) {


  var androidConfig = {
    "senderID": "1078791502856",
  };



  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  // create db
  if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("myapp.db");
    } else {
      // Ionic serve syntax
      db = window.openDatabase("myapp.db", "1.0", "My app", -1);
    }
  //db = $cordovaSQLite.openDB( 'my' + '.db');
  $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS profile (id integer primary key, fbid text, name text, email text, picture text, website text)");


    // check network
    var type = $cordovaNetwork.getNetwork();
    var isOnline = $cordovaNetwork.isOnline();
    var isOffline = $cordovaNetwork.isOffline();
    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      var onlineState = networkState;
      $rootScope.networkState = onlineState;
    })
    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      var offlineState = networkState;
      $rootScope.networkState = offlineState;
    })


    $cordovaPush.register(androidConfig).then(function(deviceToken) {
      // Success
      console.log("deviceToken: " + deviceToken)
        // var userReference = fb.child("android/");
        // var syncArray = $firebaseArray(userReference.child("GCM"));
        // alert(syncArray);
        // syncArray.$add({userToken: result, created_at: new Date().getTime()}).then(function() {
        //         console.log("TAG resultado: " + result);
        //     });
    }, function(err) {
      // Error
      //alert(err);
      alert("Registration error: " + err)
    })

    $rootScope.$on('$cordovaPush:notificationReceived, $routeChangeStart', function(event, notification, next, current) {
      console.log('TEST ***********: ' + notification.event);
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            alert('exito success registration ID = ' + notification.regid);
            console.log('exito success registration ID = ' + notification.regid);
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });



    // WARNING: dangerous to unregister (results in loss of tokenID)
    $cordovaPush.unregister(options).then(function(result) {
      // Success!
      console.log("TAG resultado: " + result);

    }, function(err) {
      // Error
    })



  });
});


magazine.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state("display", {
    url: "/display",
    templateUrl: "templates/display.html",
    controller: "DisplayController"
  })
    .state("create", {
    url: "/create",
    templateUrl: "templates/create.html",
    controller: "CreateController",
  })
    .state("login", {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: "LoginController",
    cache: false
  });
  $urlRouterProvider.otherwise("/login");
});



magazine.factory("ManageSQlite", function($cordovaSQLite){

      var SQliteService = {};




      SQliteService.insert = function(fbId, name, email, picture) {
        var query = "INSERT INTO profile (fbid, name, email, picture) VALUES (?,?,?,?)";

        $cordovaSQLite.execute(db, query, [fbId, name, email, picture]).then(function(res) {
          console.log("INSERT ID -> " + res.insertId);
        }, function (err) {
          console.log(err);
        });
      };


      SQliteService.select = function() {
          var query = "SELECT fbid FROM profile WHERE id = 1";
          $cordovaSQLite.execute(db, query, []).then(function(res) {
              if(res.rows.length > 0) {
                  //console.log("SELECTED -> " + res.rows.item(0).fbid);
                  //return res.rows.item(0).fbid;
                  //SQliteService = {nombre:'valor'};
                  //return SQliteService;
                  //alert(faceid);
              } else {
                  console.log("No results found");
              }
              //return SQliteService;
          }, function (err) {
              console.error(err);
          });
          return SQliteService;
      };




  return SQliteService;
});



