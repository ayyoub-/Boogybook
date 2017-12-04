angular.module('fsCordova', ['pascalprecht.translate'])
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

boogybookApp.config(function ($routeProvider, $locationProvider, $translateProvider) {
    $translateProvider.translations('en', {
      TITLE: 'Hello',
      FOO: 'This is a paragraph.',
      BUTTON_LANG_EN: 'english',
      BUTTON_LANG_DE: 'german'
    });
    $translateProvider.translations('de', {
      TITLE: 'Hallo',
      FOO: 'Dies ist ein Paragraph.',
      BUTTON_LANG_EN: 'englisch',
      BUTTON_LANG_DE: 'deutsch'
    });
    if (typeof(window.localStorage['current_lang']) != 'undefined') $translateProvider.preferredLanguage(JSON.parse(window.localStorage['current_lang']).iso_code);
    else {
        var userLang = 'fr';
        if (!window.cordova) {
            userLang = navigator.language || navigator.userLanguage;
            userLang = userLang.substring(0, 2);
        }
        $translateProvider.preferredLanguage('en');
    }
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

boogybookApp.controller('indexCtrl', function ($scope, CordovaService, $location, $rootScope, $translate, $http, $q) {
  $scope.PSExecute = function(remote_function, extra_params) {
          var d = $q.defer();
          var params = {
              shopURL: 'http://www.boogybook.com',
              WS_KEY: 'WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
          };
          params.WS_SOURCE = params.shopURL + '/api';
          var ws_params = {
              ws_key: params.WS_KEY,
              'output_format': 'JSON',
              'rfunc': remote_function,
          }
          if (typeof(extra_params) != 'undefined') {
              for (var key in extra_params) ws_params[key] = extra_params[key];
          }
          $http({
              method: 'GET',
              url: params.WS_SOURCE + '/remote_exec',
              params: ws_params
          }).success(function(data, status, headers, config) {
              if (typeof data !== 'undefined') {
                  console.log('[PSDatas#RemoteExec][Notice] success');
                  d.resolve(data);
              } else {
                  console.log('[PSDatas#RemoteExec][Error] No data found');
                  return d.promise;
              }
          }).error(function(data, status, headers, config) {
              console.log('[PSDatas#RemoteExec][Error] ' + status, data);
              return d.promise;
          });
          return d.promise;
      }
      $scope.PSDatas = function(datas_name, filters, display, index) {
        var d = $q.defer();
        var params = {
            shopURL: 'http://www.boogybook.com',
            WS_KEY: 'WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
        };
        params.WS_SOURCE = params.shopURL + '/api';
        var ws_params = {
            ws_key: params.WS_KEY,
            'output_format': 'JSON'
        }
        if (typeof(display) != 'undefined') ws_params.display = display;
        if (typeof(filters) != 'undefined') {
            for (var key in filters) ws_params['filter[' + key + ']'] = filters[key];
        }
        $http({
            method: 'GET',
            url: params.WS_SOURCE + '/' + datas_name,
            params: ws_params
        }).success(function(data, status, headers, config) {
            var key = datas_name;
            if (datas_name == 'auth') key = 'customers';
            if (typeof data[key] !== 'undefined') {
                console.log('[PSDatas#' + datas_name + '][Notice] success');
                if (typeof(index) != 'undefined') {
                    if (data[key].length - 1 >= index) d.resolve(data[key][index]);
                    else return d.promise;
                } else d.resolve(data[key]);
            } else {
                console.log('[PSDatas#' + datas_name + '][Error] No record found');
                d.resolve({
                    'errors': [{
                        code: 404,
                        message: 'NOT_FOUND'
                    }]
                });
            }
        }).error(function(data, status, headers, config) {
            console.log('[PSDatas#' + datas_name + '][Error] ' + status, data);
            d.resolve({
                'errors': data
            });
        });
        return d.promise;
    }
    $scope.PSExecute('listBBCaseProductsByCategory', {
                'id_category': 24,
            }).then(function(r) {
                if(r.OK){
                    console.log(r);
                }
            });
});
