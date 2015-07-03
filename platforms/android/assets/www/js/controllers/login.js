magazine.controller("LoginController", function($scope, $state, ManageSQlite, $localStorage, $timeout, $cordovaSQLite){

    $scope.login = function() {
      fb.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log('TAG accessToken: ' + authData.facebook.accessToken);
          $localStorage.accessToken = authData.facebook.accessToken;
          $state.go("display", {}, {reload: true});
        }
      }, {
        scope: "email,user_likes" // the permissions requested
      });
    };



    //     $scope.id = ManageSQlite.select('1');
    // alert($scope.id);


 var fbAuth = fb.getAuth();
    if(fbAuth) {
        //console.log("TAG From facebook " + JSON.stringify(fbAuth));
        //$scope.datas = fbAuth;


        $timeout(function(){
            
            if(fbAuth.uid !== ''){
                //alert('mas');
                $state.go("display");
            }

        }, 1000);


    }



    // $timeout(function getID(){
    //       var query = "SELECT fbid FROM profile WHERE id = 1";
    //       $cordovaSQLite.execute(db, query, []).then(function(res) {
    //           if(res.rows.length > 0) {
    //               //console.log("SELECTED -> " + res.rows.item(0).fbid);

    //               //SQliteService = {nombre:'valor'};
    //               //return SQliteService;
    //               //alert(faceid);
    //               $scope.faceid = res.rows.item(0).fbid;
    //               console.log($scope.faceid);
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





});