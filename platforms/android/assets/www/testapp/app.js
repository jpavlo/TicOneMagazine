angular.module('app', ['firebase'])
.constant('KEYS', {
    firebase: 'https://magazine.firebaseio.com/',
  })
.run(['$rootScope', 'reBuilder', 'Session', function($rootScope, reBuilder, Session) {
   $rootScope.$on('$routeChangeSuccess', function(event, next, current){
      if(next.locals.currentAuth != null && angular.isUndefined(Session.id)) {
         return reBuilder.andGo(next.locals.currentAuth.uid);
      }
   });
}])


.factory('reBuilder', ['$q', 'Session', 'ActiveUsers', 'Auth', function($q, Session, ActiveUsers, Auth) {
   return {
      andGo: function(id) {
         var defer = $q.defer();
         if(!id) {
            var currAuth = Auth.$getAuth();
            id = currAuth.uid;
         }
         Session.FindKeyRevisit(id).then(function(resp) {
            Session.create(id, resp.$value);
            ActiveUsers.tokenMagic();
            defer.resolve();
         });
         return defer.promise;
      }
   };
}])



.service('Session', ['$q', '$firebase', 'KEYS', function($q, $firebase, KEYS) {
   this.create = function (userId, key) {
      this.id = userId;
      this.key = key;
   };
   this.SetKey = function (id, key) {
      var oref = new Firebase(KEYS.firebase).child('place_of_user_data').child(id).child('key');
      var obj = $firebase(oref).$asObject();
      obj.key = key;
      obj.$save().then(function(ref) {
 
      }, function(error) {
         console.log('Error:', error);
      });
      this.key = key;
   };
   this.FindKeyRevisit = function (id) {
      var promise = $q.defer();
      var oref = new Firebase(KEYS.firebase).child('place_of_user_data').child(id).child('keys').child('key');
      var obj = $firebase(oref).$asObject();
      obj.$loaded().then(function(data) {
         promise.resolve(obj);
      });
      return promise.promise;
   };
   return this;
}])


.factory('ActiveUsers', ['$firebase', 'ActiveUserList', 'Session', 'KEYS', function($firebase, ActiveUserList, Session, KEYS) {
   return {
      tokenMagic: function() {
         var userRef = new Firebase(KEYS.firebase).child('activeusers');
         var theList = $firebase(userRef).$asArray();
         theList.$loaded(function (list) {
            if(Session.key === null || list.$indexFor(Session.key) === -1) {
               list.$add({1: Session.id}).then(function(ref) {
                  Session.SetKey(Session.id, ref.key());
               });
            } else {
               
            }
         });
         var self = [];
         self.ActiveUsers = {};
         theList.$watch(function(event) {
            if(event.event === "child_removed") {
               delete self.ActiveUsers[event.key];
               ActiveUserList.prepForBroadcast(self.ActiveUsers);
            } else {
               var userRef = new Firebase(KEYS.firebase).child('activeusers').child(event.key).child('1');
               var userObj = $firebase(userRef).$asObject();               
               userObj.$loaded( function(data) {
                  self.ActiveUsers[event.key] = {
                     name: data.$value
                  };
                  ActiveUserList.prepForBroadcast(self.ActiveUsers);
               });
            }
         });
      }
   };
}])


.factory('ActiveUserList', ['$rootScope',  function($rootScope) {
   var ActiveUserList = {};
 
   ActiveUserList.prepForBroadcast = function(msg) {
      var self = this;
      self.list = msg;
      self.broadcastItem();
   };
 
   ActiveUserList.broadcastItem = function() {
      $rootScope.$broadcast('handleBroadcast');
   };
 
   return ActiveUserList;
}])


.controller('ListCtrl', ['$scope', 'ActiveUserList', function ($scope, ActiveUserList) {
   var self = this;
   self.ActiveUsers = {};
   $scope.$on('handleBroadcast', function() {
      if(ActiveUserList.list) {
         self.ActiveUsers = ActiveUserList.list;
      }
   });
}]);

