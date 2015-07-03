magazine.controller("CreateController", function($scope, $state, ManageSQlite, $timeout, $cordovaSQLite){




    var fbAuth = fb.getAuth();
    if(fbAuth) {
        //console.log("TAG From facebook " + JSON.stringify(fbAuth));
        //$scope.datas = fbAuth;


        $timeout(function(){
            
            if($scope.faceid.length > 0){
                //alert('mas');
                $state.go("display");
            }

        }, 3000);


    } else {
        $state.go("login");
    }











    $timeout(function getID(){
          var query = "SELECT fbid FROM profile WHERE id = 1";
          $cordovaSQLite.execute(db, query, []).then(function(res) {
              if(res.rows.length > 0) {
                  //console.log("SELECTED -> " + res.rows.item(0).fbid);

                  //SQliteService = {nombre:'valor'};
                  //return SQliteService;
                  //alert(faceid);
                  $scope.faceid = res.rows.item(0).fbid;
                  //return valor;
              } else {
                  console.log("No results found");
              }
              //return SQliteService;
          }, function (err) {
              console.error(err);
          });
          //return valor;
    }, 1000);



    // $scope.id = ManageSQlite.getid('1');
    // alert($scope.id);

    $scope.create = function(){
      fb.onAuth(function(authData) {
        if (authData) {
          fb.child("users").child(authData.uid).set({
            provider: authData.provider,
            name: authData.facebook.displayName,
            email: authData.facebook.email,
            picture: authData.facebook.cachedUserProfile.picture.data.url
          });
          ManageSQlite.insert(authData.uid, authData.facebook.displayName, authData.facebook.email, authData.facebook.cachedUserProfile.picture.data.url);
          alert('User created');
          $state.go("display");
        }
      });
    };


    $scope.logout = function(){
      fb.unauth();
      $state.go("login");
    };



function userExistsCallback(userId, exists) {
  if (exists) {
    $state.go("display");
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