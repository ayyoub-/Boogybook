angular.module('fsCordova', [])
.service('CordovaService', ['$document', '$q',
  function ($document, $q) {

      var d = $q.defer(),
          resolved = false;

      var self = this;
      this.ready = d.promise;

      document.addEventListener('deviceready', function () {
          resolved = true;
          d.resolve(window.cordova);
      });
      
      setTimeout(function () {
          if (!resolved) {
              if (window.cordova) d.resolve(window.cordova);
          }
      }, 3000);
  }]);


var boogybookApp = angular.module('boogybookApp', ['fsCordova', 'ngRoute']);

boogybookApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/Home', {
            templateUrl: 'app/views/sections.html',
            //controller: 'HomeCtrl'
            controller: 'sectionsCtrl'
        })
    .otherwise({
        redirectTo: '/Home'
    });
});

boogybookApp.controller('indexCtrl', function ($scope, CordovaService, $location, $rootScope) {

});
